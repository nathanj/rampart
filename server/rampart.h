#ifndef __RAMPART_H__
#define __RAMPART_H__

#include "list.h"

extern int debug_on;

#define dbg(fmt, args...) do {\
	if (debug_on) \
		printf("%25s:%4d: " fmt, __func__, __LINE__, ##args); \
} while (0);

#define FREE(x) do { free(x); x = NULL; } while (0)

#define BUF_SIZE 512

struct event;

struct room {
	char name[32];
	int num_players;
	struct list_head list;

	struct list_head clients;
};

struct client
{
	int fd;
	char in[BUF_SIZE];
	int in_len;
	char out[BUF_SIZE];
	int out_len;

	char *key;
	int version;
	char *partial_line;

	int finished_headers;
	struct room *room;
	int player;

	int ready_for_next_state;

	struct list_head list;

	struct event *ev_read;
	struct event *ev_write;
};

int handle_message(const char *in, struct client *client);
void end_client(struct client *client);

#endif /* __RAMPART_H__ */
