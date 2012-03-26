
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
var next_state = 0;
var state_timer = 0;
var next_state_change = 0;
var state_div;

var cannons_left = 2;

var mouse_x = 0;
var mouse_y = 0;

var compInt = null;

var pieces = [
[ [ 0,0,0 ],
  [ 0,1,0 ],
  [ 0,0,0 ], ],
[ [ 0,0,0 ],
  [ 1,1,1 ],
  [ 0,0,1 ], ],
[ [ 0,1,0 ],
  [ 1,1,1 ],
  [ 0,0,0 ], ],
[ [ 0,0,0 ],
  [ 1,1,1 ],
  [ 0,0,0 ], ],
[ [ 0,0,0 ],
  [ 0,1,1 ],
  [ 0,1,1 ], ],
[ [ 0,0,0 ],
  [ 0,1,1 ],
  [ 0,0,0 ], ],
[ [ 1,0,1 ],
  [ 1,1,1 ],
  [ 0,0,0 ], ],
]

var current_piece;


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
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

var newBoard =
[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,2,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,4,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,4,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,4,1,2,1,1,4,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,4,1,1,1,1,4,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,4,1,1,1,1,4,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,4,4,4,4,4,4,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,2,1,1,1,1,1,1,0,0,0],
[0,0,0,1,4,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,4,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,4,1,1,2,1,4,1,1,1,1,2,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,4,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,4,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

var board =
[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

/* first byte */
var WATER    = 0
var GRASS    = 1
var FORTRESS = 2
var FIRE     = 3
var WALL     = 4
/* second byte */
var UNKNOWN  = 0<<8
var CHECK    = 1<<8
var OPEN     = 2<<8
var CLOSED   = 3<<8

function getTileType(x)
{
	return x & 0x00ff;
}

function getPropertyType(x)
{
	return x & 0xff00;
}

function isOpen(x, y, dx, dy)
{
	while (x > 0 && x <= width && y > 0 && y <= height)
	{
		x += dx;
		y += dy;

		if (getTileType(board[y][x]) == WATER
				|| getPropertyType(board[y][x]) == OPEN)
			return true;

		if (getTileType(board[y][x]) == WALL
				|| getPropertyType(board[y][x]) == CLOSED)
			return false;
	}

	alert('wut');
}

function clearFires()
{
	var x = 0;
	var y = 0;

	for (x = 0; x < width; x++)
	{
		for (y = 0; y < height; y++)
		{
			if (getTileType(board[y][x]) == FIRE)
			{
				board[y][x] = getPropertyType(board[y][x]) | GRASS;
			}
		}
	}
}

function figureOutProperty()
{
	var x = 0;
	var y = 0;

	/* Clear the property byte. */
	for (x = 0; x < width; x++)
	{
		for (y = 0; y < height; y++)
		{
			board[y][x] = getTileType(board[y][x]);
			if (board[y][x] == GRASS
					|| board[y][x] == FIRE
					|| board[y][x] == FORTRESS)
				board[y][x] = CHECK | board[y][x]
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
				if (getPropertyType(board[y][x]) == CHECK)
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
						board[y][x] = OPEN | getTileType(board[y][x]);
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
			if (getPropertyType(board[y][x]) == CHECK)
				board[y][x] = CLOSED | getTileType(board[y][x]);
		}
	}
}

function newPiece()
{
	var pos = parseInt(Math.random()*100) % pieces.length;

	current_piece = [ [0,0,0], [0,0,0], [0,0,0] ];

	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
			current_piece[i][j] = pieces[pos][i][j];
}

function rotatePiece(dir)
{
	var tmp = [ [0,0,0], [0,0,0], [0,0,0] ];

	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
			tmp[i][j] = current_piece[i][j];

	if (dir == 1)
	{
		current_piece[0][0] = tmp[2][0];
		current_piece[0][1] = tmp[1][0];
		current_piece[0][2] = tmp[0][0];
		current_piece[1][0] = tmp[2][1];
		current_piece[1][1] = tmp[1][1];
		current_piece[1][2] = tmp[0][1];
		current_piece[2][0] = tmp[2][2];
		current_piece[2][1] = tmp[1][2];
		current_piece[2][2] = tmp[0][2];
	}
	else
	{
		current_piece[2][0] = tmp[0][0];
		current_piece[1][0] = tmp[0][1];
		current_piece[0][0] = tmp[0][2];
		current_piece[2][1] = tmp[1][0];
		current_piece[1][1] = tmp[1][1];
		current_piece[0][1] = tmp[1][2];
		current_piece[2][2] = tmp[2][0];
		current_piece[1][2] = tmp[2][1];
		current_piece[0][2] = tmp[2][2];
	}
}

var ctrl = false;

function canMakeWallXY(x, y)
{
	for (var j = 0; j < 3; j++)
		for (var i = 0; i < 3; i++)
			if (current_piece[j][i] == 1)
			{
				if (!(getTileType(board[x+i-1][y+j-1]) == GRASS
							|| getTileType(board[x+i-1][y+j-1]) == FIRE)
						|| player_mask[x+i-1][y+j-1] != player)
					return false;

				for (var c = 0; c < cannons.length; c++)
					if (cannons[c].x == x+i-1 && cannons[c].y == y+j-1)
						return false;
			}

	return true;
}

function canMakeWall(e)
{
	var pos = getCursorPosition(e);

	var y = parseInt(pos.y/16);
	var x = parseInt(pos.x/16);

	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
			if (current_piece[i][j] == 1)
			{
				if (!(getTileType(board[y+j-1][x+i-1]) == GRASS
							|| getTileType(board[y+j-1][x+i-1]) == FIRE)
						|| player_mask[y+j-1][x+i-1] != player)
					return false;

				for (var c = 0; c < cannons.length; c++)
					if (cannons[c].x == x+i-1 && cannons[c].y == y+j-1)
						return false;
			}

	return true;
}

function makeWall(e)
{
	if (!canMakeWall(e))
		return;

	var pos = getCursorPosition(e);

	var y = parseInt(pos.y/16);
	var x = parseInt(pos.x/16);

	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
			if (current_piece[i][j] == 1)
			{
				websocket.send('wall ' + (x+i-1) + "," + (y+j-1));
				board[y+j-1][x+i-1] = WALL;
			}

	newPiece();
	figureOutProperty();
	draw();
}

function makeCannon(e)
{
	var pos = getCursorPosition(e);

	var y = parseInt(pos.y/16);
	var x = parseInt(pos.x/16);

	var cannon_already_there = false;

	for (var c = 0; c < cannons.length; c++)
		if (cannons[c].x == x && cannons[c].y == y)
			cannon_already_there = true;

	if (cannons_left > 0
			&& !cannon_already_there
			&& player_mask[y][x] == player
			&& getPropertyType(board[y][x]) == CLOSED
			&& (getTileType(board[y][x]) == GRASS
				|| getTileType(board[y][x]) == FIRE))
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
	board[pos.y][pos.x] = WALL;

	figureOutProperty();
	draw();
}

function fireCannonball(e)
{
	var pos = getCursorPosition(e);

	var l = cannons.length;
	for (var i = 0; i < l; i++)
	{
		var c = cannons[i];
		if (player_mask[c.y][c.x] == player
				&& getPropertyType(board[c.y][c.x]) == CLOSED)
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

function onMouseMove(e)
{
	mouse_x = e.x;
	mouse_y = e.y;
}

function onClick(e)
{
	if (state == 2)
		fireCannonball(e);
	else if (state == 0)
		makeWall(e);
	else if (state == 1)
		makeCannon(e);
	else if (state == 8)
	{
		websocket.send("gameover");
		state = 3;
	}
}

function doKeyDown(e)
{
	switch(e.keyCode)
	{
		case 17:
			ctrl = true;
			break;
		case 88: // x
			rotatePiece(0);
			break;
		case 90: // z
			rotatePiece(1);
			break;
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
		state_div.innerHTML = "State: Waiting for other player";
	else if (state == 4)
		state_div.innerHTML = "State: Waiting for cannonballs to land";
	else if (state == 5)
		state_div.innerHTML = "State: You Won!";
	else if (state == 6)
		state_div.innerHTML = "State: You Lost!";
	else if (state == 7)
		state_div.innerHTML = "State: Draw!";
	else if (state == 8)
		state_div.innerHTML = "State: Click to play again!";
}

function getNewBoard()
{
	for (var i = 0; i < height; i++)
	{
		for (var j = 0; j < width; j++)
		{
			board[i][j] = newBoard[i][j];
		}
	}
}

function init(is_ai)
{
	a = document.getElementById("a");
	a.addEventListener("click", onClick, false);
	a.addEventListener("mousemove", onMouseMove, false);
	window.addEventListener('keydown', doKeyDown, false);
	window.addEventListener('keyup', doKeyUp, false);

	c = a.getContext("2d");

	setInterval(update, 50);
	if (is_ai)
		compInt = setInterval(doComputer, 500);

	output = document.getElementById("output");
	state_div = document.getElementById("state");
	state_div.innerHTML = "whee";

	$("#refresh").click(function() {
		$("#rooms").find("option").remove();
		doSend('list');
	});

	websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) { onOpen(evt) };
	websocket.onclose = function(evt) { onClose(evt) };
	websocket.onmessage = function(evt) { onMessage(evt) };
	websocket.onerror = function(evt) { onError(evt) };

	newGame();
}

function newGame()
{
	getNewBoard();

	newPiece();
	figureOutProperty();
	draw();

	state = 3;
	next_state = 0;
	next_state_change = 20*10;
	state_timer = 0;

	cannons = new Array();
}

function getParams() {
	var res = {};
	var a = window.location.search.replace(/\?/, '').split(/&/);
	for (var i in a) {
		var e = a[i].split('=');
		res[e[0]] = e[1];
	}
	return res;
}

function onOpen(evt) {
	var params = getParams();

	writeToScreen("CONNECTED");

	if (params['game'] == undefined)
		doSend('join default');
	else
		doSend('join ' + params['game']);
	doSend('list');
	doSend('ready');
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
		from = new Cell(parseInt(m[1]), parseInt(m[2]));
		to = new Cell(parseInt(m[3]), parseInt(m[4]));
		fireCannonball2(from, to);
	}
	else if ( (m = evt.data.match(/wall (\d+),(\d+)/)) )
	{
		pos = new Cell(parseInt(m[1]), parseInt(m[2]));
		makeWall2(pos);
	}
	else if ( (m = evt.data.match(/cannon (\d+),(\d+)/)) )
	{
		pos = new Cell(parseInt(m[1]), parseInt(m[2]));
		makeCannon2(pos);
	}
	else if ( (m = evt.data.match(/player (\d+)/)) )
	{
		writeToScreen('<span style="color: blue; "> You are ' + evt.data+ ' in this room</span> ');
		player = parseInt(m[1]);
		if (player > 2)
			writeToScreen('<span style="color: red; "> Players over 2 cannot do anything, sorry. Try joining a different room.</span> ');
	}
	else if ( (m = evt.data.match(/go/)) )
	{
		switchState();
	}
	else if ( (m = evt.data.match(/newgame/)) )
	{
		newGame();
		websocket.send('ready');
	}
	else if ( (m = evt.data.match(/room (.) (\d+) (.*)/)) )
	{
		var in_room = m[1] == '*';
		var players = m[2];
		var name = m[3];

		$("#rooms")
			.append($('<option></option>')
				.attr("value", name)
				.text((in_room ? '* ' : '') +
				      name + " (" + players + ")"));
	}
	else
	{
		writeToScreen('<span style="color: red; "> UNKNOWN MESSAGE: ' + evt.data + '</span> ');
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

	if (state == 3)
		state = next_state;

	if (compInt != null)
	{
		if (state == 2)
		{
			window.clearInterval(compInt);
			compInt = setInterval(doComputer, 300);
		}
		else
		{
			window.clearInterval(compInt);
			compInt = setInterval(doComputer, 500);
		}
	}

	if (state == 1)
		clearFires();

	next_state = [1,2,0][state];

	if (state == 0)
		next_state_change = 20*20;
	else
		next_state_change = 20*10;

	figureOutProperty();

	cannons_left = 0;

	for (var i = 0; i < height; i++)
		for (var j = 0; j < width; j++)
			if (player_mask[i][j] == player
					&& board[i][j] == (CLOSED | FORTRESS))
				cannons_left++;
}

function figureOutIfOver()
{
	var p1_alive = false;
	var p2_alive = false;

	figureOutProperty();

	for (var i = 0; i < height; i++)
	{
		for (var j = 0; j < width; j++)
		{
			if (getPropertyType(board[i][j]) == CLOSED
					&& getTileType(board[i][j]) == FORTRESS)
			{
				if (player_mask[i][j] == 1)
					p1_alive = true;
				else if (player_mask[i][j] == 2)
					p2_alive = true;
			}
		}
	}

	if (p1_alive && !p2_alive)
		return player == 1 ? 1 : -1;
	if (p2_alive && !p1_alive)
		return player == 2 ? 1 : -1;
	if (!p1_alive && !p2_alive)
		return 2;
	return 0;
}

function sendGameover()
{
	state = 8;
}

function update() {

	var l = cannons.length;
	for (var i = 0; i < l; i++)
	{
		if (cannons[i].fire_timer > 0)
			cannons[i].fire_timer--;
	}

	var cannonballs_left = false;
	l = cannonballs.length;
	for (var i = 0; i < l; i++)
	{
		var cb = cannonballs[i];
		if (!cb.done)
		{
			cannonballs_left = true;

			var dist = Math.abs(cb.end_x - cb.curr_x) + Math.abs(cb.end_y - cb.curr_y);
			cb.curr_x = cb.curr_x + cb.v*cb.dx;
			cb.curr_y = cb.curr_y + cb.v*cb.dy;
			var dist2 = Math.abs(cb.end_x - cb.curr_x) + Math.abs(cb.end_y - cb.curr_y);

			if (dist2 > dist)
			{
				cb.done = true;
				var x = parseInt(cb.end_x/16);
				var y = parseInt(cb.end_y/16);
				if (getTileType(board[y][x]) != WATER)
					board[y][x] = FIRE;

				/* Note: property does not change here until the state changes.
				 * Otherwise, the player might not be able to fire all his
				 * cannons that he should own. */
			}
		}
	}

	state_timer++;
	if (state < 3 && state_timer >= next_state_change)
	{
		if (state == 2)
			state = 4;
		else
		{
			if (state == 0)
			{
				var over = figureOutIfOver();

				if (over == -1)
				{
					state = 6;
					setTimeout(sendGameover, 5000);
				}
				else if (over == 1)
				{
					state = 5;
					setTimeout(sendGameover, 5000);
				}
				else if (over == 2)
				{
					state = 7;
					setTimeout(sendGameover, 5000);
				}
				else
				{
					state = 3;
					websocket.send("ready");
				}
			}
			else
			{
				state = 3;
				websocket.send("ready");
			}
		}
	}

	if (!cannonballs_left && state == 4)
	{
		state = 3;
		websocket.send("ready");
	}

	draw();
}

function doComputer() {
	if (state == 0) {
		doComputerPlacePiece();
	} else if (state == 1) {
		doComputerPlaceCannon();
	} else if (state == 2) {
		doComputerFireCannonball();
	}
}

function doComputerFireCannonball()
{
	if (cannons_left == 0)
		return;

	var num_walls = 0;

	for (var i = 0; i < height; i++)
	{
		for (var j = 0; j < width; j++)
		{
			if (player_mask[i][j] != player
					&& getTileType(board[i][j]) == WALL)
			{
				num_walls++;
			}
		}
	}

	var skip = parseInt(Math.random()*1000) % num_walls;

	for (var i = 0; i < height; i++)
	{
		for (var j = 0; j < width; j++)
		{
			if (player_mask[i][j] != player
					&& getTileType(board[i][j]) == WALL)
			{
				if (skip-- == 0)
				{
					var l = cannons.length;
					for (var cn = 0; cn < l; cn++)
					{
						var c = cannons[cn];
						if (player_mask[c.y][c.x] == player
								&& getPropertyType(board[c.y][c.x]) == CLOSED
								&& c.fire_timer == 0)
						{
							var cb = new Cannonball(c.x*16, c.y*16, j*16, i*16);
							cannonballs.push(cb);
							c.fire_timer = 20*2;

							websocket.send('cannonball ' + c.x*16 + "," + c.y*16 + "," + j*16 + "," + i*16);

							return;
						}
					}
				}
			}
		}
	}
}

function doComputerPlaceCannon()
{
	if (cannons_left == 0)
		return;

	var num_spots = 0;

	for (var i = 0; i < height; i++)
	{
		for (var j = 0; j < width; j++)
		{
			if (player_mask[i][j] == player
					&& board[i][j] == (CLOSED | GRASS))
			{
				num_spots++;
			}
		}
	}

	var skip = parseInt(Math.random()*1000) % num_spots;

	for (var i = 0; i < height; i++)
	{
		for (var j = 0; j < width; j++)
		{
			if (player_mask[i][j] == player
					&& board[i][j] == (CLOSED | GRASS)
					&& skip-- <= 0)
			{
				var cannon_already_there = false;

				for (var c = 0; c < cannons.length; c++)
					if (cannons[c].x == j && cannons[c].y == i)
						cannon_already_there = true;

				if (!cannon_already_there)
				{
					websocket.send('cannon ' + j + "," + i);

					cannons.push(new Cannon(j, i));
					cannons_left--;

					return;
				}
			}
		}
	}
}

function findBestFortress(f) {
	for (var i = 0; i < height; i++)
	{
		for (var j = 0; j < width; j++)
		{
			if (player_mask[i][j] == player
					&& board[i][j] == (OPEN | FORTRESS))
			{
				if (f == 0)
					return new Cell(i, j);
				f--;
			}
		}
	}

	return null;
}

function doComputerPlacePiece() {
	var f = 0;

	while (true)
	{
		var fort = findBestFortress(f);

		f++;

		if (!fort)
			return;

		for (var i = -3; i <= 3; i++)
		{
			for (var j = -3; j <= 3; j++)
			{
				if (!(Math.abs(i) == 3 || Math.abs(j) == 3))
					continue;

				if (getPropertyType(board[fort.x+i][fort.y+j]) == OPEN)
				{
					// open spot, try placing piece
					var found_it = false;

					for (var k = 0; k < 3; k++)
					{
						rotatePiece(1);
						found_it = canMakeWallXY(fort.x+i, fort.y+j);
						if (found_it)
							break;
					}

					if (!found_it)
						continue;

					for (var m = 0; m < 3; m++)
						for (var n = 0; n < 3; n++)
							if (current_piece[m][n] == 1)
							{
								websocket.send('wall ' + (fort.y+j+m-1) + "," + (fort.x+i+n-1));
								board[fort.x+i+n-1][fort.y+j+m-1] = WALL;
							}

					newPiece();
					figureOutProperty();
					return;
				}
			}
		}

		newPiece();
		return;
	}
}

function draw() {

	printState();

	for (var i = 0; i < 40; i++)
	{
		for (var j = 0; j < 30; j++)
		{
			switch(getTileType(board[j][i]))
			{
				case WATER:
					drawWater(i, j);
					break;
				case GRASS:
					if (getPropertyType(board[j][i]) == CLOSED)
						drawProperty(i, j);
					else
						drawGrass(i, j);
					break;
				case FORTRESS:
					drawCastle(i, j);
					break;
				case WALL:
					drawWall(i, j);
					break;
				case FIRE:
					drawBurn(i, j);
					break;
				default:
					alert('wuttt');
					break;
			}
		}
	}

	drawCannons();
	drawCannonballs();
	if (state == 0)
		drawPiece();

	var p = (next_state_change - state_timer) / next_state_change;

	if (p < 0)
		p = 0;

	if (state != 3 && state != 4)
	{
		c.fillStyle = "#f00";
		c.fillRect(3*16, 8, 34*16*p, 16);
	}

	c.fillStyle = "#000";
	c.strokeRect(3*16, 8, 34*16, 16);

	c.font = "bold 14px sans-serif";
	c.textBaseline = "top";
	c.fillStyle = "#000";

	var tx = 3*16 + 10;
	var ty = 8;

	if (state == 0)
		c.fillText("Build Walls!", tx, ty);
	else if (state == 1)
		c.fillText("Build Cannons (" + cannons_left + " left)!", tx, ty);
	else if (state == 2)
		c.fillText("Fire!", tx, ty);
	else if (state == 3)
		c.fillText("Waiting...", tx, ty);
	else if (state == 4)
		c.fillText("Waiting...", tx, ty);
	else if (state == 5)
		c.fillText("You Won!", tx, ty);
	else if (state == 6)
		c.fillText("You Lost!", tx, ty);
	else if (state == 7)
		c.fillText("Draw!", tx, ty);
	else if (state == 8)
		c.fillText("Click to play again!", tx, ty);
}

function square(x)
{
	return x*x;
}

function drawPiece()
{
	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
			if (current_piece[i][j] == 1)
				drawPieceWall(parseInt((mouse_x-24)/16)+i, parseInt((mouse_y-24)/16)+j);
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
	c.fillStyle = "#dd3";
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

function drawPieceWall(x, y) {
	c.fillStyle = "#fcf";
	c.globalAlpha = 0.7;
	c.fillRect(x*16, y*16, 16, 16);
	c.globalAlpha = 1.0;
}

function drawWall(x, y) {
	if ((x + y) % 2 == 0)
		c.fillStyle = "#442";
	else
		c.fillStyle = "#753";
	c.fillRect(x*16, y*16, 16, 16);
}


