//	Copyright 2009 Alex Trujillo
//	Full source available here under the MIT License: http://code.google.com/p/nanoblok/
	
// Field is short for Playfield, and each element contains 5 values; X, Y, Z, color, and functionality.
var Field = new Object();
//Field.length = 0;

Voxel = new Array();

// Creates values within an associative arrray of established coordinates
function VoxArray(voxel, x, y, z, value) {
	if (voxel[x] == null) {
		voxel[x] = new Array(x);
	}

	if (voxel[x][y] == null) {
		voxel[x][y] = new Array(y);
	}

	voxel[x][y][z] = value;
}