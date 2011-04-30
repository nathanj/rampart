#ifndef __RAMPART_H__
#define __RAMPART_H__

#include "list.h"

#define BUF_SIZE 4096

struct client
{
	int fd;
	char in[BUF_SIZE];
	int in_len;
	char out[BUF_SIZE];
	int out_len;

	int finished_headers;
	char game[32];
	int player;

	int ready_for_next_state;

	struct list_head list;
};

int handle_join_message(const char *in, struct client *client,
		struct list_head *client_list);

int handle_ready_message(const char *in, struct client *client,
		struct list_head *client_list);

int handle_normal_message(const char *in, struct client *client,
		struct list_head *client_list);

int handle_message(const char *in, struct client *client,
		struct list_head *client_list);

#endif /* __RAMPART_H__ */
