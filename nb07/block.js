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
	else {
		canvas = 'blocks';
	}
	
	var ctx = context(canvas);
	
	ctx.globalAlpha = 1;
	if (settings.stroke !== false) {
		ctx.strokeStyle = settings.stroke;
	}
	if (settings.fill !== false) {
		ctx.fillStyle = settings.fill;
	}
	
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
		ctx.stroke();
	}
	if (settings.fill !== false) {
		ctx.fill();
	}
}

// colorBlock is used to turn the color index into a color object (with separate color values for each face as well as its lines).
// It basically takes this color index and corresponds it to an RGB value held in the color palette in $C.
// Later a better system for handling color must be designed.
function colorBlock (colorID) {
	var color = $C.palette[colorID];
	var colorR = color[0];
	var colorG = color[1];
	var colorB = color[2];
	var colorLeft = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
	var colorRight = "rgb(" + (colorR + 20) + ", " + (colorG + 20) + ", " + (colorB + 20) + ")";
	var colorTop = "rgb(" + (colorR + 40) + ", " + (colorG + 40) + ", " + (colorB + 40) + ")";
	var colorLines = "rgb(" + (colorR -20) + ", " + (colorG - 20) + ", " + (colorB - 20) + ")";
	
	return {left: colorLeft, right: colorRight, top: colorTop, inset: colorLines};
}

function colorBlockNew (color) {
	var blockColors = {};
	
	blockColors.left = "rgb(" + (color.r - 20) + ", " + (color.g - 20) + ", " + (color.b - 20) + ")";
	blockColors.right = "rgb(" + (color.r - 10) + ", " + (color.g - 10) + ", " + (color.b - 10) + ")";
	blockColors.top = "rgb(" + (color.r) + ", " + (color.g) + ", " + (color.b) + ")";
	blockColors.inset = "rgb(" + (color.r - 30) + ", " + (color.g - 30) + ", " + (color.b - 30) + ")";

	return blockColors;
	// return {left: colorLeft, right: colorRight, top: colorTop, inset: colorLines};
}

// Paints a block on the board with proper color and occlusion.
// Takes coors x/y for position, xyz location on the grid, $C, and the color object of the block.
// A color id can be converted into a color object using the colorBlock function.
function canvasBlock (position, location, color) {
	var adjustedPosition = {x: position.x, y: position.y - $C.blockSize.half * (location.z + 1)};
	
	if ($C.swatchActive) {
		Arr = SwatchGhost;
	}
	else {
		Arr = Voxel;
	}
	
	// Top side. Always placed, unless there's a block above it.
	if (Arr[location.x][location.y][location.z + 1] == -1) {
		canvasDrawSet([1, 6, 7, 2], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
	}
	
	// Left side.
	if (Arr[location.x - 1][location.y][location.z] == -1
			&& Arr[location.x - 1][location.y + 1][location.z] == -1) {
		canvasDrawSet([6, 7, 4, 5], adjustedPosition, {closed: true, fill: color.left, stroke: color.inset});
	} else if (Arr[location.x - 1][location.y + 1][location.z] != -1
			&& Arr[location.x - 1][location.y][location.z] == -1) {
		canvasDrawSet([6, 7, 5], adjustedPosition, {closed: true, fill: color.left, stroke: color.inset});
	}
	
	// Right side.
	if (Arr[location.x][location.y + 1][location.z] == -1
			&& Arr[location.x - 1][location.y + 1][location.z] == -1) {
		canvasDrawSet([2, 7, 4, 3], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
	} else if (Arr[location.x - 1][location.y + 1][location.z] != -1
			&& Arr[location.x][location.y + 1][location.z] == -1) {
		canvasDrawSet([2, 7, 3], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
	}
}

// Calls canvasBlock to place a block on the grid.
function placeBlock (target) {
	// Make location object.
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: $C.layerOffset.z
	}
	
	// If the same block already exists at the location being painted, don't paint over it again.
	if (Voxel[location.x][location.y][location.z] != $C.selected.color) {
		// Draw the actual block using coordinates using the location of the grid's tiles as a reference for pixel-placement for all the rest of the blocks (this is the first argument). The target.id should look something like "x-123".
		// colorBlock is used to turn the color index into a color object (with separate color values for each face as well as its lines)
		canvasBlock(GridField[target.id].coors, location, colorBlock($C.selected.color));
	
		// Now record information about the position of the block internally using both the Voxel array...
		Voxel[location.x][location.y][location.z] = $C.selected.color;
		// ...and the Field array, which is for serialization.
		Field.push([location.x, location.y, location.z, $C.selected.color]);
	
		// Let the user know they've placed a block.
		loggit("A " + $C.palette[$C.selected.color][3] + " block placed at " + location.x + ", " + location.y + ", " + location.z + ".")
	
		// Redraw the display so that this change shows up immediately.
		$C.posInd.redraw();
	}
	else {
		loggit("Same block already exists at location.");
	}
}

function removeBlock (target) {
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: 0 + $C.layerOffset.z // forgot why I put a zero here.
	}
	
	Voxel[location.x][location.y][location.z] = -1;
	popField(location.x, location.y, location.z);
	
	$C.posInd.clearBlocks();
	drawAllBlocks();
	// canvasBlockRemove(GridField[target.id].coors, location);
	$C.posInd.redraw();
	
	loggit("The block placed at " + location.x + ", " + location.y + ", " + location.z + " was removed.");
}

function drawAllBlocks () {
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	var gridPosition = 0;
	var coors = new Object();
	
	for (var i = 0; i < Field.length; i++) {
		location = {x: Field[i][0], y: Field[i][1], z: Field[i][2]};
		gridPosition = location.x * $C.gridDims.c + location.y;
		coors = GridField["x-" + gridPosition].coors;
		color = colorBlock(Field[i][3]);
		canvasBlock(coors, location, color);
	}
	
/*	for (var x = 0; x < $C.gridDims.r; x++) {
		Voxel[x] = new Array();
		for (var y = 0; y < $C.gridDims.r; y++) {
		Voxel[x][y] = new Array();
			for (var z = 0; z < 32; z++) {
				if (Voxel[x][y][z] != -1) {
					location = {x: x, y: y, z: z};
				
					gridPosition = x * $C.gridDims.c + y;

					coors = GridField["x-" + gridPosition].coors;
					
					console.log(Voxel[x][y][z]);
					
					color = colorBlock(Voxel[x][y][z]);
				
					canvasBlock(coors, location, color);
				}
			}
		}
	}*/
}

function popField(x, y, z) {
	for (var i = 0; i < Field.length; i++) {
		// console.log(i);
		if (Field[i][0] == x && Field[i][1] == y && Field[i][2] == z) {
			Field.splice(i, 1);
			break;
		}
	}
}

/*
function canvasBlockRemove (position, location) {
	var adjustedPosition = {x: position.x, y: position.y - $C.blockSize.half * (location.z + 1)};
	
	var color = {left: "#eee", right: "#eee", top: "#eee", inset: "#aaa"};
	
	// Don't remove if in the "middle of nowhere".
	if (Voxel[location.x][location.y][location.z] != -1 && Voxel[location.x][location.y][location.z] != -1 && Voxel[location.x][location.y][location.z] != -1) {
		// Top side.
		if (Voxel[location.x][location.y + 1][location.z] != -1 && Voxel[location.x - 1][location.y][location.z] != -1) {
			canvasDrawSet([1, 2, 7, 6], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
		}
		else if (Voxel[location.x][location.y + 1][location.z] != -1 && Voxel[location.x - 1][location.y][location.z] != -1) {
			canvasDrawSet([1, 2, 7, 6], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
		}
	
		// Left side.
		if (Voxel[location.x][location.y - 1][location.z] == -1 && Voxel[location.x + 1][location.y - 1][location.z] == -1) {
			canvasDrawSet([6, 7, 5], adjustedPosition, {closed: false, fill: color.top, stroke: color.inset});
		}
		else if (Voxel[location.x][location.y - 1][location.z] == -1) {
			canvasDrawSet([1, 7, 5, 6], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
		}
	
		// Right side.
		if (Voxel[location.x + 1][location.y][location.z] == -1 && Voxel[location.x][location.y + 1][location.z] == -1) {
			canvasDrawSet([1, 2, 7], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
		}
		else if (Voxel[location.x + 1][location.y][location.z] == -1) {
			canvasDrawSet([1, 2, 3, 7], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
		}
	
		// Bottom side. Same color as the top of the block below it, or, if on the bottom, default colors.
		// Don't draw if there are blocks in front.
		if (Voxel[location.x - 1][location.y][location.z] != -1 && Voxel[location.x][location.y + 1][location.z] == -1) {
			canvasDrawSet([7, 3, 4], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
		}
		else if (Voxel[location.x][location.y + 1][location.z] == -1 && Voxel[location.x - 1][location.y][location.z] == -1) {
			canvasDrawSet([7, 3, 4, 5], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
		}
		// }
	
		// Corrective Top side. (uses color from the block behind or underneath)
	
		// Corrective Left.
		if (Voxel[location.x][location.y - 1][location.z] != -1) {
			var color = colorBlock(Voxel[location.x][location.y - 1][location.z]);
			canvasDrawSet([1, 7, 5, 6], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
		}
	
		// Corrective Right side.
		if (Voxel[location.x + 1][location.y][location.z] != -1 && Voxel[location.x][location.y + 1][location.z] != -1) {
			var color = colorBlock(Voxel[location.x + 1][location.y][location.z]);
			canvasDrawSet([1, 2, 7], adjustedPosition, {closed: true, fill: color.left, stroke: color.inset});
		}
		
		else if (Voxel[location.x + 1][location.y][location.z] != -1) {
			var color = colorBlock(Voxel[location.x + 1][location.y][location.z]);
			canvasDrawSet([1, 2, 3, 7], adjustedPosition, {closed: true, fill: color.left, stroke: color.inset});
		}
	
		// Corrective Bottom side.
		
		loggit("The block placed at " + location.x + ", " + location.y + ", " + location.z + " was removed.")
	}
	else {
		loggit("Nothing removed.");
	}
}*/