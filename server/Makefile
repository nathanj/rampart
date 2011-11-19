
CC=gcc
CFLAGS=--std=gnu99 -D_GNU_SOURCE -Wall -g -O0 -I. -I.. `pkg-config --cflags libevent`
LDFLAGS=`pkg-config --libs libevent`

SRCS=$(wildcard *.c)
OBJS=$(SRCS:.c=.o)

all: depend server
server: $(OBJS)

tests: tests/test_key
tests/test_key: tests/test_key.o $(filter-out server.o,$(OBJS))

check: all tests
	./tests/test_key

clean:
	rm -rf *.o tests/*.o server tests/test_key .depend

depend: .depend

.depend: $(SRCS)
	$(CC) $(CFLAGS) -MM $^ > ./.depend;

-include .depend
