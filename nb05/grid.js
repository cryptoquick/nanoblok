//	Copyright 2009 Alex Trujillo
//	Full source available here under the MIT License: http://code.google.com/p/nanoblok/

//	SUMMARY
//	gridTransform.js uses the Sylvester javascript library. You can find it here:
//	http://sylvester.jcoglan.com/
//	Here a grid is created, its coordinates transformed using matrix math courtesy of
//	Sylvester, then output as paths to the display. This is also done for the debug
//	grid. There's also code here to place SVG code into the DOM, as well as some other
//	debugging functionality.
//	Not much has changed since vektornye just yet.

//blockSize, gridDims, gridSize, offset, side
function drawGrid (commonVars, side) {
	// Grid-specific variables
	var gridContainer = document.getElementById('gridContainer');	
	
	var i = 0;
	
	// Grid loop builds an absolute position tile, then places it at a specific x/y position on the grid.
	for (var x = 0; x < gridDims.c; x++) {
		for (var y = 0; y < gridDims.r; y++) {
			var tileCoors;
			
			if (side == "bottom") {
				var hexSide = [1, 2, 7, 6];
				tileCoors = {
					x: (x * commonVars.blockSize.half) + (y * commonVars.blockSize.half) + commonVars.offset.x,
					y: ((y * commonVars.blockSize.quarter) + (commonVars.gridSize.y - x * commonVars.blockSize.quarter)) + commonVars.offset.y
				};
			}
			if (side == "left") {
				var hexSide = [1, 7, 5, 6];
				tileCoors = {
					x: (x * commonVars.blockSize.half)  + commonVars.offset.x,
					y: ((y * commonVars.blockSize.half) + (-commonVars.gridSize.y - x * commonVars.blockSize.quarter)) + commonVars.offset.y
				};
			}
			if (side == "right") {
				var hexSide = [6, 7, 4, 5];
				tileCoors = {
					x: (x * commonVars.blockSize.half) + commonVars.gridSize.x / 2 + commonVars.offset.x,
					y: ((y * commonVars.blockSize.half) + (-commonVars.gridSize.y * 2 + x * commonVars.blockSize.quarter)) + commonVars.offset.y
				};
			}

			var set = hexiso(tileCoors, commonVars.blockSize);
			
			var tile = drawSet(hexSide, set, true);
			
			if (side == "bottom") {
				var blockID = 'x-' + i;
				tile.setAttributeNS(null, 'id', blockID);
				GridField['x-' + i] = {x: x, y: y, z: -1, coors: tileCoors};
			//	Voxel[x][0][0] = ;
			}
			if (side == "left") {
				var blockID = 'y-' + i;
				tile.setAttributeNS(null, 'id', 'y-' + i);
				GridField['y-' + i] = {x: x, y: y, z: -1, coors: tileCoors};
			}
			if (side == "right") {
				var blockID = 'z-' + i;
				tile.setAttributeNS(null, 'id', 'z-' + i);
				GridField['z-' + i] = {x: x, y: y, z: -1, coors: tileCoors};
			}
			
			// Column, Row
			tile.setAttributeNS(null, 'c', x);
			tile.setAttributeNS(null, 'r', y);
			
			gridContainer.appendChild(tile);
			i++;
		}
	}
}