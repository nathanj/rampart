#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <assert.h>
#include <arpa/inet.h>

#include "md5.h"

/* Decodes a WebSocket key into its big endian value. */
static unsigned int decode(const char *key)
{
	const char *p = key;
	unsigned int key_number = 0;
	unsigned int spaces = 0;

	while (*p)
	{
		if (isdigit(*p))
			key_number = key_number*10 + *p-'0';
		if (*p == ' ')
			spaces++;
		p++;
	}

	assert(spaces > 0);

	return htonl(key_number / spaces);
}

/* Computes the server's response based on the three keys. The response is
 * stored in response which should be 16 bytes in length. */
void compute_response(const char *key1, const char *key2, const char *key3,
		char *response)
{
	unsigned int key_number_1 = 0;
	unsigned int key_number_2 = 0;
	char key[16] = {0};
	MD5_CTX mdContext;

	assert(key1);
	assert(key2);
	assert(key3);
	assert(response);

	key_number_1 = decode(key1);
	key_number_2 = decode(key2);

	memcpy(key  , &key_number_1, 4);
	memcpy(key+4, &key_number_2, 4);
	memcpy(key+8, key3,          8);

	MD5Init(&mdContext);
	MD5Update(&mdContext, key, 16);
	MD5Final(&mdContext);

	memcpy(response, mdContext.digest, 16);
}

