CC=gcc
CFLAGS=--std=c99 -Wall -g -D_GNU_SOURCE -O0 -I. -I..

all: server
server: server.o key.o md5.o rampart.o

tests: tests/test_key
tests/test_key: tests/test_key.o key.o md5.o rampart.o

check: all tests
	./tests/test_key

clean:
	rm -rf *.o tests/*.o server tests/test_key

