CC      := gcc
CFLAGS  := --std=gnu99 -D_GNU_SOURCE -Wall -Wextra -Werror -g -O2 -MMD
CFLAGS  += -I. -I..
CFLAGS  += `pkg-config --cflags libevent`
LDFLAGS := `pkg-config --libs libevent`
SRCS    := $(wildcard *.c)
OBJS    := $(SRCS:.c=.o)
DEPS    := $(wildcard *.d)

all: server
server: $(OBJS)

tests: tests/test_key tests/test_server
tests/test_key: tests/test_key.o $(filter-out server.o,$(OBJS))
tests/test_server: tests/test_server.o

check: all tests
	./tests/test_key
	./tests/test_server

clean:
	rm -rf $(TARGET) $(OBJS) $(DEPS)

.PHONY: clean

ifneq ($(DEPS),)
include $(DEPS)
endif
