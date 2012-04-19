#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <arpa/inet.h>

#include <openssl/sha.h>
#include <openssl/hmac.h>
#include <openssl/bio.h>
#include <openssl/buffer.h>

#define GUID "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
#define FULL_KEY_SIZE (32 + sizeof(GUID))

static int base64(const unsigned char *input, int length, unsigned char *buf)
{
	BIO *bmem, *b64;
	BUF_MEM *bptr;
	int rc;

	b64 = BIO_new(BIO_f_base64());
	BIO_set_flags(b64, BIO_FLAGS_BASE64_NO_NL);
	bmem = BIO_new(BIO_s_mem());
	b64 = BIO_push(b64, bmem);
	BIO_write(b64, input, length);
	rc = BIO_flush(b64);
	if (rc != 1)
		return -1;
	BIO_get_mem_ptr(b64, &bptr);

	memcpy(buf, bptr->data, bptr->length);
	buf[bptr->length] = 0;

	BIO_free_all(b64);

	return 0;
}

/* Computes the server's response based on the three keys. The response
 * is stored in response which should be at least 28 bytes in length. */
int compute_response(const char *key, char *response)
{
	unsigned char full_key[FULL_KEY_SIZE];
	unsigned char sha1[20];
	int len;
	int rc;

	len = snprintf((char *) full_key, FULL_KEY_SIZE, "%s%s", key, GUID);
	if (len < 0 || len >= (int) FULL_KEY_SIZE)
		return -1;

	SHA1(full_key, len, sha1);
	rc = base64(sha1, 20, (unsigned char *) response);

	return rc;
}
