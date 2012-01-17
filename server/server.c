#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/time.h>
#include <sys/types.h>
#include <string.h>
#include <signal.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <errno.h>
#include <assert.h>

#include <event.h>

#include "list.h"

#include "key.h"
#include "rampart.h"

static struct list_head client_list;
static struct event_base *base;

static int listen_socket(int listen_port)
{
	struct sockaddr_in a;
	int s;
	int yes;

	if ((s = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
		perror("socket");
		return -1;
	}
	yes = 1;
	if (setsockopt(s, SOL_SOCKET, SO_REUSEADDR,
		       (char *) &yes, sizeof(yes)) == -1) {
		perror("setsockopt");
		close(s);
		return -1;
	}
	memset(&a, 0, sizeof(a));
	a.sin_port = htons(listen_port);
	a.sin_family = AF_INET;
	if (bind(s, (struct sockaddr *) &a, sizeof(a)) == -1) {
		perror("bind");
		close(s);
		return -1;
	}
	dbg("accepting connections on port %d\n", listen_port);
	listen(s, 10);
	return s;
}

static int accept_client(int socket)
{
	unsigned int l = 0;
	struct sockaddr_in client_address = { 0 };
	int r = 0;

	memset(&client_address, 0, l = sizeof(client_address));
	r = accept(socket, (struct sockaddr *) &client_address, &l);
	if (r == -1) {
		perror("accept()");
	}

	dbg("connect from %d %s\n", r,
	    inet_ntoa(client_address.sin_addr));

	return r;
}

static int starts_with(const char *haystack, const char *needle)
{
	return strncmp(haystack, needle, strlen(needle)) == 0;
}

static int handle_handshake(struct client *client)
{
	/* Send the response. */
	char *p = NULL;
	char *start = NULL;
	char *line = NULL;
	int line_alloced = 0;
	char response[32] = { 0 };

	start = client->in;
	while (*start) {
		p = strchr(start, '\r');

		if (p) {
			*p++ = '\0';	/* remove \r */
			*p++ = '\0';	/* remove \n */

			/* We are at the blank line, the rest is data. */
			if (start == p - 2) {
				client->finished_headers = 1;
				break;
			}
		} else {
			client->partial_line = strdup(start);
			client->in_len = 0;
			break;
		}

		if (client->partial_line) {
			asprintf(&line, "%s%s", client->partial_line, start);
			line_alloced = 1;
			FREE(client->partial_line);
		} else {
			line = start;
			line_alloced = 0;
		}

		start = line;

		if (starts_with(start, "Sec-WebSocket-Key: ")) {
			start += strlen("Sec-WebSocket-Key: ");
			client->key = strdup(start);
		} else if (starts_with(start, "Sec-WebSocket-Version: ")) {
			start += strlen("Sec-WebSocket-Version: ");
			client->version = atoi(start);
		}

		if (line_alloced)
			FREE(line);

		start = p;
	}

	if (!client->finished_headers)
		return 1;

	assert(client->version >= 8);
	assert(client->key);

	compute_response(client->key, response);

	client->out_len =
		snprintf(client->out, BUF_SIZE,
			 "HTTP/1.1 101 Switching Protocols\r\n"
			 "Upgrade: WebSocket\r\n"
			 "Connection: Upgrade\r\n"
			 "Sec-WebSocket-Accept: %s\r\n"
			 "\r\n",
			 response);

	client->out[client->out_len] = '\0';

	event_add(client->ev_write, NULL);

	client->in_len = 0;

	if (client->finished_headers) {
		FREE(client->key);
		FREE(client->partial_line);
	}

	return 0;
}

/* Handles a standard websocket frame (sort of). We can cheat a bit here
 * since we always expect a non-fragmented text frame. */
static int handle_websocket_frame(struct client *client,
				  struct list_head *client_list)
{
	char *in = client->in;
	char *buffer;
	int i;
	unsigned char mask[4];
	unsigned int packet_length = 0;

	while (client->in_len > 0) {
		/* Expect a finished text frame. */
		assert(in[0] == '\x81');

		packet_length = ((unsigned char) in[1]) & 0x7f;

		mask[0] = in[2];
		mask[1] = in[3];
		mask[2] = in[4];
		mask[3] = in[5];

		/* Unmask the payload. */
		for (i = 0; i < packet_length; i++)
			in[6 + i] ^= mask[i % 4];

		asprintf(&buffer, "%.*s", packet_length, in + 6);

		dbg("fd=%d is relaying: %s\n", client->fd, buffer);

		handle_message(buffer, client, client_list);

		client->in_len -= packet_length + 6;
		in += packet_length + 6;
		free(buffer);
	}

	return 0;
}

/* Handle input received from a client. Input can be either the initial
 * handshake or a game message. */
static int handle_input(struct client *client, struct list_head *client_list)
{
	if (client->finished_headers)
		handle_websocket_frame(client, client_list);
	else
		handle_handshake(client);

	return 0;
}

static void delete_client(struct client *client)
{
	dbg("deleting client %p %p\n", client, &client->list);

	list_del(&client->list);

	event_free(client->ev_read);
	event_free(client->ev_write);

	shutdown(client->fd, SHUT_RDWR);
	close(client->fd);

	free(client);
}

static void write_client(int fd, short event, void *arg)
{
	int len;
	struct client *client = (struct client *) arg;

	dbg("write_client called with fd: %d, event: %d, arg: %p\n",
	    fd, event, arg);

	len = write(client->fd, client->out, client->out_len);

	if (len == -1) {
		perror("write");
		return;
	} else if (len == 0) {
		dbg("fd %d closed\n", client->fd);
		delete_client(client);
		return;
	}

	client->out_len = 0;
	client->out[0] = '\0';
}

static void read_client(int fd, short event, void *arg)
{
	int len;
	struct client *client = (struct client *) arg;

	dbg("read_client called with fd: %d, event: %d, arg: %p, len=%d\n",
	    fd, event, arg, client->in_len);

	len = read(client->fd, client->in + client->in_len,
		   BUF_SIZE - client->in_len - 1);

	if (len == -1) {
		perror("read");
		return;
	} else if (len == 0) {
		dbg("fd %d closed\n", client->fd);
		delete_client(client);
		return;
	}

	client->in_len += len;
	handle_input(client, &client_list);
}

static void read_socket(int fd, short event, void *arg)
{
	int r;

	dbg("read_socket called with fd: %d, event: %d, arg: %p\n", fd,
	    event, arg);

	r = accept_client(fd);

	if (r != -1) {
		struct client *client = calloc(1, sizeof(struct client));

		client->fd = r;
		client->ev_read = event_new(base, client->fd,
					    EV_READ | EV_PERSIST,
					    read_client, client);
		client->ev_write = event_new(base, client->fd,
					     EV_WRITE, write_client, client);

		dbg("adding client %p fd=%d\n", client, client->fd);
		list_add_tail(&(client->list), &client_list);

		event_add(client->ev_read, NULL);
	}
}


static void stop()
{
	event_base_free(base);
	exit(EXIT_SUCCESS);
}

int main(int argc, char **argv)
{
	int socket = -1;
	struct event socket_ev;

	INIT_LIST_HEAD(&client_list);

	signal(SIGINT, stop);
	signal(SIGPIPE, SIG_IGN);

	socket = listen_socket(9999);
	if (socket == -1)
		exit(EXIT_FAILURE);

	base = event_base_new();

	event_assign(&socket_ev, base, socket, EV_READ | EV_PERSIST,
		     read_socket, NULL);
	event_add(&socket_ev, NULL);

	dbg("dispatch\n");
	event_base_dispatch(base);

	exit(EXIT_SUCCESS);
}

