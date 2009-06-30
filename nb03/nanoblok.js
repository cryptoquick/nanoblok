/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo (http://superluminon.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var blockscale = 20;

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	var nano = Raphael("nano", 800, 650);
	
	var charCode;
	
//	buildSquare(size, axis, angle, scale, trans, nano)
	buildSquare(50, 'x', 0, {x: 1, y: 1}, {x: 100, y: 100}, nano);	
}

/* Main Block function */
function buildSquare(size, axis, angle, scale, trans, nano) {
	var coors = new Array(4);
	
	// Create a 50px square
	var square = matrixCoors (size);
	
	// Rotate the square; x is a vertical rotation, y is a horizontal rotation,
	// and z rotates around the screen. Trust me, it makes sense.
	
	for (i = 0; i < 4; i++) {
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
//	alert(matrix.x(rotation[axis]).inspect());
	return rotation[axis].x(matrix);
}

function matrixScale (matrix, scale) {
	var scaling = $M([
			[scale.x, 0, 0, 0],
			[0, scale.y, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		]);
		
//	alert((scaling.x(matrix)).inspect());
	return scaling.x(matrix);
}

function matrixTranslate (matrix, trans) {
//	var trans = {x: 100, y: 100};	
	var translate = $V(
			[trans.x, trans.y, 0, 1]
		);

//	alert(translate.add(matrix).inspect());
	return translate.add(matrix);
}

function matrixArray (coors, matrix, i) {
	coors[i] = matrix;
//	alert(coors[i].e(1,1));
	return coors;
}

function drawSquare (sq, nano) {
	var square = nano.path().
	moveTo(sq[0].e(1,1), sq[0].e(2,1)).
	lineTo(sq[1].e(1,2), sq[1].e(2,2)).
	lineTo(sq[2].e(1,3), sq[2].e(2,3)).
	lineTo(sq[3].e(1,4), sq[3].e(2,4)).
	lineTo(sq[0].e(1,1), sq[0].e(2,1));
	
	square.attr('stroke', 'black');
	square.attr('stroke-width', '2');
	
	return square;
}