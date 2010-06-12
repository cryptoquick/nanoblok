/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for grid.js:
 * Contains grid-related functions; one for the math to setup the points used by the grids, then an SVG-based grid plotter, and then a canvas-based grid plotter.
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

// Versatile function for drawing tiles. Perhaps a bit too versatile.
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

// Draws the invisible SVG grid for mouse detection.
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

// Draws the grids using canvas.
// Lots of nested loops here. Individual loops for each grid.
function canvasGrid (commonVars, side, mode) {
	var i = 0;
		
	for (var x = 0; x < commonVars.gridDims.c; x++) {
		for (var y = 0; y < commonVars.gridDims.r; y++) {
			if (side == "bottom") {
				var hexSet = [1, 2, 7, 6];
				var offset = GridField["x-" + i].coors;
				
				if (mode == "standard") {
					var fill = "#eee";
					var stroke = "#aaa";
				}
				if (mode == "number") {
					var fill = "rgb(" + (255 - i / 4) + ", " + 0 + ", " + 0 + ")";
					var stroke = "black";
				}
				
				// hexSet, offset, commonVars, closed, color, stroke
				canvasDrawSet(hexSet, offset, commonVars,
					{closed: true, fill: fill, stroke: stroke});
			}
			if (side == "left") {
				var hexSet = [1, 7, 5, 6];
				var offset = GridField["y-" + i].coors;
				
				if (mode == "standard") {
					var fill = "#ddd";
					var stroke = "#aaa";
				}
				if (mode == "number") {
					var fill = "rgb(" + 0 + ", " + (255 - i / 4) + ", " + 0 + ")";
					var stroke = "black";
				}
				
				canvasDrawSet(hexSet, offset, commonVars,
					{closed: true, fill: fill, stroke: stroke});
			}
			if (side == "right") {
				var hexSet = [6, 7, 4, 5];
				var offset = GridField["z-" + i].coors;
				
				if (mode == "standard") {
					var fill = "#ccc";
					var stroke = "#aaa";
				}
				if (mode == "number") {
					var fill = "rgb(" + 0 + ", " + 0 + ", " + (255 - i / 4) + ")";
					var stroke = "black";
				}
				
				canvasDrawSet(hexSet, offset, commonVars,
					{closed: true, fill: fill, stroke: stroke});
			}
			
			i++;
		}
	}
}