CC      := gcc
CFLAGS  := --std=gnu99 -D_GNU_SOURCE -Wall -Wextra -Werror -g -O2 -MMD
CFLAGS  += -I. -I..
CFLAGS  += `pkg-config --cflags libevent openssl`
LDFLAGS := `pkg-config --libs libevent openssl`
SRCS    := $(wildcard *.c)
OBJS    := $(SRCS:.c=.o)
DEPS    := $(SRCS:.c=.d)

all: rampart-server
rampart-server: $(OBJS)
	$(LINK.o) $^ $(LOADLIBES) $(LDLIBS) -o $@

tests: tests/test_key tests/test_server
tests/test_key: tests/test_key.o $(filter-out server.o,$(OBJS))
tests/test_server: tests/test_server.o

install: rampart-server
	install -D -m755 etc/init.d/rampart-server /etc/init.d/rampart-server
	install -D -m755 rampart-server /usr/local/bin/rampart-server

check: all tests
	./tests/test_key
	./tests/test_server

clean:
	rm -f rampart-server *.o *.d \
		tests/test_key tests/test_server tests/*.o tests/*.d

.PHONY: clean

-include $(DEPS)
