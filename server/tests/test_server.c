#include <assert.h>
#include <ctype.h>
#include <errno.h>
#include <netdb.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/types.h>
#include <unistd.h>

#define HTTP_HEADER \
"GET / HTTP/1.1\r\n" \
"Upgrade: websocket\r\n" \
"Connection: Upgrade\r\n" \
"Host: localhost:9998\r\n" \
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
		execl("./server", "./server", "9998", NULL);
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
	fd_set rfds;
	struct timeval tv;
	size_t frame_len = 9999;

	FD_ZERO(&rfds);
	FD_SET(sockfd, &rfds);

	tv.tv_sec = 3;
	tv.tv_usec = 0;

	rc = select(sockfd + 1, &rfds, NULL, NULL, &tv);

	if (rc == -1) {
		perror("select");
		return -1;
	} else if (rc == 0) {
		printf("%s: timeout\n", __func__);
		return -1;
	}

	/* Read start of text frame. */
	rc = read(sockfd, buf, 1);
	if (rc == -1) {
		perror("read");
		return -1;
	}
	assert(buf[0] = '\x81');

	/* Read length of frame. */
	rc = read(sockfd, buf, 1);
	if (rc == -1) {
		perror("read");
		return -1;
	}
	frame_len = buf[0];
	assert(frame_len <= len);

	/* Read frame. */
	rc = read(sockfd, buf, frame_len);
	if (rc == -1) {
		perror("read");
		return -1;
	}
	buf[rc] = 0;

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

	rc = getaddrinfo("127.0.0.1", "9998", &hints, &res);
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

int cmp(const char *a, const char *b, int line)
{
	if (strcmp(a, b) == 0)
		return 0;

	printf(__FILE__ ":%d assertion failed\n", line);
	printf("a = %s\n", a);
	printf("b = %s\n", b);

	abort();
}

#define expect(sock, str) do { \
	read_frame(sock, buf, sizeof(buf)); \
	cmp(buf, str, __LINE__); \
} while (0)

int main()
{
	int p[3];
	char buf[1024];
	int i;

	child = spawn_server();
	atexit(cleanup);

	signal(SIGINT, sigfun);
	signal(SIGTERM, sigfun);
	signal(SIGABRT, sigfun);
	signal(SIGSEGV, sigfun);

	for (i = 0; i < 3; i++) {
		p[i] = connect_websocket();
		if (p[i] == -1) {
			printf("could not connect websocket\n");
			return -1;
		}
	}

	/* Connect player 1 to room default. */
	write_frame(p[0], "join default");
	expect(p[0], "player 1");
	write_frame(p[0], "list");
	expect(p[0], "room * 1 default");
	write_frame(p[0], "ready");

	/* Connect player 2 to room default. */
	write_frame(p[1], "join default");
	expect(p[1], "player 2");
	write_frame(p[1], "list");
	expect(p[1], "room * 2 default");
	write_frame(p[1], "ready");

	/* Now that both players are ready, they should both receive
	 * "go". */
	expect(p[0], "go");
	expect(p[1], "go");

	/* Send a wall command and verify other player receives. */
	write_frame(p[0], "wall 10,10");
	expect(p[1], "wall 10,10");

	/* Connect player 3 to room test. */
	write_frame(p[2], "join test");
	expect(p[2], "player 1");
	write_frame(p[2], "list");
	expect(p[2], "room - 2 default");
	expect(p[2], "room * 1 test");

	for (i = 0; i < 3; i++)
		close(p[i]);

	return 0;
}
