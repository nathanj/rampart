#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <assert.h>
#include <arpa/inet.h>

#include "md5.h"

/*
GET / HTTP/1.1
Upgrade: WebSocket
Connection: Upgrade
Host: echo.websocket.org
Origin: null
Sec-WebSocket-Key1: 30  ;- 5=5 u 4 1  7336
Sec-WebSocket-Key2: :2 8 G(  07A 93Ql 3 *20 Ox0G'w

]..g...uHTTP/1.1 101 Web Socket Protocol Handshake
Upgrade: WebSocket
Connection: Upgrade
Sec-WebSocket-Origin: null
Sec-WebSocket-Location: ws://echo.websocket.org/
Server: Kaazing Gateway
Date: Thu, 21 Apr 2011 21:43:59 GMT
Access-Control-Allow-Origin: null
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: content-type

..*..........`...WebSocket rocks..WebSocket rocks.
*/


/*
00000000  47 45 54 20 2f 20 48 54  54 50 2f 31 2e 31 0d 0a GET / HT TP/1.1..
00000010  55 70 67 72 61 64 65 3a  20 57 65 62 53 6f 63 6b Upgrade:  WebSock
00000020  65 74 0d 0a 43 6f 6e 6e  65 63 74 69 6f 6e 3a 20 et..Conn ection: 
00000030  55 70 67 72 61 64 65 0d  0a 48 6f 73 74 3a 20 65 Upgrade. .Host: e
00000040  63 68 6f 2e 77 65 62 73  6f 63 6b 65 74 2e 6f 72 cho.webs ocket.or
00000050  67 0d 0a 4f 72 69 67 69  6e 3a 20 6e 75 6c 6c 0d g..Origi n: null.
00000060  0a 53 65 63 2d 57 65 62  53 6f 63 6b 65 74 2d 4b .Sec-Web Socket-K
00000070  65 79 31 3a 20 33 30 20  20 3b 2d 20 35 3d 35 20 ey1: 30   ;- 5=5 
00000080  75 20 34 20 31 20 20 37  33 33 36 0d 0a 53 65 63 u 4 1  7 336..Sec
00000090  2d 57 65 62 53 6f 63 6b  65 74 2d 4b 65 79 32 3a -WebSock et-Key2:
000000A0  20 3a 32 20 38 20 47 28  20 20 30 37 41 20 39 33  :2 8 G(   07A 93
000000B0  51 6c 20 33 20 2a 32 30  20 4f 78 30 47 27 77 0d Ql 3 *20  Ox0G'w.
000000C0  0a 0d 0a 5d 9f b0 67 0f  e4 fa 75                ...]..g. ..u
    00000000  48 54 54 50 2f 31 2e 31  20 31 30 31 20 57 65 62 HTTP/1.1  101 Web
    00000010  20 53 6f 63 6b 65 74 20  50 72 6f 74 6f 63 6f 6c  Socket  Protocol
    00000020  20 48 61 6e 64 73 68 61  6b 65 0d 0a 55 70 67 72  Handsha ke..Upgr
    00000030  61 64 65 3a 20 57 65 62  53 6f 63 6b 65 74 0d 0a ade: Web Socket..
    00000040  43 6f 6e 6e 65 63 74 69  6f 6e 3a 20 55 70 67 72 Connecti on: Upgr
    00000050  61 64 65 0d 0a 53 65 63  2d 57 65 62 53 6f 63 6b ade..Sec -WebSock
    00000060  65 74 2d 4f 72 69 67 69  6e 3a 20 6e 75 6c 6c 0d et-Origi n: null.
    00000070  0a 53 65 63 2d 57 65 62  53 6f 63 6b 65 74 2d 4c .Sec-Web Socket-L
    00000080  6f 63 61 74 69 6f 6e 3a  20 77 73 3a 2f 2f 65 63 ocation:  ws://ec
    00000090  68 6f 2e 77 65 62 73 6f  63 6b 65 74 2e 6f 72 67 ho.webso cket.org
    000000A0  2f 0d 0a 53 65 72 76 65  72 3a 20 4b 61 61 7a 69 /..Serve r: Kaazi
    000000B0  6e 67 20 47 61 74 65 77  61 79 0d 0a 44 61 74 65 ng Gatew ay..Date
    000000C0  3a 20 54 68 75 2c 20 32  31 20 41 70 72 20 32 30 : Thu, 2 1 Apr 20
    000000D0  31 31 20 32 31 3a 34 33  3a 35 39 20 47 4d 54 0d 11 21:43 :59 GMT.
    000000E0  0a 41 63 63 65 73 73 2d  43 6f 6e 74 72 6f 6c 2d .Access- Control-
    000000F0  41 6c 6c 6f 77 2d 4f 72  69 67 69 6e 3a 20 6e 75 Allow-Or igin: nu
    00000100  6c 6c 0d 0a 41 63 63 65  73 73 2d 43 6f 6e 74 72 ll..Acce ss-Contr
    00000110  6f 6c 2d 41 6c 6c 6f 77  2d 43 72 65 64 65 6e 74 ol-Allow -Credent
    00000120  69 61 6c 73 3a 20 74 72  75 65 0d 0a 41 63 63 65 ials: tr ue..Acce
    00000130  73 73 2d 43 6f 6e 74 72  6f 6c 2d 41 6c 6c 6f 77 ss-Contr ol-Allow
    00000140  2d 48 65 61 64 65 72 73  3a 20 63 6f 6e 74 65 6e -Headers : conten
    00000150  74 2d 74 79 70 65 0d 0a  0d 0a                   t-type.. ..
    0000015A  b6 bc 2a 9e a0 0c 1c b9  0f ad dc 97 90 60 17 a8 ..*..... .....`..
000000CB  00 57 65 62 53 6f 63 6b  65 74 20 72 6f 63 6b 73 .WebSock et rocks
000000DB  ff                                               .
    0000016A  00 57 65 62 53 6f 63 6b  65 74 20 72 6f 63 6b 73 .WebSock et rocks
    0000017A  ff                                               .
*/

/* Decodes a WebSocket key into its big endian value. */
unsigned int decode(const char *key)
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
