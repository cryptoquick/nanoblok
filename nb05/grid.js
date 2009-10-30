/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for grid.js:
 * Contains two functions-- one to come up with coordinates for the grids, then the function to draw the SVG grid.
 */

// The gridCoors function creates a static set of coordinates from which to base the canvas and SVG grids upon.
function gridCoors (commonVars, side) {	
	var i = 0;
	
	// Grid loop builds an absolute position tile, then places it at a specific x/y position on the grid.
	for (var x = 0; x < commonVars.gridDims.c; x++) {
		for (var y = 0; y < commonVars.gridDims.r; y++) {
			var tileCoors;

			// Bottom side.
			var hexSide = [1, 2, 7, 6];
			tileCoors = {
				x: (x * commonVars.blockSize.half) + (y * commonVars.blockSize.half) + commonVars.offset.x,
				y: ((y * commonVars.blockSize.quarter) + (commonVars.gridSize.y - x * commonVars.blockSize.quarter)) + commonVars.offset.y
			};
			
			GridField['x-' + i] = {x: x, y: y, z: -1, coors: tileCoors};
			
			// Left side.
			var hexSide = [1, 7, 5, 6];
			tileCoors = {
				x: (x * commonVars.blockSize.half)  + commonVars.offset.x,
				y: ((y * commonVars.blockSize.half) + (-commonVars.gridSize.y - x * commonVars.blockSize.quarter)) + commonVars.offset.y
			};
			
			GridField['y-' + i] = {x: x, y: y, z: -1, coors: tileCoors};

			// Right side.
			var hexSide = [6, 7, 4, 5];
			tileCoors = {
				x: (x * commonVars.blockSize.half) + commonVars.gridSize.x / 2 + commonVars.offset.x,
				y: ((y * commonVars.blockSize.half) + (-commonVars.gridSize.y * 2 + x * commonVars.blockSize.quarter)) + commonVars.offset.y
			};

			GridField['z-' + i] = {x: x, y: y, z: -1, coors: tileCoors};

			i++;
		}
	}
}

function drawGrid (commonVars, side) {
	var gridContainer = document.getElementById('gridContainer');
	
	var i = 0;
	
	for (var x = 0; x < commonVars.gridDims.c; x++) {
		for (var y = 0; y < commonVars.gridDims.r; y++) {
			var tileCoors = GridField['x-' + i];
			var hexSide = [1, 2, 7, 6];
			
			var set = hexiso(tileCoors.coors, commonVars.blockSize);
			var tile = drawSet(hexSide, set, true);
			
			// Column, Row
			tile.setAttributeNS(null, 'c', x);
			tile.setAttributeNS(null, 'r', y);
			
			var blockID = 'x-' + i;
			tile.setAttributeNS(null, 'id', blockID);
			
			gridContainer.appendChild(tile);
			
			i++;
		}
	}
}