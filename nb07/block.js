/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
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
function canvasDrawSet (hexSet, offset, settings) {
	var canvas = null;
	
	if (settings.grid) {
		canvas = 'grids';
	}
	else if ($C.swatchActive) {
		canvas = 'colors';
	}
	else if ($C.selection.enabled) {
		canvas = 'selection';
	}
	else {
		canvas = 'blocks';
	}
	
	var ctx = context(canvas);
	
	ctx.globalAlpha = 1.0;
	
	var hexSpot = hexSet.pop();
	var coorSet = hexiso(offset, $C.blockSize);
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
	
	if (settings.stroke !== false) {
		ctx.strokeStyle = settings.stroke;
		ctx.stroke();
	}
	if (settings.fill !== false) {
		ctx.fillStyle = settings.fill;
		ctx.fill();
	}
}

// colorBlock uses a color object (with separate color values for each face as well as its lines) to provide different shading for block faces.

var cubeShift = {a: -20, b: -10, c: 0, d: -30};
var blokShift = {a: -40, b: -20, c: 0, d: -60};

function colorBlockNew (color) {
	var blockColors = new Object();
	var shift;
	
	if ($C.swatchActive) {
		shift = cubeShift;
	}
	else {
		shift = blokShift;
	}
	
	blockColors.left = "rgb(" + smartShift(color.r, shift.a) + ", " + smartShift(color.g, shift.a) + ", " + smartShift(color.b, shift.a) + ")";
	blockColors.right = "rgb(" + smartShift(color.r, shift.b) + ", " + smartShift(color.g, shift.b) + ", " + smartShift(color.b, shift.b) + ")";
	blockColors.top = "rgb(" + smartShift(color.r, shift.c) + ", " + smartShift(color.g, shift.c) + ", " + smartShift(color.b, shift.c) + ")";
	blockColors.inset = "rgb(" + smartShift(color.r, shift.d) + ", " + smartShift(color.g, shift.d) + ", " + smartShift(color.b, shift.d) + ")";
	
	return blockColors;
}

function smartShift (color, shift) {
	if (color + shift < 0) {
		// For dark black.
		var shifted = color - shift;
	}
	else if (color + shift > 255) {
		// For light white.
		var shifted = Math.min(color + shift, 255);
	}
	else {
		// And everything inbetween.
		var shifted = color + shift;
	}
	
	return shifted;
}

// Paints a block on the board with proper color and occlusion.
// Takes coors x/y for position, xyz location on the grid, $C, and the color object of the block.
// A color id can be converted into a color object using the colorBlock function.
function canvasBlockOld (position, location, color) {
	var adjustedPosition = {x: position.x, y: position.y - $C.blockSize.half * (location.z + 1)};
	
	// Switch between color cube and block on the grid.
	if ($C.swatchActive) {
		Arr = SwatchGhost;
	}
	else {
		Arr = Voxel;
	}
	/*
	var top = false;
	
	for (var i = location.z, ii = 0; i > ii; i--) {
		if (Arr[location.x][location.y][i] == null) {
			top = true;
		}
		else {
			top = false;
			break;
		}
	}*/
	
	if (Arr[location.x][location.y][location.z + 1] == null) { // && top) {
		canvasDrawSet([1, 6, 7, 2], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
	}
	// Always draw top if block above it is invisible.
	else {
		if (!$C.swatchActive) {
			if (!FieldVisible[Voxel[location.x][location.y][location.z + 1]]) {
				canvasDrawSet([1, 6, 7, 2], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
			}
		}
	}
	
	// Left side.
	if (Arr[location.x - 1][location.y][location.z] == null && Arr[location.x - 1][location.y + 1][location.z] == null) {
		canvasDrawSet([6, 7, 4, 5], adjustedPosition, {closed: true, fill: color.left, stroke: color.inset});
	} else if (Arr[location.x - 1][location.y + 1][location.z] != null && Arr[location.x - 1][location.y][location.z] == null) {
		canvasDrawSet([6, 7, 5], adjustedPosition, {closed: true, fill: color.left, stroke: color.inset});
	}
	
	// Right side.
	if (Arr[location.x][location.y + 1][location.z] == null && Arr[location.x - 1][location.y + 1][location.z] == null) {
		canvasDrawSet([2, 7, 4, 3], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
	} else if (Arr[location.x - 1][location.y + 1][location.z] != null && Arr[location.x][location.y + 1][location.z] == null) {
		canvasDrawSet([2, 7, 3], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
	}
}

var count = 0;
var blockMask = [];

function canvasBlock (position, location, color) {
	if ($C.swatchActive) {
		Arr = SwatchGhost;
	}
	else {
		Arr = Voxel;
	}
	count = 0;
//	var screenLoc = {x: 0, y: 31 - location.y, z: 31 - location.z};
	
	var x = 31-location.x;
	var y = location.y;
	var z = location.z;
	var zz = 0;
	
/*	while (x > 0 && y > 0 && z > 0) {
		x--;
		y--;
		z--;
		zz++;
	}*/
	zz = 0;
	while (x < 31 && y < 31 && z < 31) {
		x++;
		y++;
		z++;
		zz++;
	}
	
/*	if (location.x < 15 || location.y < 15) {
		var screenLoc = {x: 0, y: location.y, z: z};
	}
	else {
		var screenLoc = {x: location.x, y: 31, z: z};
	}*/
	
	var screenLoc = {x: location.x, y: location.y, z: z};
	
	// var adjustedPosition = {
	// 	x: $C.blockSize.half * location.x + $C.blockSize.half * location.y,
	// 	y: $C.blockSize.quarter * location.y - $C.blockSize.quarter * location.x + $C.gridSize.y / 2 + $C.center.y - $C.blockSize.half * (location.z) + $C.blockSize.full
	// };
	// canvasDrawSet([1, 2, 3, 4, 5, 6], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
	
	var adjustedPosition = {
		x: $C.blockSize.half * location.x + $C.blockSize.half * location.y,
		y: $C.blockSize.quarter * location.y
		- $C.blockSize.quarter * location.x
		+ $C.gridSize.y / 2 + $C.center.y
		- $C.blockSize.half * (location.z)
		+ $C.blockSize.full
	};
	
	var hash = pixelhash(adjustedPosition.x, adjustedPosition.y)
	
	if (blockMask[hash] == undefined){
		blockMask[hash] = true;
		count++;
		compareLoc(location, canvasBlockRay(screenLoc, adjustedPosition, color, Arr));
	}
	// else {
	// 		blockMask[hash] = true;
	// 	}
	
	
	
	// console.log(z + "z, run " + count);	
}

function canvasBlockRay (location, adjustedPosition, color, arr) {
/*	var adjustedPosition = {
		x: $C.blockSize.half * location.x + $C.blockSize.half * location.y,
		y: $C.blockSize.quarter * location.y
		- $C.blockSize.quarter * location.x
		+ $C.gridSize.y / 2 + $C.center.y
		- $C.blockSize.half * (location.z)
		+ $C.blockSize.full
	};*/
	
	canvasDrawSet([1, 2, 3, 4, 5, 6], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
//	count++;
	// if (!$C.swatchActive) {
	// 	console.log(location);
	// }
	
	if (location.z <= 0) {
		return null;
	}
/*	else if (//arr[location.x] != null 
	//	&& arr[location.x][location.y] !=null 
		arr[location.x][location.y][location.z] != null
	) {
		var adjustedPosition = {
			x: $C.blockSize.half * location.x + $C.blockSize.half * location.y,
			y: $C.blockSize.quarter * location.y - $C.blockSize.quarter * location.x + $C.gridSize.y / 2 + $C.center.y - $C.blockSize.half * (location.z) + $C.blockSize.full
		};
		canvasDrawSet([1, 2, 3, 4, 5, 6], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
		return location;
	}*/
	else {
		location.x++;
		location.y--;
		location.z--;
	//	canvasDrawSet([1, 2, 3, 4, 5, 6], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
		return canvasBlockRay (location, adjustedPosition, color, arr);
	}
}

function compareLoc (loc1, loc2) {
	if (loc1 == null || loc2 == null) {
		return false;
	}
	else if (loc1.x == loc2.x && loc1.y == loc2.y && loc1.z == loc2.z) {
		return true;
	}
	else {
		return false;
	}
}

// NxN -> N / dovetailing / cantor pairing function.
function pixelhash (k1, k2) {
	return 1 / 2 * (k1, k2) * (k1 + k2 + 1) + k2;
}

// This gathers necessary information for block placement, and determines whether the block should actually be placed.
function placeBlock (target) {
	// Make location object.
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: $C.layerOffset.z
	}
	
	// If the same block already exists at the location being painted, don't paint over it again.
	if (Voxel[location.x][location.y][location.z] != null) {
		if (Field[Voxel[location.x][location.y][location.z]][3] != $C.selected.color) {
			placeBlockDraw(target, location);
		}
		else {
			loggit("Same block already exists at " + location.x + ", " + location.y + ", " + location.z +".");
		}
	}
	else {
		placeBlockDraw(target, location);
	}
}

// Here is all the actual functionality required for placing the block, where it calls canvasBlock to place a block on the grid.
function placeBlockDraw (target, location) {
	// Draw the actual block using coordinates using the location of the grid's tiles as a reference for pixel-placement for all the rest of the blocks (this is the first argument). The target.id should look something like "x-123".
	// colorBlock is used to turn the color index into a color object (with separate color values for each face as well as its lines)
	canvasBlock(GridField[target.id].coors, location, colorBlockNew(SwatchField[$C.selected.color][3]));

	// Record information in the Field array, which is for serialization.
	Field.push([location.x, location.y, location.z, $C.selected.color]);
	FieldVisible.push(true);
	// As well as the Field index of the block internally using the Voxel array.
	Voxel[location.x][location.y][location.z] = Field.length - 1;

	// Let the user know they've placed a block.
	loggit("Block placed at " + location.x + ", " + location.y + ", " + location.z + ".")

	// Redraw the display so that this change shows up immediately.
	$C.posInd.redraw();
}

function removeBlock (target) {
	var time0 = new Date();
	
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: 0 + $C.layerOffset.z // forgot why I put a zero here.
	}
	
	if (Voxel[location.x][location.y][location.z] != null) {
		Voxel[location.x][location.y][location.z] = null;
		popField(location.x, location.y, location.z);
	
		$C.posInd.clearBlocks();
		drawAllBlocks();
		$C.posInd.redraw();
	
		var time1 = new Date();
		loggit("The block at " + location.x + ", " + location.y + ", " + location.z + " was removed in " + (time1 - time0) + " ms.");
	}
	else {
		loggit("Nothing to remove.");
	}
}

function drawAllBlocks () {
	var t0 = new Date();
	
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	var gridPosition = 0;
	var coors = new Object();
	
	// Clear out the blockMask hash table.
	blockMask = [];
	
	for (var i = 0, ii = Field.length; i < ii; i++) {
		if (FieldVisible[i]) {
			location = {x: Field[i][0], y: Field[i][1], z: Field[i][2]};
			gridPosition = location.x * $C.gridDims.c + location.y;
			coors = GridField["x-" + gridPosition].coors;
			color = colorBlockNew(SwatchField[Field[i][3]][3]);
			canvasBlock(coors, location, color);
		}
	}
	
	var t1 = new Date();
	console.log("All blocks drawn in " + (t1 - t0) + "ms.")
}

function popField(x, y, z) {
	for (var i = 0, ii = Field.length; i < ii; i++) {
		// console.log(i);
		if (Field[i][0] == x && Field[i][1] == y && Field[i][2] == z) {
			Field.splice(i, 1);
			FieldVisible.splice(i, 1);
			break;
		}
	}
}

// Rebuilds the entire model scene from a field gotten from the server.
function rebuild () {
	initVoxels(Voxel);
	
	for (var i = 0, ii = Field.length; i < ii; i++) {
		Voxel[Field[i][0]][Field[i][1]][Field[i][2]] = i;
		FieldVisible.push(true);
	}
	
	$C.posInd.clearBlocks();
	drawAllBlocks();
	$C.posInd.redraw();
	pixelRender(iso(expand(Field)));
}

/* // Experiment. Can be removed, but good for posterity.
function blockRender () {
	var ctx = context('selection');
	ctx.fillStyle = 'black';
	
	loggit('blockRender?')
	var t0 = new Date();
	
	var toggle = true;
	
	for (var px = $C.blockSize.quarter, pxx = $C.gridSize.x; px < pxx; px += $C.blockSize.half) {
		for (var py = $C.blockSize.quarter, pyy = $C.gridSize.fullY; py < pyy; py += $C.blockSize.quarter) {
			if (px > $C.gridSize.x / 2 - py * 2 // Top Left
				&&	$C.gridSize.x - px > $C.gridSize.x / 2 - py * 2 // Top Right
				&&	$C.gridSize.x / 4 - px / 2 < $C.gridSize.x - py // Lower Left
				&&	px / 2 < $C.gridSize.x * 1.25 - py // Lower Right
				&&	toggle // Y-axis
			) {
				ctx.fillRect(px, py, 2, 2);
				toggle = false;
			}
			else {
				toggle = true;
			}
		}
	}
	
	$C.posInd.redraw();
	
	var t1 = new Date();
	
	loggit('blockRender in ' + (t1 - t0) + 'ms!');
}
*/