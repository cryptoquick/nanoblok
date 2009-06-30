/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo (http://superluminon.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var size = 35;
var angle = 45;
var scale = {x: 1, y: 0.5};
var grid = {r: 16, c: 16};

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	// Helps to know how fast things are going -- TEMP
	var init0 = new Date();
	
	var nano = Raphael("nano", 800, 650);
	
	var charCode;
	
//	buildSquare(size, axis, angle, scale, trans, nano)
//	buildSquare(size, 'z', 45, {x: 1, y: 0.5}, {x: 100, y: 200}, nano);
	
//	grid, axis, angle, scale, trans, nano
	var isogrid = gridMatrix(grid, 'z', angle, scale, {x: 400, y: 100}, nano);
	
	var init1 = new Date();
	
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	
	testInput(isogrid, nano);
}

function debug(input) {
	var debug = document.getElementById('debug');
	debug.innerHTML = debug.innerHTML + '<br>' + input;
}

// Function not being used right now, but might be useful later.
function testInput(isogrid, nano) {
	window.addEventListener("keydown", function(evt) {
		// Input Handling
		if (evt.type == "keydown") {
			// Some browsers support evt.charCode, some only evt.keyCode
			if (evt.charCode) {
				charCode = evt.charCode;
			}
			else {
				charCode = evt.keyCode;
			}
		}
		// Left arrow key
		if (charCode == 37) {
			removeGrid (isogrid);
			angle++;
			isogrid = gridMatrix(grid, 'z', angle, scale, {x: 400, y: 100}, nano);
		}
		// Right arrow key
		if (charCode == 39) {
			removeGrid (isogrid);
			angle--;
			isogrid = gridMatrix(grid, 'z', angle, scale, {x: 400, y: 100}, nano);
		}
	}, false);
//	return isogrid;
}

/* Grid Functions */

function gridMatrix(grid, axis, angle, scale, trans, nano) {
	var tiles = $M([
		[0],
		[0],
		[0],
		[1]
		])
	
	var matrix = gridTiles (tiles, grid);
	var board = new Array();
	
	for (var i = 0; i < grid.c * grid.r + 1; i++) {
		var slice = matrixSlice (matrix, i);
		var rotated = matrixRotate (slice, axis, angle);
		var scaled = matrixScale (rotated, scale);
		var translated = matrixTranslate (scaled, trans);
		var arrayed = matrixArray (matrix, translated, i);
		var tile = drawTiles(arrayed, angle, i, nano);
		board[i] = tile;
//		board = groupTiles(board, tile, i);
	}
	
	return board;
}

// Creates a rectangular grid of coordinates.
function gridTiles (tiles, grid) {
	for (var x = 0; x < grid.c; x++) {
		for (var y = 0; y < grid.r; y++) {
			var tile = $V([x * size, y * size, 0, 1]);
		//	var tile = $M([[x * size], [y * size], [0], [0]]);
			var tiles = tiles.augment(tile);
		}
	}
	
	return tiles;
}

function drawTiles (sq, angle, i, nano) {
	var tile = buildSquare(size, 'z', angle, {x: 1, y: 0.5}, {x: sq[i].e(1,1), y: sq[i].e(2,1)}, nano);
	return tile;
}

function groupTiles (board, tile, i) {
	
}

function removeGrid (isogrid) {
	for (var i = 0; i < grid.c * grid.r + 1; i++) {
		isogrid[i].remove();
	}
}

/* Main Square Function */
function buildSquare(size, axis, angle, scale, trans, nano) {
	var coors = new Array(4);

	var square = matrixCoors (size);
	
	// Rotate the square; x is a vertical rotation, y is a horizontal rotation,
	// and z rotates around the screen. Trust me, it makes sense.
	
	for (var i = 0; i < 4; i++) {
		var slice = matrixSlice (square, i);
		var rotated = matrixRotate (slice, axis, angle);
		var scaled = matrixScale (rotated, scale);
		var translated = matrixTranslate (scaled, trans);
		var arrayed = matrixArray (coors, translated, i);
	}
	
	var square = drawSquare(arrayed, nano);
	return square;
}

/* Matrix Functions */
function matrixSlice (coors, i) {
	var slice = coors.col(i + 1);
	return slice;
}

function degRads (angle) {
	return angle * Math.PI / 180;
}

function matrixCoors (size) {	
	var square = $M([
		[0, 0, size, size],
		[0, size, size, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1]
	]);
	
	return square;
}

function matrixRotate (matrix, axis, angle) {
	var cos = Math.cos(degRads(angle));
	var sin = Math.sin(degRads(angle));
	
	var rotation =
	{x: $M([
			[1,	0, 0, 0],
			[0, cos, -sin, 0],
			[0, sin, cos, 0],
			[0, 0, 0, 1]
		]),
	 y: $M([
			[cos, 0, sin, 0],
			[0, 1, 0, 0],
			[-sin, 0, cos, 0],
			[0, 0, 0, 1]
		]),
	 z: $M([
			[cos, -sin, 0, 0],
			[sin, cos, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		])
	};

	return rotation[axis].x(matrix);
}

function matrixScale (matrix, scale) {
	var scaling = $M([
			[scale.x, 0, 0, 0],
			[0, scale.y, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		]);
		

	return scaling.x(matrix);
}

function matrixTranslate (matrix, trans) {
	var translate = $V(
			[trans.x, trans.y, 0, 1]
		);


	return translate.add(matrix);
}

function matrixArray (coors, matrix, i) {
	coors[i] = matrix;

	return coors;
}

function drawSquare (sq, nano) {
	var square = nano.path().
	moveTo(sq[0].e(1,1), sq[0].e(2,1)).
	lineTo(sq[1].e(1,2), sq[1].e(2,2)).
	lineTo(sq[2].e(1,3), sq[2].e(2,3)).
	lineTo(sq[3].e(1,4), sq[3].e(2,4)).
	lineTo(sq[0].e(1,1), sq[0].e(2,1));
	
	square.attr('stroke', '#333');
	square.attr('fill', '#ddd');
	square.attr('stroke-width', '1');
	
	return square;
}