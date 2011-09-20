
CC=gcc
CFLAGS=--std=gnu99 -D_GNU_SOURCE -Wall -g -O0 -I. -I.. `pkg-config --cflags libevent`
LDFLAGS=`pkg-config --libs libevent`

all: server
server: server.o key.o sha1.o rampart.o b64.o

tests: tests/test_key
tests/test_key: tests/test_key.o key.o sha1.o rampart.o b64.o

check: all tests
	./tests/test_key

clean:
	rm -rf *.o tests/*.o server tests/test_key

