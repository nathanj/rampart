#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <stdlib.h>

#include <event.h>

#include "rampart.h"

LIST_HEAD(room_list);

static struct room *create_room(const char *name)
{
	struct room *room = NULL;

	room = malloc(sizeof(*room));
	snprintf(room->name, sizeof(room->name), "%s", name);
	room->num_players = 0;

	list_add_tail(&(room->list), &room_list);

	return room;
}

static void delete_room(struct room *room)
{
	list_del(&room->list);
	free(room);
}

static struct room *find_room(const char *name)
{
	struct room *room = NULL;

	list_for_each_entry(room, &room_list, list)
		if (strcasecmp(room->name, name) == 0)
			return room;

	return create_room(name);
}

static void increment_room(struct room *room)
{
	room->num_players++;
}

static void decrement_room(struct room *room)
{
	room->num_players--;

	if (room->num_players == 0)
		delete_room(room);
}

/* Is other in the same game as client? */
static int other_client_in_game(struct client *client, struct client *other)
{
	return (client->fd != other->fd
		&& client->room == other->room);
}

/* Send a message to a client. */
static void tell_client(struct client *client, const char *format, ...)
	__attribute__((format(printf,2,3)));
static void tell_client(struct client *client, const char *format, ...)
{
	int len;
	va_list args;

	va_start(args, format);

	client->out[client->out_len++] = '\x81';
	len = vsnprintf(client->out + client->out_len + 1, BUF_SIZE,
			format, args);
	client->out[client->out_len++] = (unsigned char) len;
	client->out_len += len;

	dbg("adding event write\n");
	event_add(client->ev_write, NULL);

	va_end(args);
}

/* Client has joined a game. Give him a player number. */
static int handle_join_message(const char *in, struct client *client,
			       struct list_head *client_list)
{
	struct client *other = NULL;
	const char *room_name = in + strlen("join ");

	client->room = find_room(room_name);
	increment_room(client->room);

	client->player = 1;

	/* Set the player number to max(clients in game) + 1. */
	list_for_each_entry(other, client_list, list) {
		if (other_client_in_game(client, other)
		    && client->player <= other->player) {
			client->player = other->player + 1;
		}
	}

	dbg("client %p has joined room '%s' as player %d\n",
	    client, client->room->name, client->player);

	tell_client(client, "player %d", client->player);

	return 0;
}

/* Is the other player in this game ready? */
static int other_player_is_ready(struct client *client,
				 struct client *other)
{
	return (client->fd != other->fd
		&& client->room == other->room
		&& client->player != other->player
		&& other->ready_for_next_state
		&& (other->player == 1 || other->player == 2));
}

/* Client is ready for the next state. Record it. If both players are
 * ready, send a go message to all clients of the game. */
static int handle_ready_message(struct client *client,
				struct list_head *client_list, int game_over)
{
	struct client *other = NULL;
	int ready = 0;

	client->ready_for_next_state = 1;

	/* See if the other player is ready. */
	list_for_each_entry(other, client_list, list) {
		if (other_player_is_ready(client, other)) {
			ready = 1;
			break;
		}
	}

	if (!ready)
		return 0;

	/* If ready, send go to all clients of the game. If gameover,
	 * then start a new game. */
	list_for_each_entry(other, client_list, list) {
		dbg("client=%p other=%p\n", client, other);
		if (client->room == other->room) {
			other->ready_for_next_state = 0;
			tell_client(other, game_over ? "newgame" : "go");
		}
	}

	return 0;
}

/* Standard game message. Relay to other clients of the same game. */
static int handle_normal_message(const char *in, struct client *client,
				 struct list_head *client_list)
{
	struct client *other = NULL;

	dbg("sending %s to everyone\n", in);

	list_for_each_entry(other, client_list, list) {
		if (other_client_in_game(client, other)) {
			tell_client(other, "%s", in);
			dbg("fd=%d len=%d\n", other->fd, other->out_len);
		}
	}

	return 0;
}

/* List rooms on the server. */
static int handle_list_message(struct client *client)
{
	struct room *room = NULL;
	char in_room;

	list_for_each_entry(room, &room_list, list) {
		in_room = client->room == room ? '*' : '-';

		tell_client(client, "room %c %d %s",
			    in_room,
			    room->num_players,
			    room->name);
	}

	return 0;
}

/* Handle game messages. */
int handle_message(const char *in, struct client *client,
		   struct list_head *client_list)
{
	dbg("msg: %s\n", in);
	if (strncmp(in, "join ", strlen("join ")) == 0)
		return handle_join_message(in, client, client_list);
	else if (strncmp(in, "ready", strlen("ready")) == 0)
		return handle_ready_message(client, client_list, 0);
	else if (strncmp(in, "gameover", strlen("gameover")) == 0)
		return handle_ready_message(client, client_list, 1);
	else if (strncmp(in, "list", strlen("list")) == 0)
		return handle_list_message(client);
	else
		return handle_normal_message(in, client, client_list);
}

/* Called when a client exits the game. */
void end_client(struct client *client)
{
	decrement_room(client->room);
}

