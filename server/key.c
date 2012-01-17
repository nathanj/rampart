#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <assert.h>
#include <arpa/inet.h>

#include "sha1.h"
#include "b64.h"

#define GUID "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
#define FULL_KEY_SIZE (32 + sizeof(GUID))

/* Computes the server's response based on the three keys. The response
 * is stored in response which should be at least 28 bytes in length. */
void compute_response(const char *key, char *response)
{
	char full_key[FULL_KEY_SIZE];
	int len;
	int rc;
	SHA1Context sha1_context;

	len = snprintf(full_key, FULL_KEY_SIZE, "%s%s", key, GUID);
	assert(len < (int) FULL_KEY_SIZE);

	SHA1Reset(&sha1_context);
	SHA1Input(&sha1_context, (unsigned char *) full_key, len);
	rc = SHA1Result(&sha1_context);

	assert(rc == 1);

	for (int i = 0; i < 5; i++) {
		sha1_context.Message_Digest[i] =
			ntohl(sha1_context.Message_Digest[i]);
	}


	base64encode((unsigned char *) sha1_context.Message_Digest,
		     (unsigned char *) response,
		     20);
}

