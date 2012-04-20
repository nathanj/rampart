Rampart
=======

Introduction
------------

This is an implementation of the game Rampart in Javascript. Network
play is supported by using WebSockets.

The game has only been tested to work with Chrome 17. Other browsers may
work, but don't bet on it.

Dependencies
------------

   * openssl
   * libevent2

Running
-------

Compile and run the server WebSocket program.

    $ cd server && make && ./rampart-server

Then load up index.html in your browser to play. Load up ai.html in a
second window to play against the computer opponent.

