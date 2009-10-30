/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

var tick = 100

// Helper functions
/*function array_search (array, val) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][3] == val) { // Modified to look inside the nested arrays to find the colors
			return i;
		}
	}
	return false;
}*/
 
function array_search_key(array, num) {
	if (array[num]) return true;
	return false;
}

// SVG namespace so that objects can be attached to the document.
var svgNS = "http://www.w3.org/2000/svg";

// // Builds an array of points that corresponds to an entire isometric block (six points), including center (7). Arrays for both X and Y coordinates. Offset added to hexagon proportions.	
// function hexInit (commonVars) {
// 	var blockSize = commonVars.blockSize;
// 	
// //	loggit (commonVars.hexPoints);
// 	
// 	var isoX = Array();
// 	isoX [1] = blockSize.half;
// 	isoX [2] = blockSize.full;
// 	isoX [3] = blockSize.full;
// 	isoX [4] = blockSize.half;
// 	isoX [5] = 0;
// 	isoX [6] = 0;
// 	isoX [7] = blockSize.half;
// 
// 	var isoY = Array();
// 	isoY [1] = 0;
// 	isoY [2] = blockSize.quarter;
// 	isoY [3] = blockSize.third;
// 	isoY [4] = blockSize.full;
// 	isoY [5] = blockSize.third;
// 	isoY [6] = blockSize.quarter;
// 	isoY [7] = blockSize.half;
// 	
// 	commonVars.hexPoints = {x: isoX, y: isoY};
// 	
// 	return commonVars;
// }
// 
// // Draws hexagonal points in iso perspective, based on hard coordinate and size of block. Depends on an orientation array (see block-grid.png in Nanoblok Extras). Returns static coordinates of where to draw blocks on the screen.
// function hexiso (offset, commonVars) {
// 	var isoX = new Array();
// 	var isoY = new Array();
// 	
// //	loggit(commonVars.hexPoints.x);
// 	
// 	for (var i = 1; i <= 7; i++) {
// 		isoX[i] = commonVars.hexPoints.x[i] + offset.x;
// 		isoY[i] = commonVars.hexPoints.y[i] + offset.y;
// 	}
// 	
// 	return {x: isoX, y: isoY};
// }

// Draws hexagonal points in iso perspective, based on hard coordinate and size of block. Depends on an orientation array (see block-grid.png in Nanoblok Extras). Returns static coordinates of where to draw blocks on the screen.
function hexiso (offset, blockSize) {
	
	// Builds an array of points that corresponds to an entire isometric block (six points), including center (7). Arrays for both X and Y coordinates. Offset added to hexagon proportions.	
	
	var isoX = Array();
	isoX [1] = blockSize.half + offset.x;
	isoX [2] = blockSize.full + offset.x;
	isoX [3] = blockSize.full + offset.x;
	isoX [4] = blockSize.half + offset.x;
	isoX [5] = offset.x;
	isoX [6] = offset.x;
	isoX [7] = blockSize.half + offset.x;

	var isoY = Array();
	isoY [1] = offset.y;
	isoY [2] = blockSize.quarter + offset.y;
	isoY [3] = blockSize.third + offset.y;
	isoY [4] = blockSize.full + offset.y;
	isoY [5] = blockSize.third + offset.y;
	isoY [6] = blockSize.quarter + offset.y;
	isoY [7] = blockSize.half + offset.y;
	
	return {x: isoX, y: isoY};
}


function drawSet (hexSet, coorSet, closed) {
	pathElement = document.createElementNS(svgNS, 'path');
	
	var hexSpot = hexSet.pop();
	var path = '';
	path += 'M ' + coorSet.x[hexSpot] + ' ' + coorSet.y[hexSpot];
	
	var i = 0;

	while (i < hexSet.length || i == 7) {
		hexSpot = hexSet.pop();
		path += ' L ' + coorSet.x[hexSpot] + ' ' + coorSet.y[hexSpot];
		i = i++;
	}
	
	if (closed) {
		path += ' Z';
	}
	
	pathElement.setAttributeNS(null, 'd', path);
	
	return pathElement;
}

function transformBlock () {
	
}

var direction;

// Find a nearby block and then find its bounding box.
function voxelBBox (position) {
	var neighborIDs = neighbors(position);
	
	
	
	alert(position.x);
	
	if (direction % 2) { // odd
		position[direction]--;
	} else { // even
		position[direction]++;
	}
	
//	alert(position[direction]);
	
	targetElement = document.getElementById(elementID);
	bbox = targetElement.getBBox();
	
//	alert ('x: ' + bbox.x);
	
	if (z == -1) {
		// For blocks placed on the grid
		return {x: bbox.x + 2, y: bbox.y - blockSize.half + 1};
	} else {
		// For blocks placed above other blocks
		return {x: bbox.x + 0, y: bbox.y - blockSize.half - 2};
	}
}

// Creates the various coordinates necessary to make an isometric block
// from the coordinates provided by hexiso().
/* function makeBlock (offset, blockSize) {
	
	var coorSet = hexiso(offset, blockSize);
	
	var blokTop 	= drawSet([1, 2, 7, 6], coorSet, true);
	var blokRight 	= drawSet([2, 3, 4, 7], coorSet, true);
	var blokLeft 	= drawSet([7, 4, 5, 6], coorSet, true);
	var blokInset1 	= drawSet([6, 7, 2], 	coorSet, false);
	var blokInset2 	= drawSet([7, 4], 		coorSet, false);
	var blokOutline = drawSet([1, 2, 3, 4, 5, 6], coorSet, true);
	
	return {top: blokTop,
		right: blokRight,
		left: blokLeft,
		inset1: blokInset1,
		inset2: blokInset2,
		outline: blokOutline};
} */

// Creates the various coordinates necessary to make an isometric block
// from the coordinates provided by hexiso().
function makeObject (position, commonVars) {
	var coorSet = hexiso(position, commonVars.blockSize);
	
	var blokTop 	= drawSet([1, 2, 7, 6], coorSet, true);
	var blokRight 	= drawSet([2, 3, 4, 7], coorSet, true);
	var blokLeft 	= drawSet([7, 4, 5, 6], coorSet, true);
	var blokInset1 	= drawSet([6, 7, 2], 	coorSet, false);
	var blokInset2 	= drawSet([7, 4], 		coorSet, false);
	var blokOutline = drawSet([1, 2, 3, 4, 5, 6], coorSet, true);
	
	return {top: blokTop,
		right: blokRight,
		left: blokLeft,
		inset1: blokInset1,
		inset2: blokInset2,
		outline: blokOutline};
}

// From Tango Project colors:
// http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines
var palette = new Array();
palette[0] = [164, 0, 0, 'red', null];
palette[1] = [211, 127, 4, 'orange', null];
palette[2] = [213, 184, 8, 'yellow', null];
palette[3] = [42, 197, 18, 'green', null];
palette[4] = [43, 84, 200, 'blue', null];
palette[5] = [147, 29, 199, 'purple', null];
palette[6] = [190, 67, 180, 'pink', null];
palette[7] = [201, 202, 188, 'white', null];
palette[8] = [55, 48, 51, 'black', null];
palette[9] = [255, 255, 255, 'transparent', null];
palette[10] = [0, 0, 0, 'void', null];
palette[11] = [0, 0, 0, 'random', null];

// Sets the color of the block with above color values
function setColor(obj, colorname) {
//	var color = array_search(palette, colorname);
	var color = palette[3]; // kludge
	var colorR = color[0];
	var colorG = color[1];
	var colorB = color[2];
	var colorLeft = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
	var colorRight = "rgb(" + (colorR + 20) + ", " + (colorG + 20) + ", " + (colorB + 20) + ")";
	var colorTop = "rgb(" + (colorR + 40) + ", " + (colorG + 40) + ", " + (colorB + 40) + ")";
	var colorLines = "rgb(" + (colorR + 50) + ", " + (colorG + 50) + ", " + (colorB + 50) + ")";
	
	obj.left.setAttributeNS(null, "fill", colorLeft);
	obj.left.setAttributeNS(null, "id", 'left');
	obj.right.setAttributeNS(null, "fill", colorRight);
	obj.right.setAttributeNS(null, "id", 'right');
	obj.top.setAttributeNS(null, "fill", colorTop);
	obj.top.setAttributeNS(null, "id", 'top');
	obj.inset1.setAttributeNS(null, "stroke", colorLines);
	obj.inset1.setAttributeNS(null, "fill", "none");
	obj.inset2.setAttributeNS(null, "stroke", colorLines);
	obj.outline.setAttributeNS(null, "stroke", "#444");
	obj.outline.setAttributeNS(null, "fill", "none");
	
	var group = makeGroup(obj);

	group.setAttributeNS(null, "stroke-width", 1);
	group.setAttributeNS(null, "fill-opacity", 1.0);
	group.setAttributeNS(null, "stroke-opacity", 1.0);

	return group;
}

function makeGroup(obj) {
	var group = document.createElementNS(svgNS, 'g');
	group.appendChild(obj.left);
	group.appendChild(obj.right);
	group.appendChild(obj.top);
	
	var inset = document.createElementNS(svgNS, 'g');
	inset.appendChild(obj.inset1);
	inset.appendChild(obj.inset2);
	
	group.appendChild(inset);
	
	group.appendChild(obj.outline);
	
	return group;
}

// Finds the bounding box of the element that has been clicked (the target), then builds a block to place on top of it.
function attachBlock(position, blockSize) {
	blockID = 'block-' + blockTick;
	blockTick++;
//	bbox = voxelBBox(position);
	bbox = targetElement.getBBox();
	color = 'bla';
//	offset = voxelBBox(position.x + axis.x, position.x + axis.y, position.z + axis.z - 1);
	blockBlank = makeObject(bbox, blockSize); //offset.x, offset.y);
	block = setColor(blockBlank, color);
	block.setAttributeNS(null, 'id', blockID);
//	block.setAttributeNS(null, 'block-color', color);
//	blockOrder(target, block);
	SVGRoot.appendChild(block);
	voxelCoordinates = blockRecord(blockID, position);
//	loggit('Block placed on the grid at ' + voxelCoordinates.x + ', ' + voxelCoordinates.y);
}

function drawBlocks(commonVars) {
	for (var i = 0; i < Field.length; i++) {
		var block = Field[i];
		
		var location = {
			x: block[0],
			y: block[1],
			z: block[2]
		}
		
		var gridPosition = block[0] * commonVars.gridDims.c + block[1];
		var coors = GridField["x-" + gridPosition].coors;
		
		canvasBlock(coors, location, commonVars, colorBlock(block[3], commonVars));
	}
}