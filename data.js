//	Copyright 2009 Alex Trujillo
//	Full source available here under the MIT License: http://code.google.com/p/nanoblok/
	
//	SUMMARY
//	data.js handles data inside the program, such as the positions and IDs of blocks.

// Is very similar to the PHP function of the same name
function array_search (array, val, target) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][target] == val) {
			return i;
		}
	}
	return false;
}
	
// Field is short for Playfield, and each element contains 5 values; X, Y, Z, color, and functionality.
var Field = new Array();
//Field.length = 0;

// Voxels are volumetric pixels, 3D coordinates. This keeps track of those in order to speed up spatial determinations, such as if a block is close by to another block.
var Voxel = new Array();

// The primary, generic function to intelligently record the position and state of all objects blockular in nature. 
function blockRecord(target, color, id, type) {
	var blockX = 0;
	var blockY = 0;
	var blockZ = 0;
	var blockColor = color;
	var blockID = id;
	
	if (type == 'grid') {
		var gridcoors = findGridXY(target);
		blockX = gridcoors.x;
		blockY = gridcoors.y;
		blockZ = 0;
	}
	
	var blockAttributes = new Array(blockID, blockX, blockY, blockZ, blockColor);
	
	// Register the block with the Field, but make sure a block of that ID isn't already there first.
	targetIndex = array_search(Field, target.id, 0);
	
	if (typeof(Field[targetIndex]) == 'undefined') {
		Field.push(blockAttributes);
	} else if (Field[targetIndex] == false){
		Field[targetIndex] = blockAttributes;
	} else {
		Field[targetIndex] = blockAttributes;
	}
	
	// Add new voxel position
	VoxArray(blockX, blockY, blockZ, blockID);
}

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

// Find grid coordinates from the sequence number from the individual grid cell.
function findGridXY(gridTarget) {
	// Number ID of the grid element, longer for initial color names
	var gridnum = parseInt(gridTarget.id.substr(7, 20));
	
	var gridCoordinates = new Object;
	gridCoordinates.x = Math.floor(gridnum / 16);
	gridCoordinates.y = gridnum % 16;
	
	return gridCoordinates;
}
/*
// Adds object to grid, plus some draw order logic (to keep visual perspective sane). It's also stupidly complex, and there might be a better way.
function blockOrder (target, block) {
	// Find grid coordinates (x,y)
	var coor = findGridXY(target);

	// If the block northeast of the current block is present, place behind (before it on the node hierarchy)
	// However, before we do that, this variable will keep the second statement from being executed if they're both satisfied.
	gojo = true; // Don't ask me about the name. I couldn't think of a better one. Great way to get your hands clean, though.
	// If the block northeast of the current block is present, place behind (before it on the node hierarchy)
	// Take note, the origin of the X axis is southeast, and the Y axis origin is southwest.
	if (Voxel[(coor.x - 1)] !== undefined) {
		if (Voxel[(coor.x - 1)][coor.y] !== undefined) {
			if (Voxel[(coor.x - 1)][coor.y][0] !== undefined) {
				var blockEast = Voxel[(coor.x - 1)][coor.y][0];
				SVGRoot.insertBefore(block, document.getElementById(blockEast));
				gojo = false;
				loggit('Block placed at ' + coor.x + ', ' + coor.y + ', ' + 0 + ', behind ' + blockEast);
			}
		}
	// If the block northwest of the current block is present, place behind (before it on the node hierarchy)
	} else if (Voxel[coor.x] !== undefined) {
		if (Voxel[coor.x][(coor.y + 1)] !== undefined) {
			if (Voxel[coor.x][(coor.y + 1)][0] !== undefined && Voxel[coor.x][(coor.y + 1)][0] !== block.id && gojo == true) {
				var blockNorth = Voxel[coor.x][(coor.y + 1)][0];
				SVGRoot.insertBefore(block, document.getElementById(blockNorth));
				gojo = false;
				loggit(block.id + ' placed at ' + coor.x + ', ' + coor.y + ', ' + 0 + ', behind ' + blockNorth);
			}
		}
	} else if (Voxel[coor.x - 1] !== undefined && Voxel[coor.x] !== undefined) {
		if (Voxel[(coor.x - 1)][coor.y] !== undefined && Voxel[coor.x][(coor.y + 1)] !== undefined) {
			if (Voxel[(coor.x - 1)][coor.y][0] !== undefined && Voxel[coor.x][(coor.y + 1)][0] !== undefined && Voxel[coor.x][(coor.y + 1)][0] !== block.id && gojo == true) {
				var blockNorth = Voxel[coor.x][(coor.y + 1)][0];
				SVGRoot.insertBefore(block, document.getElementById(blockNorth));
				var blockEast = Voxel[(coor.x - 1)][coor.y][0];
				SVGRoot.insertBefore(block, document.getElementById(blockEast));
				loggit(block.id + ' placed at ' + coor.x + ', ' + coor.y + ', ' + 0 + ', behind ' + blockNorth + ' and ' + blockEast);
			}
		}
	// If placed in order, append the block as normal
	} else {
		SVGRoot.appendChild(block);
		loggit(block.id + ' placed at ' + coor.x + ', ' + coor.y + ', ' + 0 + '.');
	}
}
*/

function detection(target) {
	
}

// Detects neighboring blocks based on a target position, and returns their ids.
function neighbor(target) {
	// Additional undefined id logic for when the player places a block on the grid.
	// This doesn't apply for z-axis voxels.
	
	
	if (direction == 'x+') {
		id = Voxel[target.x + 1][target.y][target.z];
		if (id == undefined || id == false) {
			id = Voxel[target.x + 1][target.y][target.z - 1];
		}
	} else if (direction == 'x-') {
		id = Voxel[target.x - 1][target.y][target.z];
		if (id == undefined || id == false) {
			id = Voxel[target.x - 1][target.y][target.z - 1];
		}
	} else if (direction == 'y+') {
		id = Voxel[target.x][target.y + 1][target.z];
		if (id == undefined || id == false) {
			id = Voxel[target.x][target.y + 1][target.z - 1];
		}
	} else if (direction == 'y-') {
		id = Voxel[target.x][target.y - 1][target.z];
		if (id == undefined || id == false) {
			id = Voxel[target.x][target.y - 1][target.z - 1];
		}
	} else if (direction == 'z+') {
		id = Voxel[target.x][target.y][target.z + 1];
	} else if (direction == 'z-') {
		id = Voxel[target.x][target.y][target.z - 1];
	}
	
	// Return the object if it exists, otherwise, log an error.
	if (id !== undefined) {
		return id;
	} else {
		loggit('neighbor function error');
	}
}