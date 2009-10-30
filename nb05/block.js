/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for block.js:
 * This file holds outdated SVG-based block rendering code. This stores data in the DOM, which uses more resources and is slower.
 * Soon to be deprecated.
 */

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

// A very useful function to draw a set of coordinates in a hexagonal setup at a certain offset.
// Very necessary for an isometric setup such as this.
function canvasDrawSet (hexSet, offset, commonVars, settings) {
	var ctx = context('effects');
	ctx.globalAlpha = 1;
	ctx.strokeStyle = settings.stroke;
	if (settings.fill !== false) {
		ctx.fillStyle = settings.fill;
	}
	
	var hexSpot = hexSet.pop();
	var coorSet = hexiso(offset, commonVars.blockSize);
	var offsY = -35;
	
	ctx.beginPath();
	ctx.moveTo(coorSet.x[hexSpot], coorSet.y[hexSpot] + offsY);
	
	var i = 0;

	while (i < hexSet.length || i == 7) {
		hexSpot = hexSet.pop();
		ctx.lineTo(coorSet.x[hexSpot], coorSet.y[hexSpot] + offsY);
		i = i++;
	}
	
	if (settings.closed) {
		ctx.closePath();
	}
	
	ctx.stroke();
	if (settings.fill !== false) {
		ctx.fill();
	}
}

// colorBlock is used to turn the color index into a color object (with separate color values for each face as well as its lines).
// It basically takes this color index and corresponds it to an RGB value held in the color palette in commonVars.
// Later a better system for handling color must be designed.
function colorBlock (colorID, commonVars) {
	var color = commonVars.palette[colorID];
	var colorR = color[0];
	var colorG = color[1];
	var colorB = color[2];
	var colorLeft = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
	var colorRight = "rgb(" + (colorR + 20) + ", " + (colorG + 20) + ", " + (colorB + 20) + ")";
	var colorTop = "rgb(" + (colorR + 40) + ", " + (colorG + 40) + ", " + (colorB + 40) + ")";
	var colorLines = "rgb(" + (colorR + 50) + ", " + (colorG + 50) + ", " + (colorB + 50) + ")";
	
	return {left: colorLeft, right: colorRight, top: colorTop, inset: colorLines};
}

// Paints a block on the board with proper color and occlusion.
// Takes coors x/y for position, xyz location on the grid, commonVars, and the color object of the block.
// A color id can be converted into a color object using the colorBlock function.
function canvasBlock (position, location, commonVars, color) {
	var adjustedPosition = {x: position.x, y: position.y - commonVars.blockSize.half * (location.z + 1)};
	
	// Top side. Always placed.
	canvasDrawSet([1, 6, 7, 2], adjustedPosition, commonVars, {closed: true, fill: color.top, stroke: color.inset});
	
	// Left side.
	if (Voxel[location.x - 1][location.y][commonVars.layerOffset.z] == -1
			&& Voxel[location.x - 1][location.y + 1][commonVars.layerOffset.z] == -1) {
		canvasDrawSet([6, 7, 4, 5], adjustedPosition, commonVars, {closed: true, fill: color.left, stroke: color.inset});
	} else if (Voxel[location.x - 1][location.y + 1][commonVars.layerOffset.z] != -1
			&& Voxel[location.x - 1][location.y][commonVars.layerOffset.z] == -1) {
		canvasDrawSet([6, 7, 5], adjustedPosition, commonVars, {closed: true, fill: color.left, stroke: color.inset});
	}
	
	// Right side.
	if (Voxel[location.x][location.y + 1][commonVars.layerOffset.z] == -1
			&& Voxel[location.x - 1][location.y + 1][commonVars.layerOffset.z] == -1) {
		canvasDrawSet([2, 7, 4, 3], adjustedPosition, commonVars, {closed: true, fill: color.left, stroke: color.inset});
	} else if (Voxel[location.x - 1][location.y + 1][commonVars.layerOffset.z] != -1
			&& Voxel[location.x][location.y + 1][commonVars.layerOffset.z] == -1) {
		canvasDrawSet([2, 7, 3], adjustedPosition, commonVars, {closed: true, fill: color.left, stroke: color.inset});
	}
}

// Calls canvasBlock to place a block on the grid.
function placeBlock (target, commonVars) {
	// Get 
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: commonVars.layerOffset.z
	}

	// Draw the actual block using coordinates using the location of the grid's tiles as a reference for pixel-placement for all the rest of the blocks (this is the first argument). The target.id should look something like "x-123".
	// colorBlock is used to turn the color index into a color object (with separate color values for each face as well as its lines)
	canvasBlock(GridField[target.id].coors, location, commonVars, colorBlock(commonVars.selected.color, commonVars));
	
	// Now record information about the position of the block internally using both the Voxel array...
	Voxel[location.x][location.y][location.z] = commonVars.selected.color;
	// ...and the Field array, which is for serialization.
	Field.push([location.x, location.y, location.z, commonVars.selected.color]);
	
	// Let the user know they've placed a block.
	loggit("A " + commonVars.palette[commonVars.selected.color][3] + " block placed at " + location.x + ", " + location.y + ", " + location.z + ".")
}

// WTF is this. >:I
function deleteBlock (target, commonVars) {
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: 0 + commonVars.layerOffset.z
	}
	
	canvasBlockDelete(GridField[target.id].coors, location, commonVars);
	Voxel[location.x][location.y][location.z] = -1;
	loggit(" The block placed at " + location.x + ", " + location.y + ", " + location.z + " was deleted.")
}

// WTF is this. >:I
function canvasBlockDelete () {
	var color = {left: "#eee", right: "#eee", top: "#eee", inset: "#aaa"};
	
	// Top side. Always placed.
	canvasDrawSet([1, 6, 7, 2], adjustedPosition, commonVars, {closed: true, fill: color.top, stroke: color.inset});

	// Left side.
	if (Voxel[location.x - 1][location.y][commonVars.layerOffset.z] == -1
			&& Voxel[location.x - 1][location.y + 1][commonVars.layerOffset.z] == -1) {
		canvasDrawSet([6, 7, 4, 5], adjustedPosition, commonVars, {closed: true, fill: color.left, stroke: color.inset});
	} else if (Voxel[location.x - 1][location.y + 1][commonVars.layerOffset.z] != -1
			&& Voxel[location.x - 1][location.y][commonVars.layerOffset.z] == -1) {
		canvasDrawSet([6, 7, 5], adjustedPosition, commonVars, {closed: true, fill: color.left, stroke: color.inset});
	}

	// Right side.
	if (Voxel[location.x][location.y + 1][commonVars.layerOffset.z] == -1
			&& Voxel[location.x - 1][location.y + 1][commonVars.layerOffset.z] == -1) {
		canvasDrawSet([2, 7, 4, 3], adjustedPosition, commonVars, {closed: true, fill: color.left, stroke: color.inset});
	} else if (Voxel[location.x - 1][location.y + 1][commonVars.layerOffset.z] != -1
			&& Voxel[location.x][location.y + 1][commonVars.layerOffset.z] == -1) {
		canvasDrawSet([2, 7, 3], adjustedPosition, commonVars, {closed: true, fill: color.left, stroke: color.inset});
	}
}