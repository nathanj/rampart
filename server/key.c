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

	return ntohl(key_number / spaces);
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

void dprint(const char *data, int length)
{
	int i = 0;

	for (i = 0; i < length; i++)
		printf("%02x ", data[i]&0xff);
	printf("\n");
}

#if 0
int main()
{
	char response[16] = {0};

	compute_response(
			"18x 6]8vM;54 *(5:  {   U1]8  z [  8",
			"1_ tx7X d  <  nw  334J702) 7]o}` 0",
			"Tm[K T2u",
			response);
	assert( memcmp(response, "fQJ,fN/4F4!~K~MH", 16) == 0 );

	compute_response(
			"3e6b263  4 17 80",
			"17  9 G`ZD9   2 2b 7X 3 /r90",
			"WjN}|M(6",
			response);
	assert( memcmp(response, "n`9eBk9z$R8pOtVb", 16) == 0 );

	compute_response(
			"30  ;- 5=5 u 4 1  7336",
			":2 8 G(  07A 93Ql 3 *20 Ox0G'w",
			"\x5d\x9f\xb0\x67\x0f\xe4\xfa\x75",
			response);
	assert( memcmp(response, "\xb6\xbc\x2a\x9e\xa0\x0c\x1c\xb9\x0f\xad\xdc\x97\x90\x60\x17\xa8", 16) == 0 );

	return 0;
}
#endif
