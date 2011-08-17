
CC=gcc
CFLAGS=--std=gnu99 -Wall -g -O0 -I. -I.. `pkg-config --cflags libevent`
LDFLAGS=`pkg-config --libs libevent`

all: server
server: server.o key.o md5.o rampart.o

tests: tests/test_key
tests/test_key: tests/test_key.o key.o md5.o rampart.o

check: all tests
	./tests/test_key

clean:
	rm -rf *.o tests/*.o server tests/test_key

