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

#include <event.h>

#include "list.h"

#include "key.h"
#include "rampart.h"

static struct event_base *base;

static int listen_socket(int listen_port)
{
	struct sockaddr_in a;
	int s;
	int yes;

	s = socket(AF_INET, SOCK_STREAM, 0);
	if (s == -1) {
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
	unsigned int size = 0;
	struct sockaddr_in client_address;
	int r = 0;

	size = sizeof(client_address);
	memset(&client_address, 0, size);
	r = accept(socket, (struct sockaddr *) &client_address, &size);
	if (r == -1) {
		perror("accept()");
		return r;
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
	int rc;

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
			rc = asprintf(&line, "%s%s",
				      client->partial_line, start);
			if (rc == -1) {
				dbg("asprintf: %s\n", strerror(errno));
				return -1;
			}

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

	if (client->version < 8) {
		dbg("unsupported websocket version: %d\n", client->version);
		return -1;
	}
	if (!client->key) {
		dbg("client did not give a key\n");
		return -1;
	}

	rc = compute_response(client->key, response);
	if (rc != 0) {
		dbg("failed to compute response: %d\n", rc);
		return -1;
	}

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
static int handle_websocket_frame(struct client *client)
{
	char *in = client->in;
	char *buffer;
	unsigned int i;
	unsigned char mask[4];
	unsigned int packet_length = 0;
	int rc;

	while (client->in_len > 0) {
		/* Expect a finished text frame. */
		if (in[0] != '\x81') {
			dbg("unexpected websocket frame: 0x%02x\n", in[0]);
			return -1;
		}

		packet_length = ((unsigned char) in[1]) & 0x7f;

		mask[0] = in[2];
		mask[1] = in[3];
		mask[2] = in[4];
		mask[3] = in[5];

		/* Unmask the payload. */
		for (i = 0; i < packet_length; i++)
			in[6 + i] ^= mask[i % 4];

		rc = asprintf(&buffer, "%.*s", packet_length, in + 6);
		if (rc == -1) {
			perror("asprintf");
			return -1;
		}

		dbg("fd=%d is relaying: %s\n", client->fd, buffer);

		handle_message(buffer, client);

		client->in_len -= packet_length + 6;
		in += packet_length + 6;
		free(buffer);
	}

	return 0;
}

/* Handle input received from a client. Input can be either the initial
 * handshake or a game message. */
static int handle_input(struct client *client)
{
	if (client->finished_headers)
		return handle_websocket_frame(client);
	else
		return handle_handshake(client);
}

static void delete_client(struct client *client)
{
	dbg("deleting client %p\n", client);

	end_client(client);

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

	(void) fd;
	(void) event;

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

	(void) fd;
	(void) event;

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
	handle_input(client);
}

static void read_socket(int fd, short event, void *arg)
{
	int r;

	(void) event;
	(void) arg;

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
	int port = 9999;
	int i;

	signal(SIGINT, stop);
	signal(SIGPIPE, SIG_IGN);

	for (i = 1; i < argc; i++) {
		if (strcmp(argv[i], "-d") == 0)
			debug_on = 1;
		else
			port = atoi(argv[i]);
	}

	socket = listen_socket(port);
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

