CC=gcc
CFLAGS=--std=c99 -Wall -g -D_GNU_SOURCE -O0

all: server
server: server.o key.o md5.o
clean:
	rm -rf *.o server

