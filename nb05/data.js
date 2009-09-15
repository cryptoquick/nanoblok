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
var Field = new Object();
//Field.length = 0;

var GridField = new Object();

// Voxels are volumetric pixels, 3D coordinates. This keeps track of those in order to speed up spatial determinations, such as if a block is close by to another block.
var Voxel = new Array();

// The primary, generic function to intelligently record the position and state of all objects blockular in nature. 
function blockRecord(blockID, position) {

//	var blockAttributes = new Array(blockID, position, axis);
	
//	currentPosition = {x: position.x + axis.x, y: position.y + axis.y, z: position.z};
	
	Field[blockID] = {x: position.x, y: position.y, z: position.z};
	
	// Add new voxel position
	VoxArray(position.x, position.y, position.z, blockID);
	
	loggit('Block placed on the grid at ' + position.x + ', ' + position.y + ', ' + position.z);
	
//	return {x: blockX, y: blockY, z: blockZ};
}

// Creates values within an associative arrray of established coordinates
function VoxArray(x, y, z, value) {
	if (Voxel[x] == null) {
		Voxel[x] = new Array();
	}

	if (Voxel[x][y] == null) {
		Voxel[x][y] = new Array()
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

function findBlockXY(gridTarget) {
	// Number ID of the grid element, longer for initial color names
	var gridnum = parseInt(gridTarget.substr(6, 20));
	
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

// Bunch of terrible code that detects neighboring blocks based on a target position, and returns their neighbors.
function neighbors(position) {
	// Additional undefined neighbors logic for when the player places a block on the grid.
	// This doesn't apply for z-axis voxels.
	
	neighbors = new Array();
	
//	neighbors[targetAxis] = target;
	/*
	for (i = 0; i < 5; i++) {
		blockAxis ();
	}
	*/
	
	neighbors[0] = Voxel[position.x + 1][position.y][position.z];
	neighbors[1] = Voxel[position.x - 1][position.y][position.z];
	neighbors[2] = Voxel[position.x][position.y + 1][position.z];
	neighbors[3] = Voxel[position.x][position.y - 1][position.z];
	neighbors[4] = Voxel[position.x][position.y][position.z + 1];
	neighbors[5] = Voxel[position.x][position.y][position.z - 1];
	
	// 0 = x+, 1 = x-, and so on.
	loggit('x+: ' + neighbors[0] + ', x-: ' + neighbors[1] + ', y+: ' + neighbors[2] + ', y-: ' + neighbors[3] + ', z+: ' + neighbors[4] + ', z-: ' + neighbors[5] + '.');
	
	return neighbors;
}
/*
function neighbors(target) {
	target = target;
	
}
*/
/*
Neighbors.prototype = {
	// Axes which have a block nearby. Syntax is 0 = x+, 1 = x-, and so on.
	this.neighbors = {'x0', 'x1', 'y0', 'y1', 'z0', 'z1'};
	
	findNearbyVoxels: function() {
		this.neighbors.target;
	}
}
*/








