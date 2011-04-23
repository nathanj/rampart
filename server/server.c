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

#include "list.h"

#include "key.h"

#define max(x,y) ((x) > (y) ? (x) : (y))

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
	printf("accepting connections on port %d\n", listen_port);
	listen(s, 10);
	return s;
}

static int accept_client(int socket)
{
	unsigned int l = 0;
	struct sockaddr_in client_address = {0};
	int r = 0;

	memset(&client_address, 0, l = sizeof(client_address));
	r = accept(socket, (struct sockaddr *) &client_address, &l);
	if (r == -1) {
		perror("accept()");
	}

	printf("connect from %d %s\n", r,
			inet_ntoa(client_address.sin_addr));

	return r;
}

#define SHUT(x) do {                \
	if ((x) >= 0) {                 \
		shutdown((x), SHUT_RDWR);   \
		close((x));                 \
		printf("closing " # x "\n");\
		(x) = -1;                   \
	}                               \
} while (0)

#define BUF_SIZE 4096

struct client
{
	int fd;
	char in[BUF_SIZE];
	int in_len;
	char out[BUF_SIZE];
	int out_len;

	int finished_headers;

	struct list_head list;
};

int handle_input(struct client *client, struct client *client_list)
{
	struct client *other = NULL;

	if (client->finished_headers)
	{
		/* Relay any data to other clients. */

		if (client->in_len > 0)
		{
			client->in[client->in_len-1] = '\0';
			printf("fd=%d is relaying: %d %s\n", client->fd, client->in_len, client->in+1);
			client->in[client->in_len-1] = '\xff';

			list_for_each_entry(other, &client_list->list, list)
			{
				if (other->fd != client->fd)
				{
					memcpy(other->out, client->in, client->in_len);
					other->out_len = client->in_len;
					printf("fd=%d len=%d\n", other->fd, other->out_len);
				}
			}

			client->in_len = 0;
		}
	}
	else
	{
		/* Send the response. */
		char *p = NULL, *start = NULL;
		char *key1 = NULL, *key2 = NULL, *key3 = NULL;
		char *origin = NULL;
		char *host = NULL;
		char response[16] = {0};
		int i = 0;

		start = client->in;
		while (*start)
		{
			p = strchr(start, '\r');

			if (p)
			{
				*p++ = '\0'; /* remove \r */
				*p++ = '\0'; /* remove \n */

				/* We are at the blank line, the rest is data. */
				if (start == p-2)
					break;
			}
			else
			{
				break;
			}

			if ( strncmp(start, "Sec-WebSocket-Key1: ",
						strlen("Sec-WebSocket-Key1: ")) == 0 )
			{
				start += strlen("Sec-WebSocket-Key1: ");
				key1 = strdup(start);
			}
			else if ( strncmp(start, "Sec-WebSocket-Key2: ",
						strlen("Sec-WebSocket-Key2: ")) == 0 )
			{
				start += strlen("Sec-WebSocket-Key2: ");
				key2 = strdup(start);
			}
			else if ( strncmp(start, "Origin: ",
						strlen("Origin: ")) == 0 )
			{
				start += strlen("Origin: ");
				origin = strdup(start);
			}
			else if ( strncmp(start, "Host: ",
						strlen("Host: ")) == 0 )
			{
				start += strlen("Host: ");
				host = strdup(start);
			}

			start = p;
		}

		if (p)
			key3 = strdup(p);

		assert(key1);
		assert(key2);
		assert(key3);
		assert(origin);
		assert(host);

		compute_response(key1, key2, key3, response);

		client->out_len = snprintf(client->out, BUF_SIZE,
				"HTTP/1.1 101 Web Socket Protocol Handshake\r\n"
				"Upgrade: WebSocket\r\n"
				"Connection: Upgrade\r\n"
				"Sec-WebSocket-Origin: %s\r\n"
				"Sec-WebSocket-Location: ws://%s/\r\n"
				"Access-Control-Allow-Origin: null\r\n"
				"Access-Control-Allow-Credentials: true\r\n"
				"Access-Control-Allow-Headers: content-type\r\n"
				"\r\n", origin, host);

		for (i = 0; i < 16; i++)
			client->out[client->out_len++] = response[i];

		client->out[client->out_len] = '\0';

		client->finished_headers = 1;
	}

	return 0;
}

int main(int argc, char **argv)
{
	int socket = -1;
	struct client *client = NULL;
	struct list_head *pos = NULL, *q = NULL;

	struct client client_list;
	INIT_LIST_HEAD(&client_list.list);

	signal(SIGPIPE, SIG_IGN);

	socket = listen_socket(9999);
	if (socket == -1)
		exit(EXIT_FAILURE);

	for (;;) {
		int r, nfds = 0;
		fd_set rd, wr, er;

		FD_ZERO(&rd);
		FD_ZERO(&wr);
		FD_ZERO(&er);
		FD_SET(socket, &rd);
		nfds = max(nfds, socket);

		/* Build up the fd_sets for select. */
		list_for_each_entry(client, &client_list.list, list)
		{
			if (client->fd >= 0)
			{
				FD_SET(client->fd, &rd);
				FD_SET(client->fd, &er);
				if (client->out_len > 0)
				{
					FD_SET(client->fd, &wr);
					printf("fd=%d len=%d good for writing!\n",
							client->fd, client->out_len);
				}
				nfds = max(nfds, client->fd);
			}
		}

		r = select(nfds + 1, &rd, &wr, &er, NULL);

		if (r == -1 && errno == EINTR)
			continue;

		if (r == -1) {
			perror("select()");
			exit(EXIT_FAILURE);
		}

		if (FD_ISSET(socket, &rd)) {
			r = accept_client(socket);

			if (r != -1)
			{
				struct client *client = calloc(1, sizeof(struct client));

				client->fd = r;

				printf("adding client %p fd=%d\n", client, client->fd);
				list_add_tail(&(client->list), &(client_list.list));
			}
		}

		list_for_each_entry(client, &client_list.list, list)
		{
			/* Check error. */
			if (client->fd >= 0 && FD_ISSET(client->fd, &er)) {
				char c;

				r = recv(client->fd, &c, 1, MSG_OOB);
				if (r < 1)
					SHUT(client->fd);

				printf("oob?\n");
			}

			/* Check read. */
			if (client->fd >= 0 && FD_ISSET(client->fd, &rd)) {
				r = read(client->fd, client->in, BUF_SIZE);
				if (r < 1)
				{
					SHUT(client->fd);
				}
				else
				{
					client->in_len = r;
					handle_input(client, &client_list);
				}
			}

			/* Check write. */
			if (client->fd >= 0 && FD_ISSET(client->fd, &wr)) {
				r = write(client->fd, client->out, client->out_len);
				if (r < 1)
					SHUT(client->fd);

				client->out_len = 0;
				client->out[0] = '\0';
			}
		}

		/* Delete all clients which no longer have an open socket. */
		list_for_each_safe(pos, q, &client_list.list)
		{
			client = list_entry(pos, struct client, list);
			if (client->fd == -1)
			{
				printf("deleting client %p\n", client);
				list_del(pos);
				free(client);
			}
		}
	}

	exit(EXIT_SUCCESS);
}
