#include <stdio.h>
#include <string.h>

#include "rampart.h"

/* Client has joined a game. Give him a player number. */
int handle_join_message(const char *in, struct client *client,
		struct list_head *client_list)
{
	struct client *other = NULL;

	snprintf(client->game, 32, "%s", in+6);
	client->player = 1;

	/* Figure out this client's player number. */
again:
	list_for_each_entry(other, client_list, list)
	{
		if (client->fd != other->fd
				&& strcmp(client->game, other->game) == 0
				&& client->player == other->player)
		{
			client->player++;
			goto again;
		}
	}

	dbg("client %p has joined game '%s' as player %d\n",
			client, client->game, client->player);

	client->out[client->out_len++] = '\0';
	client->out_len += snprintf(client->out+client->out_len, BUF_SIZE,
			"player %d\xff", client->player);

	return 0;
}

/* Client is ready for the next state. Record it. If both players are
 * ready, send a go message to all clients of the game. */
int handle_ready_message(const char *in, struct client *client,
		struct list_head *client_list)
{
	struct client *other = NULL;
	int ready = 0;

	client->ready_for_next_state = 1;

	/* See if the other player is ready. */
	list_for_each_entry(other, client_list, list)
	{
		if (client->fd != other->fd
				&& strcmp(client->game, other->game) == 0
				&& client->player != other->player
				&& other->ready_for_next_state
				&& (other->player == 1
					|| other->player == 2))
		{
			ready = 1;
			break;
		}
	}

	/* If ready, send go to all clients of the game. */
	if (ready)
	{
		list_for_each_entry(other, client_list, list)
		{
			dbg("client=%p other=%p\n", client, other);
			if (strcmp(client->game, other->game) == 0)
			{
				other->ready_for_next_state = 0;

				other->out[other->out_len++] = '\0';
				other->out_len += snprintf(other->out+other->out_len,
						BUF_SIZE, "go\xff");
			}
		}
	}

	return 0;
}

/* Standard game message. Relay to other clients of the same game. */
int handle_normal_message(const char *in, struct client *client,
		struct list_head *client_list)
{
	struct client *other = NULL;

	dbg("sending %s to everyone\n", in+1);

	list_for_each_entry(other, client_list, list)
	{
		if (client->fd != other->fd
				&& strcmp(client->game, other->game) == 0)
		{
			int len = strlen(in+1) + 2;

			memcpy(other->out + other->out_len, in, len);
			other->out_len += len;
			other->out[other->out_len-1] = '\xff';
			dbg("fd=%d len=%d\n", other->fd, other->out_len);
		}
	}

	return 0;
}

/* Handle game messages. */
int handle_message(const char *in, struct client *client,
		struct list_head *client_list)
{
	dbg("msg: %s\n", in+1);
	if (strncmp(in+1, "join ", strlen("join ")) == 0)
		handle_join_message(in, client, client_list);
	else if (strncmp(in+1, "ready", strlen("ready")) == 0)
		handle_ready_message(in, client, client_list);
	else
		handle_normal_message(in, client, client_list);

	return 0;
}
