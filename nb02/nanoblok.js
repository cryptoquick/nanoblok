/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo (http://superluminon.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var blockscale = 50;
var gridC = 16; // Columns
var gridR = 16; // Rows

var gridOffsetX = 100;
var gridOffsetY = 100;

var gridX = 0;
var gridY = 0;

// General iso / block proportions
var sc1 = blockscale;
var sc2 = blockscale / 2;
var sc4 = blockscale / 4;
var sc3 = sc2 + sc4;

var Voxel = new Array();
var Field = new Object();

// Creates values within an associative arrray of established coordinates
function VoxArray(x, y, z, value) {
	if (Voxel[x] == null) {
		Voxel[x] = new Array(x);
	}

	if (Voxel[x][y] == null) {
		Voxel[x][y] = new Array(y);
	}

	Voxel[x][y][z] = value;
}

function FieldRecord(blockID, position) {	
	Field[blockID] = position;
}

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	// Helps to know how fast things are going -- TEMP
	var init0 = new Date();

	var nano = Raphael("nano", 800, 650); // Basis for Nanoblok graphics
	
	drawGrid(nano, blockscale, gridOffsetX, gridOffsetY);
	
	masterBlok(nano);
	
//	placeBlok(2, 3, nano);
	
	drawBlok(150, 400, blockscale, nano);
	

	
//	var gianthex = drawother(hexiso(0, -162.5, 800), [7, 3, 4, 5], nano, false); gianthex.attr({fill: "blue", "fill-opacity": 0.5}); alert(gianthex.getBBox().x + ', ' + gianthex.getBBox().y);
	
	// TEMP
	/*
	var hex1 = hexiso(150, 400, 50);
	
	nano.path({stroke: "red", "stroke-width":"2"}).
	moveTo(hex1.x[1],hex1.y[1]).
	lineTo(hex1.x[2],hex1.y[2]).
	lineTo(hex1.x[3],hex1.y[3]).
	lineTo(hex1.x[4],hex1.y[4]).
	lineTo(hex1.x[5],hex1.y[5]).
	lineTo(hex1.x[6],hex1.y[6]).
	lineTo(hex1.x[7],hex1.y[7]);
	*/
	var init1 = new Date();
//	alert('Program initialized in ' + (init1 - init0) + ' milliseconds.');

}

// Draws hexagonal points in iso perspective, based on hard coordinate and size of block. Depends on an orientation array (see block-grid.png in Nanoblok Extras). Returns static coordinates of where to draw blocks on the screen.
function hexiso (pos_x, pos_y, scale) {
	var scX = pos_x;
	var scY = pos_y;
	
	// Builds an array of points that corresponds to an entire isometric block (six points), including center (7). Arrays for both X and Y coordinates. Offset added to hexagon proportions.	
	
	var isoX = Array();
	isoX [1] = sc2 + scX;
	isoX [2] = sc1 + scX;
	isoX [3] = sc1 + scX;
	isoX [4] = sc2 + scX;
	isoX [5] = scX;
	isoX [6] = scX;
	isoX [7] = sc2 + scX;

	var isoY = Array();
	isoY [1] = scY;
	isoY [2] = sc4 + scY;
	isoY [3] = sc3 + scY;
	isoY [4] = sc1 + scY;
	isoY [5] = sc3 + scY;
	isoY [6] = sc4 + scY;
	isoY [7] = sc2 + scY;
	
	return {x: isoX, y: isoY};
}

// Boy, it'll sure be convenient to not have to write all this just to draw a rhombus.
function drawrmb (a, b, c, d, set, nano) {
	var rhombus = nano.path().
	moveTo(set.x[a], set.y[a]).
	lineTo(set.x[b], set.y[b]).
	lineTo(set.x[c], set.y[c]).
	lineTo(set.x[d], set.y[d]).
	lineTo(set.x[a], set.y[a]);
	
	return rhombus;
}

function drawother (coorset, hexset, nano, closed) {
	var drawing = nano.path();
	var hexspot0 = hexset.pop(); // need to hold onto this for later
	var hexspot = hexspot0;
	drawing.moveTo(coorset.x[hexspot], coorset.y[hexspot]);
	i = 0;
	
	while (i < hexset.length || i == 7) {
		hexspot = hexset.pop();
		drawing.lineTo(coorset.x[hexspot], coorset.y[hexspot]);
		i = i++;
	}
	
	if (closed) {
		drawing.lineTo(coorset.x[hexspot0], coorset.y[hexspot0]);
	}
	
	return drawing;
}

function drawGrid(nano, scale) { // Offset might be something I could code in later.
	var gridX = 0;
	var gridY = 0;
	var gridW = gridC * scale;
	var gridH = gridW / 2; // Doesn't work if both sides aren't equal
//	var blok = placeBlok(gridX, gridY, nano);
	
//	var gridElement = drawrmb(7, 3, 4, 5, hexiso(gridX, gridY), nano);
	
	for (x = 0; x <= 15; x++) {
		for (y = 0; y <= 15; y++) {
			gridX = (x * sc2) + (y * sc2);
			gridY = (y * sc4) + (gridH - x * sc4);
			
			var num = nano.text(gridX + sc2, gridY + sc3, x + ", " + y); // TEMP

			set = hexiso(gridX, gridY, scale);
			
			var gridElement = drawrmb(7, 3, 4, 5, set, nano);
						
			gridElement.attr({stroke: "#777", fill: "#DDD"})
			
			gridElement.click(function () {		// Not sure if this piece of code needs less OOP. Based on a Raphael example. REVIEW
				blok = placeBlok(gridX, gridY, nano);
			}).mouseover(function () {
				this.animate({fill: "#fcaf3e"}, 0);
			}).mouseout(function () {
				this.animate({fill: "#DDD"}, 200);
			});
			
//			voxArray[gridX][gridY][-1] = gridElement;
		}
	}
}

// Draws shapes, styles them into what looks like a block, and returns them as a Raph set.
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
/*
function arrayBloks (voxArray, row, column, nano) {
	var c2 = gridC / 2;
	var r2 = gridR / 2;
	
//	drawBlok(150, 400, blockscale, nano);
// 			gridX = (x * sc2) + (y * sc2);
//			gridY = (y * sc4) + (gridH - x * sc4);
	
	if (column % 2 && row % 2) { // both odd
		if (column > c2) {
			drawBlok(gridC * , 400, blockscale, nano);
		} else {
			
		}
	}
	else if (column % 2) { // c's odd
	}
	else if (row % 2) { // r's odd
	}
	else { // both even
	}; // If column is odd, else even
	var columnY = () + 237.5; // Figure obtained using the following code: var gianthex = drawother(hexiso(0, -162.5, 800), [7, 3, 4, 5], nano, false); gianthex.attr({fill: "blue", "fill-opacity": 0.5}); alert(gianthex.getBBox().x + ', ' + gianthex.getBBox().y);
	
	voxArray[row][column][0] = drawBlok(rowX, columnY, scale, nano);
	
	return voxArray;
}
*/

function gridToPixel(c, r) { // Offset might be something I could code in later.
	var gridW = gridC * blockscale;
	var gridH = gridW / 2; // Doesn't work if both sides aren't equal
	
//	var gridElement = drawrmb(7, 3, 4, 5, hexiso(gridX, gridY), nano);

	x = c;
	y = r;

	gridX = (x * sc2) + (y * sc2);
	gridY = (y * sc4) + (gridH - x * sc4);
	
//	set = hexiso(gridX, gridY, blockscale);
//	var blok = drawBlok (gridX, gridY, blockscale, nano);
	return {x: gridX, y: gridY};
}

function smartBlok (column, row, nano) {
	gridblok = gridToPixel(column, row);
	coorset = hexiso(gridblok.x, gridblok.y, sc1);
	hexset = [1, 2, 3, 4, 5, 6];
	var blokTop = drawrmb(1, 2, 7, 6, coorset, nano);
	var blokRight = drawrmb(2, 3, 4, 7, coorset, nano);
	var blokLeft = drawrmb(7, 4, 5, 6, coorset, nano);

	blokTop.attr({fill: "rgb(211,175,118)"});
	blokRight.attr({fill: "rgb(191,155,98)"});
	blokLeft.attr({fill: "rgb(171,135,78)"});
	
	blok = nano.set();
	blok.push(blokTop);
	blok.push(blokRight);
	blok.push(blokLeft);
	
	return blok;
}

function masterBlok(nano) {
	donut();
	
	var gridblok = Object;
	for (var i = 0; Field.length; i++) {
//		gridblok = gridToPixel(, );
		smartBlok(Field[i].x, Field[i].y, nano);
	}
}

/*
function donut() {
	var blok = "bla";
	VoxArray(Voxel, Field, 3, 3, 0, blok);
	VoxArray(Voxel, Field, 3, 4, 0, blok);		
	VoxArray(Voxel, Field, 3, 5, 0, blok);
	VoxArray(Voxel, Field, 4, 3, 0, blok);
	VoxArray(Voxel, Field, 4, 5, 0, blok);
	VoxArray(Voxel, Field, 5, 3, 0, blok);		
	VoxArray(Voxel, Field, 5, 4, 0, blok);
	VoxArray(Voxel, Field, 5, 5, 0, blok);
}
*/

function donut() {
	var donut = new Array(
			[3, 3],
			[3, 4],
			[3, 5],
			[4, 3],
			[4, 5],
			[5, 3],
			[5, 4],
			[5, 5]
		);
	
	var blok = "doh";
	
	for (var i = 0; i < donut.length; i++) {
		VoxArray(Voxel, Field, donut[i][0], donut[i][1], 0, blok);
	}
}

// .click(function () {

/*
// Nearby blocks
var testArray = [4, 5, 6];

function nearby (points, point) {
	var pointIndex = points.indexOf(point);
	if (pointIndex != -1) {
		
	}
}
*/
