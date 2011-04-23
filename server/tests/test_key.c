#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#include "key.h"

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

