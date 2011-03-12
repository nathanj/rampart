
var a;
var c;


var width=40
var height=30

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
[0,0,0,1,4,1,3,4,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,4,1,2,1,1,4,1,1,1,0,0,0],
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

function onClick(e)
{
	var pos = getCursorPosition(e);

	var y = parseInt(pos.y/16);
	var x = parseInt(pos.x/16);

	// If wall, set to burn
	if (board[y][x] == 4)
		board[y][x] = 5;
	else
		board[y][x] = 4;

	draw();
}

function init()
{
	a = document.getElementById("a");
    a.addEventListener("click", onClick, false);

	c = a.getContext("2d");

	draw();
}

function draw() {

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
			else if (board[j][i] == 3)
				drawCannon(i, j);
			else if (board[j][i] == 4)
				drawWall(i, j);
			else if (board[j][i] == 5)
				drawBurn(i, j);
			else if (board[j][i] == OPEN)
				drawGrass(i, j);
			else if (board[j][i] == CLOSED)
				drawProperty(i, j);
		}
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
	drawGrass(x,y);
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
		c.fillStyle = "#33b";
	else
		c.fillStyle = "#66b";
	c.fillRect(x*16, y*16, 16, 16);
}

function drawWall(x, y) {
	if ((x + y) % 2 == 0)
		c.fillStyle = "#442";
	else
		c.fillStyle = "#753";
	c.fillRect(x*16, y*16, 16, 16);
}


