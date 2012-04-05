#include <assert.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>

#define HTTP_HEADER \
"GET / HTTP/1.1\r\n" \
"Upgrade: websocket\r\n" \
"Connection: Upgrade\r\n" \
"Host: localhost:9999\r\n" \
"Origin: http://localhost\r\n" \
"Sec-WebSocket-Key: ukqKDunDeNbXRUqF+YhPCg==\r\n" \
"Sec-WebSocket-Version: 13\r\n" \
"\r\n"

#define HTTP_RESPONSE \
"HTTP/1.1 101 Switching Protocols\r\n" \
"Upgrade: WebSocket\r\n" \
"Connection: Upgrade\r\n" \
"Sec-WebSocket-Accept: n+nY2mrteGObPcUFP8/kIZE4eXk=\r\n" \
"\r\n"

int child;

int spawn_server()
{
	int pid = fork();
	if (pid == -1) {
		perror("fork");
		return -1;
	}

	if (pid == 0) {
		execl("./server", "./server", NULL);
		perror("exec");
		abort();
	}

	return pid;
}

int write_frame(int sockfd, const char *str)
{
	unsigned char *buf = NULL;
	size_t len;
	unsigned int i;
	int rc;

	len = strlen(str);

	assert(len < 128);

	buf = malloc(len + 6);

	buf[0] = '\x81';
	buf[1] = 0x80 | (len & 0xff);

	/* Set the mask to zeros so that there is effectively no mask. */
	buf[2] = 0;
	buf[3] = 0;
	buf[4] = 0;
	buf[5] = 0;

	for (i = 0; i < len; i++) {
		buf[6 + i] = str[i];
	}

	rc = write(sockfd, buf, len + 6);
	if (rc == -1) {
		perror("write");
	}

	free(buf);

	return rc;
}

int read_frame(int sockfd, char *buf, size_t len)
{
	int rc;
	int i;

	rc = read(sockfd, buf, len);
	if (rc == -1) {
		perror("read");
		return -1;
	}

	assert(buf[0] = '\x81');

	for (i = 0; i < rc - 2; i++) {
		buf[i] = buf[i+2];
	}

	buf[rc - 2] = 0;

	return rc;
}

int connect_to_server()
{
	struct addrinfo hints, *res;
	int sockfd = -1;
	int rc;
	int retry = 10;

	memset(&hints, 0, sizeof(hints));
	hints.ai_family = AF_UNSPEC;
	hints.ai_socktype = SOCK_STREAM;

	rc = getaddrinfo("127.0.0.1", "9999", &hints, &res);
	if (rc < 0) {
		printf("getaddrinfo: %s\n", gai_strerror(rc));
		return -1;
	}

	sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
	if (sockfd == -1) {
		perror("socket");
		return -1;
	}
	while (retry-- > 0) {
		rc = connect(sockfd, res->ai_addr, res->ai_addrlen);
		if (rc != -1)
			break;
		if (rc == -1 && errno != ECONNREFUSED)
			break;
		usleep(5000);
	}
	if (rc == -1) {
		perror("connect");
		return -1;
	}

	freeaddrinfo(res);

	return sockfd;
}

int connect_websocket()
{
	int sockfd = -1;
	char buf[1024];
	int rc;

	sockfd = connect_to_server();
	if (sockfd == -1) {
		return -1;
	}

	rc = write(sockfd, HTTP_HEADER, strlen(HTTP_HEADER));
	if (rc == -1) {
		perror("write");
		return -1;
	}

	rc = read(sockfd, buf, sizeof(buf));
	if (rc == -1) {
		perror("read");
		return -1;
	}
	buf[rc] = '\0';
	assert(strcmp(buf, HTTP_RESPONSE) == 0);

	return sockfd;
}

void cleanup()
{
	kill(child, SIGTERM);
}

void sigfun(int sig)
{
	cleanup();
	signal(sig, SIG_DFL);
	raise(sig);
}

int main()
{
	int sockfd = -1;
	char buf[1024];

	child = spawn_server();
	atexit(cleanup);

	signal(SIGINT, sigfun);
	signal(SIGTERM, sigfun);
	signal(SIGKILL, sigfun);
	signal(SIGABRT, sigfun);
	signal(SIGSEGV, sigfun);

	sockfd = connect_websocket();
	if (sockfd == -1) {
		printf("could not connect websocket\n");
		return -1;
	}

	write_frame(sockfd, "join default");
	read_frame(sockfd, buf, sizeof(buf));
	assert(strcmp(buf, "player 1") == 0);
	write_frame(sockfd, "list");
	read_frame(sockfd, buf, sizeof(buf));
	assert(strcmp(buf, "room * 1 default") == 0);
	write_frame(sockfd, "ready");

	close(sockfd);

	return 0;
}
