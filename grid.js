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

// Initialize variables	

// General iso / block proportions
var sc1 = 25; // Size of the whole block
var sc2 = sc1 / 2; // Half-block dimension
var sc4 = sc1 / 4; // Quarter-block dimension
var sc3 = sc2 + sc4; // Half+Quarter-block dimension

function drawGrid (gridDims, windowSize, offsY) {
	// Grid-specific variables

/*	var gridSize = { x: Math.floor(Math.sqrt(2) * sc1 * gridDims.c) };
	gridSize.y = Math.floor(gridSize.x / 2);

	var gridOffset = {
		x: Math.floor((windowSize.x / 2) - gridSize.x / 2),
		y: (windowSize.y - gridSize.y) + 145
	};*/
	
	var gridSize = {
		x: gridDims.c * sc1,
		y: gridDims.r * sc4
	};
	
	var gridContainer = document.getElementById('gridContainer');	
	
	var i = 0;
	
	for (var x = 0; x < gridDims.c; x++) {
		for (var y = 0; y < gridDims.r; y++) {
			var tile = {
				x: (x * sc2) + (y * sc2),
				y: ((y * sc4) + (gridSize.y - x * sc4)) + offsY
			};

			var set = hexiso(tile.x, tile.y);
			
			var tile = drawSet([1, 2, 7, 6], set, true);
			
			tile.setAttributeNS(null, 'id', 'gridTile-' + i);
			tile.setAttributeNS(null, 'c', x);
			tile.setAttributeNS(null, 'r', y);
			
			gridContainer.appendChild(tile);
			i++;
			
			GridField['gridTile-' + i] = {x: x, y: y, z: -1};
		}
	}
}

function alignGrid () {
	var area = gridDimensions();
	gridContainer.setAttributeNS(null, 'x', area.offset.x);
	gridContainer.setAttributeNS(null, 'y', area.offset.y);
	gridContainer.setAttributeNS(null, 'width', area.grid.x);
	gridContainer.setAttributeNS(null, 'height', area.grid.y);
}

//block = setColor(blockBlank, color);
//block.setAttributeNS(null, 'id', blockID);


function gridDimensions () {
	// Calculate the height and width of the grid area
	grid = {x: sc1 * gridCol, y: sc2 * gridRow};
	
	// Find the upper left corner of the grid area from the window dimensions
	offset = {x: nanoWindow.x / 2 - grid.x / 2, y: nanoWindow.y / 2 - grid.y / 2};
	
	// Offsets and dimensions of the grid
	return {offset: offset, grid: grid};
}

function makeGridElement (position) {
	var coorSet = hexiso(position.x, position.y);
	
	var blokTop = drawSet([1, 2, 7, 6], coorSet, true);

	return blokTop;
}