
var a;
var c;
var cannonballs = new Array();
var cannons = new Array();

var wsUri = "ws://localhost:9999/";
var output;

var oldcursor = "";

var width=40
var height=30

var player = 1;

var state = 0;
var state_timer = 0;
var next_state_change = 0;
var state_div;

var cannons_left = 2;

var player_mask =
[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

var board =
[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,2,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,4,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,4,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,4,1,2,1,4,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,4,1,1,1,4,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,4,1,1,1,4,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,4,1,1,1,4,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,4,1,1,1,4,1,1,0,0,0],
[0,0,0,1,1,1,2,4,4,4,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,4,4,4,4,4,4,1,1,0,0,0],
[0,0,0,1,1,1,4,4,1,4,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,1,1,1,1,4,1,1,1,0,0,0],
[0,0,0,1,4,4,4,1,4,4,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,1,1,1,1,4,1,1,1,0,0,0],
[0,0,0,1,4,1,1,4,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,1,1,1,1,4,1,1,1,0,0,0],
[0,0,0,1,4,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,1,2,1,1,4,1,1,1,0,0,0],
[0,0,0,1,4,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,1,1,1,1,4,1,1,1,0,0,0],
[0,0,0,1,4,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,1,1,1,1,4,1,1,1,0,0,0],
[0,0,0,1,4,1,2,4,1,1,1,1,1,1,2,1,1,1,1,1,1,0,0,0,0,1,1,1,4,1,1,1,1,4,1,1,1,0,0,0],
[0,0,0,1,4,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,4,4,4,4,4,1,1,1,0,0,0],
[0,0,0,1,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

var WATER=0
var WALL=4
var OPEN=99
var CLOSED=98
var UNKNOWN=100

function isOpen(x, y, dx, dy)
{
	while (x > 0 && x <= width && y > 0 && y <= height)
	{
		x += dx;
		y += dy;

		if (board[y][x] == WATER || board[y][x] == OPEN)
			return true;

		if (board[y][x] == WALL || board[y][x] == CLOSED)
			return false;
	}

	alert('wut');
}

function figureOutProperty()
{
	var x = 0;
	var y = 0;

	for (x = 0; x < width; x++)
	{
		for (y = 0; y < height; y++)
		{
			if (board[y][x] == 1 || board[y][x] == OPEN || board[y][x] == CLOSED)
				board[y][x] = UNKNOWN;
		}
	}

	var changed = false;
	do
	{
		changed = false;
		for (x = 0; x < width; x++)
		{
			for (y = 0; y < height; y++)
			{
				if (board[y][x] == UNKNOWN)
				{
					if (
							isOpen(x, y, -1,  0) ||
							isOpen(x, y,  1,  0) ||
							isOpen(x, y,  0, -1) ||
							isOpen(x, y,  0,  1) ||
							isOpen(x, y, -1, -1) ||
							isOpen(x, y, -1,  1) ||
							isOpen(x, y,  1, -1) ||
							isOpen(x, y,  1,  1)
					   )

					{
						board[y][x] = OPEN;
						changed = true;
					}
				}
			}
		}
	}
	while (changed);

	for (x = 0; x < width; x++)
	{
		for (y = 0; y < height; y++)
		{
			if (board[y][x] == UNKNOWN)
				board[y][x] = CLOSED;
		}
	}
}

var ctrl = false;

function makeWall(e)
{
	var pos = getCursorPosition(e);

	var y = parseInt(pos.y/16);
	var x = parseInt(pos.x/16);

	if (player_mask[y][x] == player)
	{
		websocket.send('wall ' + x + "," + y);

		board[y][x] = 4;

		draw();
	}
}

function makeCannon(e)
{
	var pos = getCursorPosition(e);

	var y = parseInt(pos.y/16);
	var x = parseInt(pos.x/16);

	if (cannons_left > 0 && player_mask[y][x] == player && board[y][x] == CLOSED)
	{
		websocket.send('cannon ' + x + "," + y);

		cannons.push(new Cannon(x, y));
		cannons_left--;

		draw();
	}
}

function makeCannon2(pos)
{
	cannons.push(new Cannon(pos.x, pos.y));

	draw();
}

function makeWall2(pos)
{
	board[pos.y][pos.x] = 4;

	draw();
}

function fireCannonball(e)
{
	var pos = getCursorPosition(e);

	var l = cannons.length;
	for (var i = 0; i < l; i++)
	{
		var c = cannons[i];
		if (player_mask[c.y][c.x] == player && board[c.y][c.x] == CLOSED)
		{
			if (c.fire_timer == 0)
			{
				var cb = new Cannonball(c.x*16, c.y*16, pos.x, pos.y);
				cannonballs.push(cb);
				c.fire_timer = 20*2;

				websocket.send('cannonball ' + c.x*16 + "," + c.y*16 + "," + pos.x + "," + pos.y);

				break;
			}
		}
	}

	draw();
}

function fireCannonball2(from, to)
{
	var cb = new Cannonball(from.x, from.y, to.x, to.y);
	cannonballs.push(cb);

	draw();
}

function onClick(e)
{
	if (state == 2)
		fireCannonball(e);
	else if (state == 0)
		makeWall(e);
	else if (state == 1)
		makeCannon(e);
}

function doKeyDown(e)
{
	switch(e.keyCode)
	{
		case 17:
			ctrl = true;
	}
}

function doKeyUp(e)
{
	switch(e.keyCode)
	{
		case 17:
			ctrl = false;
	}
}

function printState()
{
	var secs = Math.min(next_state_change/20, parseInt((next_state_change - state_timer) / 20) + 1);

	if (state == 0)
		state_div.innerHTML = "State: Placing Walls ("+secs+" seconds)";
	else if (state == 1)
		state_div.innerHTML = "State: Placing Cannons ("+secs+" seconds)";
	else if (state == 2)
		state_div.innerHTML = "State: Shooting Cannonballs ("+secs+" seconds)";
	else if (state == 3)
		state_div.innerHTML = "State: In between states ("+secs+" seconds)";
}

function init()
{
	a = document.getElementById("a");
    a.addEventListener("click", onClick, false);
	window.addEventListener('keydown', doKeyDown, false);
	window.addEventListener('keyup', doKeyUp, false);


	c = a.getContext("2d");

	setInterval(update, 50);

	output = document.getElementById("output");
	state_div = document.getElementById("state");
	state_div.innerHTML = "whee";


	draw();

	state = 0;
	next_state_change = 20*10;
	state_timer = 0;

	websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) { onOpen(evt) };
	websocket.onclose = function(evt) { onClose(evt) };
	websocket.onmessage = function(evt) { onMessage(evt) };
	websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
	writeToScreen("CONNECTED");

	if (window.location.search.length > 0)
		doSend('join ' + window.location.search);
	else
		doSend('join game');
}
function onClose(evt) {
	writeToScreen("DISCONNECTED");
}
function onMessage(evt) {
	var m = null;
	var from = null;
	var to = null;
	var pos = null;

	if ( (m = evt.data.match(/cannonball (\d+),(\d+),(\d+),(\d+)/)) )
	{
		writeToScreen('<span style="color: blue; "> ANOTHER PLAYER SHOOTS AT: ' + evt.data+'</span> ');
		from = new Cell(parseInt(m[1]), parseInt(m[2]));
		to = new Cell(parseInt(m[3]), parseInt(m[4]));
		fireCannonball2(from, to);
	}
	else if ( (m = evt.data.match(/wall (\d+),(\d+)/)) )
	{
		writeToScreen('<span style="color: blue; "> ANOTHER PLAYER WALLS: ' + evt.data+'</span> ');
		pos = new Cell(parseInt(m[1]), parseInt(m[2]));
		makeWall2(pos);
	}
	else if ( (m = evt.data.match(/cannon (\d+),(\d+)/)) )
	{
		writeToScreen('<span style="color: blue; "> ANOTHER PLAYER CANNONS: ' + evt.data+'</span> ');
		pos = new Cell(parseInt(m[1]), parseInt(m[2]));
		makeCannon2(pos);
	}
	else if ( (m = evt.data.match(/player (\d+)/)) )
	{
		writeToScreen('<span style="color: blue; "> YOU ARE PLAYER: ' + evt.data+'</span> ');
		player = parseInt(m[1]);
		if (player > 2)
			writeToScreen('<span style="color: red; "> Players over 2 cannot do anything, sorry.</span> ');
	}
	else
	{
		writeToScreen('<span style="color: red; "> UNKNOWN MESSAGE: ' + evt.data+'</span> ');
	}
}
function onError(evt) {
	writeToScreen('<span style="color: red; "> ERROR:</span> ' + evt.data);
}
function doSend(message) {
	writeToScreen("SENT: " + message);
	websocket.send(message);
}
function writeToScreen(message) {
	var pre = document.createElement("p");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = message;
	output.appendChild(pre);
}

function switchState() {
	state_timer = 0;

	state = [1,2,0][state];

	cannons_left = 2;
}

function update() {

	state_timer++;
	if (state_timer >= next_state_change)
		switchState();

	var l = cannons.length;
	for (var i = 0; i < l; i++)
	{
		if (cannons[i].fire_timer > 0)
			cannons[i].fire_timer--;
	}

	l = cannonballs.length;
	for (var i = 0; i < l; i++)
	{
		var cb = cannonballs[i];
		if (!cb.done)
		{
			var dist = Math.abs(cb.end_x - cb.curr_x) + Math.abs(cb.end_y - cb.curr_y);
			cb.curr_x = cb.curr_x + cb.v*cb.dx;
			cb.curr_y = cb.curr_y + cb.v*cb.dy;
			var dist2 = Math.abs(cb.end_x - cb.curr_x) + Math.abs(cb.end_y - cb.curr_y);

			if (dist2 > dist)
			{
				cb.done = true;
				var x = parseInt(cb.end_x/16);
				var y = parseInt(cb.end_y/16);
				if (board[y][x] != WATER)
					board[y][x] = 5;
			}
		}
	}

	draw();
}

function draw() {

	printState();
	figureOutProperty();

	for (var i = 0; i < 40; i++)
		for (var j = 0; j < 30; j++)
		{
			if (board[j][i] == 0)
				drawWater(i, j);
			else if (board[j][i] == 1)
				drawGrass(i, j);
			else if (board[j][i] == 2)
				drawCastle(i, j);
			else if (board[j][i] == 4)
				drawWall(i, j);
			else if (board[j][i] == 5)
				drawBurn(i, j);
			else if (board[j][i] == OPEN)
				drawGrass(i, j);
			else if (board[j][i] == CLOSED)
				drawProperty(i, j);
		}

	drawCannons();
	drawCannonballs();
}

function square(x)
{
	return x*x;
}

function drawCannons()
{
	var l = cannons.length;
	for (var i = 0; i < l; i++)
	{
		var cb = cannons[i];
		drawCannon(cb.x, cb.y);
	}
}

function drawCannonballs()
{
	var l = cannonballs.length;
	for (var i = 0; i < l; i++)
	{
		var cb = cannonballs[i];
		if (!cb.done)
		{
			var length = Math.sqrt( square(square(cb.start_x-cb.end_x) + square(cb.start_y-cb.end_y)) );
			var slength = Math.sqrt( square(square(cb.start_x-cb.curr_x) + square(cb.start_y-cb.curr_y)) );
			var elength = Math.sqrt( square(square(cb.curr_x-cb.end_x) + square(cb.curr_y-cb.end_y)) );
			var lm = Math.min(slength, elength);
			c.beginPath();
			c.arc(cb.curr_x, cb.curr_y, Math.min(48, 1/Math.abs(lm/length - 0.5) * 4), 0, Math.PI*2, false);
			c.closePath();
			c.strokeStyle = "#333";
			c.fillStyle = "#999";
			c.stroke();
			c.fill();
		}
	}
}

function Cannon(x, y) {
	this.x = x;
	this.y = y;
	this.fire_timer = 0;
}

function Cannonball(start_x, start_y, end_x, end_y) {
	this.start_x = start_x;
	this.start_y = start_y;
	this.curr_x = start_x;
	this.curr_y = start_y;
	this.end_x = end_x;
	this.end_y = end_y;
	this.v = 5;

	var dx = end_x - start_x;
	var sx = dx < 0 ? -1 : 1;
	var dy = end_y - start_y;
	var sy = dy < 0 ? -1 : 1;
	var dx2 = dx*dx;
	var dy2 = dy*dy;
	dx = sx * Math.sqrt(dx2 / (dx2+dy2));
	dy = sy * Math.sqrt(dy2 / (dx2+dy2));

	this.dx = dx;
	this.dy = dy;

	this.done = false;
}

function Cell(x, y) {
	this.x = x;
	this.y = y;
}

function getCursorPosition(e) {
	var x;
	var y;
	if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
	}
	else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= a.offsetLeft;
	y -= a.offsetTop;
	x = Math.min(x, 640);
	y = Math.min(y, 480);
	var cell = new Cell(x, y);
	return cell;
}

function drawCannon(x, y) {
	c.beginPath();
	c.arc(x*16+8, y*16+8, 8, 0, Math.PI*2, false);
	c.closePath();
	c.strokeStyle = "#333";
	c.fillStyle = "#999";
	c.stroke();
	c.fill();
}

function drawCastle(x, y) {
	c.fillStyle = "#333";
	c.fillRect(x*16, y*16, 16, 16);
}

function drawWater(x, y) {
	c.fillStyle = "#aae";
	c.fillRect(x*16, y*16, 16, 16);
}

function drawBurn(x, y) {
	c.fillStyle = "#eaa";
	c.fillRect(x*16, y*16, 16, 16);
}

function drawGrass(x, y) {
	if ((x + y) % 2 == 0)
		c.fillStyle = "#3b3";
	else
		c.fillStyle = "#6b6";
	c.fillRect(x*16, y*16, 16, 16);
}

function drawProperty(x, y) {
	if ((x + y) % 2 == 0)
		c.fillStyle = player_mask[y][x] == 1 ? "#33b" : "#b33";
	else
		c.fillStyle = player_mask[y][x] == 1 ? "#66b" : "#b66";
	c.fillRect(x*16, y*16, 16, 16);
}

function drawWall(x, y) {
	if ((x + y) % 2 == 0)
		c.fillStyle = "#442";
	else
		c.fillStyle = "#753";
	c.fillRect(x*16, y*16, 16, 16);
}


