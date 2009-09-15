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

function drawGrid (blockSize, gridDims, gridSize, offset, side) {
	// Grid-specific variables
	var gridContainer = document.getElementById('gridContainer');	
	
	var i = 0;
	
	// Grid loop builds an absolute position tile, then places it at a specific x/y position on the grid.
	for (var x = 0; x < gridDims.c; x++) {
		for (var y = 0; y < gridDims.r; y++) {
			if (side == "bottom") {
				var hexSide = [1, 2, 7, 6];
				var tile = {
					x: (x * blockSize.half) + (y * blockSize.half) + offset.x,
					y: ((y * blockSize.quarter) + (gridSize.y - x * blockSize.quarter)) + offset.y
				};
			}
			if (side == "left") {
				var hexSide = [1, 7, 5, 6];
				var tile = {
					x: (x * blockSize.half)  + offset.x,
					y: ((y * blockSize.half) + (-gridSize.y - x * blockSize.quarter)) + offset.y
				};
			}
			if (side == "right") {
				var hexSide = [6, 7, 4, 5];
				var tile = {
					x: (x * blockSize.half) + gridSize.x / 2 + offset.x,
					y: ((y * blockSize.half) + (-gridSize.y * 2 + x * blockSize.quarter)) + offset.y
				};
			}

			var set = hexiso(tile, blockSize);
			
			var tile = drawSet(hexSide, set, true);
			
			if (side == "bottom") {
				tile.setAttributeNS(null, 'id', 'x-' + i);
			}
			if (side == "left") {
				tile.setAttributeNS(null, 'id', 'y-' + i);
			}
			if (side == "right") {
				tile.setAttributeNS(null, 'id', 'z-' + i);
			}
			
			// Column, Row
			tile.setAttributeNS(null, 'c', x);
			tile.setAttributeNS(null, 'r', y);
			
			gridContainer.appendChild(tile);
			i++;
			
			GridField['gridTile-' + i] = {x: x, y: y, z: -1};
		}
	}
}