#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#include "key.h"

int main()
{
	char response[32] = {0};

	compute_response("dGhlIHNhbXBsZSBub25jZQ==", response);
	assert(strcmp(response, "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=") == 0);

	return 0;
}

