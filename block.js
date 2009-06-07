//	Copyright 2009 Alex Trujillo
//	Full source available here under the MIT License: http://code.google.com/p/nanoblok/

//	SUMMARY	
//	drawBlock.js creates the characteristic nanoblok blocks from scratch, using hexagonal
//	proportions. It will then update the coordinates with the current matrix transformation,
//	set the block's colors, and attach the block to the document.

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
var svgNS = 'http://www.w3.org/2000/svg';

// General iso / block proportions
var sc1 = 50;
var sc2 = sc1 / 2;
var sc4 = sc1 / 4;
var sc3 = sc2 + sc4;

// Draws hexagonal points in iso perspective, based on hard coordinate and size of block. Depends on an orientation array (see block-grid.png in Nanoblok Extras). Returns static coordinates of where to draw blocks on the screen.
function hexiso (pos_x, pos_y) {
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

// Creates the various coordinates necessary to make an isometric block
// from the coordinates provided by hexiso().
function makeBlock (posX, posY) {
	var coorSet = hexiso(posX, posY);
	
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
	obj.right.setAttributeNS(null, "fill", colorRight);
	obj.top.setAttributeNS(null, "fill", colorTop);
	obj.inset1.setAttributeNS(null, "stroke", colorLines);
	obj.inset1.setAttributeNS(null, "fill", "none");
	obj.inset2.setAttributeNS(null, "stroke", colorLines);
	obj.outline.setAttributeNS(null, "stroke", "#444");
	obj.outline.setAttributeNS(null, "fill", "none");
	
	var group = makeGroup(obj);

	group.setAttributeNS(null, "stroke-width", 2);
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

// Finds the bounding box of the specific target
function attachBlock(target, color, id, type) {
	targetElement = target; // document.getElementById(target);
	bbox = targetElement.getBBox();
	blockBlank = makeBlock((bbox.x + 6), (bbox.y - 22))
	block = setColor(blockBlank, color);
	block.setAttributeNS(null, "id", "block" + id);
	block.setAttributeNS(null, 'block-color', color);
	SVGRoot.appendChild(block);
	blockRecord(target, color, id, type);
}