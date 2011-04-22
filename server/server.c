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
	struct client *tmp = NULL;

	if (client->finished_headers)
	{
		/* Relay any data to other clients. */

		if (client->in_len > 0)
		{
			client->in[client->in_len-1] = '\0';
			printf("fd=%d is relaying: %d %s\n", client->fd, client->in_len, client->in+1);
			client->in[client->in_len-1] = '\xff';

			list_for_each_entry(tmp, &client_list->list, list)
			{
				if (tmp->fd != client->fd)
				{
					memcpy(tmp->out, client->in, client->in_len);
					tmp->out_len = client->in_len;
					printf("fd=%d len=%d\n", tmp->fd, tmp->out_len);
				}
			}

			client->in_len = 0;

			//memcpy(client->out, "\0hi \xff", 5);
			//client->out_len = 5;
		}
	}
	else
	{
		/* Send the response. */
		char *p = NULL, *start = NULL;
		char *key1 = NULL, *key2 = NULL, *key3 = NULL;
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

			if ( strncmp(start, "Sec-WebSocket-Key1",
						strlen("Sec-WebSocket-Key1")) == 0 )
			{
				start += strlen("Sec-WebSocket-Key1: ");
				key1 = strdup(start);
			}
			else if ( strncmp(start, "Sec-WebSocket-Key2",
						strlen("Sec-WebSocket-Key2")) == 0 )
			{
				start += strlen("Sec-WebSocket-Key2: ");
				key2 = strdup(start);
			}

			start = p;
		}

		if (p)
			key3 = strdup(p);

		compute_response(key1, key2, key3, response);

		client->out_len = snprintf(client->out, BUF_SIZE,
				"HTTP/1.1 101 Web Socket Protocol Handshake\r\n"
				"Upgrade: WebSocket\r\n"
				"Connection: Upgrade\r\n"
				"Sec-WebSocket-Origin: null\r\n"
				"Sec-WebSocket-Location: ws://localhost:9999/\r\n"
				"Access-Control-Allow-Origin: null\r\n"
				"Access-Control-Allow-Credentials: true\r\n"
				"Access-Control-Allow-Headers: content-type\r\n"
				"\r\n");

		for (i = 0; i < 16; i++)
			client->out[client->out_len++] = response[i];

		client->out[client->out_len] = '\0';

		client->finished_headers = 1;
	}

	return 0;
}

int main(int argc, char **argv)
{
	int h = -1;
	struct client *tmp = NULL;

	struct client myclient;
	INIT_LIST_HEAD(&myclient.list);

	signal(SIGPIPE, SIG_IGN);

	h = listen_socket(9999);
	if (h == -1)
		exit(EXIT_FAILURE);

	for (;;) {
		int r, nfds = 0;
		fd_set rd, wr, er;

		FD_ZERO(&rd);
		FD_ZERO(&wr);
		FD_ZERO(&er);
		FD_SET(h, &rd);
		nfds = max(nfds, h);

		list_for_each_entry(tmp, &myclient.list, list)
		{
			if (tmp->fd >= 0)
			{
				FD_SET(tmp->fd, &rd);
				FD_SET(tmp->fd, &er);
				if (tmp->out_len > 0)
				{
					FD_SET(tmp->fd, &wr);
					printf("fd=%d len=%d good for writing!\n", tmp->fd, tmp->out_len);
				}
				nfds = max(nfds, tmp->fd);
			}
		}

		r = select(nfds + 1, &rd, &wr, &er, NULL);

		if (r == -1 && errno == EINTR)
			continue;

		if (r == -1) {
			perror("select()");
			exit(EXIT_FAILURE);
		}

		if (FD_ISSET(h, &rd)) {
			unsigned int l;
			struct sockaddr_in client_address;

			memset(&client_address, 0, l = sizeof(client_address));
			r = accept(h, (struct sockaddr *) &client_address, &l);
			if (r == -1) {
				perror("accept()");
			} else {
				struct client *tmp = calloc(1, sizeof(struct client));

				tmp->fd = r;

				list_add_tail(&(tmp->list), &(myclient.list));

				printf("connect from %d %s\n", r,
						inet_ntoa(client_address.sin_addr));
			}
		}

		list_for_each_entry(tmp, &myclient.list, list)
		{
			if (tmp->fd >= 0)
			{
				/* Check error. */
				if (FD_ISSET(tmp->fd, &er)) {
					char c;

					r = recv(tmp->fd, &c, 1, MSG_OOB);
					if (r < 1)
						SHUT(tmp->fd);

					printf("oob?\n");
				}

				/* Check read. */
				if (FD_ISSET(tmp->fd, &rd)) {
					r = read(tmp->fd, tmp->in, BUF_SIZE);
					if (r < 1)
						SHUT(tmp->fd);
					else
					{
						tmp->in_len = r;
						handle_input(tmp, &myclient);
					}
				}

				/* Check write. */
				if (FD_ISSET(tmp->fd, &wr)) {
					r = write(tmp->fd, tmp->out, tmp->out_len);
					if (r < 1)
						SHUT(tmp->fd);

					tmp->out_len = 0;
					tmp->out[0] = '\0';
				}

			}
		}
	}

	exit(EXIT_SUCCESS);
}
