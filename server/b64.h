#ifndef __B64_H__
#define __B64_H__

void encodeblock( const unsigned char in[3], unsigned char out[4], int len );
void base64encode( const unsigned char *in, unsigned char *out, int len );

#endif /* __B64_H__ */
