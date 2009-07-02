/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var size = 35;
var scale = {x: 1, y: 1};
var grid = {r: 16, c: 16};

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	// Helps to know how fast things are going -- TEMP
	var init0 = new Date();
	
	$("#progress").progressbar({ value: 50 });
	
	// Initialize the nano element as a Raphael canvas
	var nano = Raphael("nano", 800, 650);
	
	// Can't remember if this is necessary...
	var charCode;
	
	// x is a vertical rotation, y is a horizontal rotation,
	// and z rotates around the screen. Trust me, it makes sense.
	var angle = {x: 45, y: 30, z: -30};
	
	//	grid, angle, scale, trans, nano
	var isogrid = gridMatrix(grid, angle, scale, {x: 0, y: 300}, nano);
	
	var init1 = new Date();
	
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	
	testInput(isogrid, angle, nano);
	
//	drawBlock({x: 150, y: 200}, nano);
}

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.innerHTML = debug.innerHTML + '<br>' + input;
}

// Uses a fraction made by dividing the step 
function progress(step, base) {
	
	var percentage = Math.floor((step / base) * 100);
	
//	$(function(percentage) {
		//getter
	//	var value = $('#progress').progressbar('option', 'value');
		//setter
		$('#progress').progressbar('option', 'value', percentage);
//	});

}

// Function not being used right now, but might be useful later.
function testInput(isogrid, angle, nano) {
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
			angle.y++;
			isogrid = gridMatrix(grid, {y: angle.y, x: 45, z: -30}, scale, {x: 0, y: 300}, nano);;
		}
		// Right arrow key
		if (charCode == 39) {
			removeGrid (isogrid);
			angle.y--;
			isogrid = gridMatrix(grid, {y: angle.y, x: 45, z: -30}, scale, {x: 0, y: 300}, nano);;
		}
	}, false);
//	return isogrid;
}

/* Block Functions */
function drawBlock (position, nano) {
	var angle2 = {x: 0, y: 0, z: 0};
	
	var angle = angleBlock(angle2);
	
//	buildSquare(size, angle, scale, trans, nano);
	buildSquare(35, angle, {x: 1, y: 1}, {x: position.x, y: position.y}, nano);
}

function angleBlock (angle2) {
	var angle = new Object();
	angle.x = degRads(angle2.x);
	angle.y = degRads(angle2.y);
//	angle.z = Math.atan(0.5);
	angle.z = degRads(angle2.z);
	
/*	angle.x = degRads(45);
	angle.y = Math.asin(Math.tan(degRads(30)));
	angle.z = degRads(-30); */
	
	return angle;
}

function drawBlok (posX, posY, scale, nano) {
	coorset = hexiso(posX, posY, scale);
	hexset = [1, 2, 3, 4, 5, 6];
	var blokTop = drawrmb(1, 2, 7, 6, coorset, nano);
	var blokRight = drawrmb(2, 3, 4, 7, coorset, nano);
	var blokLeft = drawrmb(7, 4, 5, 6, coorset, nano);
	var blokInset1 = drawother(coorset, [6, 7, 2], nano, false);
	var blokInset2 = drawother(coorset, [7, 4], nano, false);
	var blokOutline = drawother(coorset, hexset, nano, true);

	blokTop.attr({fill: "rgb(211,175,118)"});
	blokRight.attr({fill: "rgb(191,155,98)"});
	blokLeft.attr({fill: "rgb(171,135,78)"});
	blokInset1.attr({stroke: "rgb(231,195,138)", "stroke-width": "2"});
	blokInset2.attr({stroke: "rgb(231,195,138)", "stroke-width": "2"});
	blokOutline.attr({stroke: "#444", "stroke-width": "2"});
	
	blok = nano.set();
	blok.push(blokTop);
	blok.push(blokRight);
	blok.push(blokLeft);
	blok.push(blokInset1);
	blok.push(blokInset2);
	blok.push(blokOutline);
	
	return blok;
}

/* Grid Functions */
function changePerspective (isogrid, perspective, nano) {
	switch(perspective) {
		case 'iso45': angle = {x: 45, y: 30, z: -30};
		case 'iso': angle = {x: 45, y: 30, z: -30};
	}
	
	removeGrid (isogrid);
	isogrid = gridMatrix(grid, angle, scale, {x: 400, y: 100}, nano);
}

function gridMatrix(grid, angle2, scale, trans, nano) {
	
	var tiles = $M([
		[0],
		[0],
		[0],
		[1]
		]);
	
	var matrix = gridTiles (tiles, grid);
	var board = new Array();
	var gridSize = grid.c * grid.r + 1;
	
	for (var i = 0; i < gridSize; i++) {
		progress(i, gridSize - 1);
		
		var slice = matrixSlice (matrix, i);
		var angle = angleIso (angle2);

		// Add each transformation together.
		if (angle.x !== 0) {
			var slice = matrixRotate (slice, 'x', angle);
		}
		if (angle.y !== 0) {
			var slice = matrixRotate (slice, 'y', angle);
		}
		if (angle.z !== 0) {
			var slice = matrixRotate (slice, 'z', angle);
		}

		var scaled = matrixScale (slice, scale);
		var translated = matrixTranslate (scaled, trans);
		var arrayed = matrixArray (matrix, translated, i);
		var tile = drawTiles(arrayed, angle, i, nano);
		board[i] = tile;
	}
	
	return board;
}

function angleIso (angle2) {
	var angle = new Object();
	angle.x = degRads(angle2.x);
	angle.y = Math.asin(Math.tan(degRads(angle2.y)));
	angle.z = degRads(angle2.z);
	
/*	angle.x = degRads(45);
	angle.y = Math.asin(Math.tan(degRads(30)));
	angle.z = degRads(-30); */
	
	return angle;
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
	var tile = buildSquare(size, angle, {x: 1, y: 1}, {x: sq[i].e(1,1), y: sq[i].e(2,1)}, nano);
	return tile;
}

function removeGrid (isogrid) {
	for (var i = 0; i < grid.c * grid.r + 1; i++) {
		isogrid[i].remove();
	}
}

/* Main Square Function */
function buildSquare(size, angle, scale, trans, nano) {
	var coors = new Array(4);

	var square = matrixCoors (size);
	
	for (var i = 0; i < 4; i++) {
		var slice = matrixSlice (square, i);
		
		// Add each transformation together.
		if (angle.x !== 0) {
			var slice = matrixRotate (slice, 'x', angle);
		}
		if (angle.y !== 0) {
			var slice = matrixRotate (slice, 'y', angle);
		}
		if (angle.z !== 0) {
			var slice = matrixRotate (slice, 'z', angle);
		}
		
		// Scale, Translate, and add into an array.
		var scaled = matrixScale (slice, scale);
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
	var cos = Math.cos(angle[axis]);
	var sin = Math.sin(angle[axis]);
	
	var rotation =
	{x: $M([
			[1,	0, 0, 0],
			[0, cos, sin, 0],
			[0, -sin, cos, 0],
			[0, 0, 0, 1]
		]),
	 y: $M([
			[cos, 0, -sin, 0],
			[0, 1, 0, 0],
			[sin, 0, cos, 0],
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