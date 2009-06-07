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