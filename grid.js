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

/*function gridTransform(grid, winsize) {
	
	// Initialize variables	
	var blockSize = {x: 45, y: 45};
	
	var gridSize = {
		x: Math.floor(Math.sqrt(2) * size.x * grid_x),
		y: Math.floor(gridsize_x / 2)
	};
	
	var gridOffset = {
		x: Math.floor((winsize.x / 2) - gridsize.x / 2),
		y: offset_y = (screen_y - gridsize_y) + 145
	};*/

/*	var UIbar = 3;
	var M1 = [];
	var z = 0;
		
	// Populate matrices with initial 2D grid
	for (x = 0; x <= (grid_x - 1); x++) {
		for (y = 0; y <= (grid_y - 1); y++) {
			M1[z] = $M([
				[(x * blockSize.x), (y * blockSize.y)],
				[(x * blockSize.x + blockSize.x), (y * blockSize.y)],
				[(x * blockSize.x + blockSize.x), (y * blockSize.y + blockSize.y)],
				[(x * blockSize.x), (y * blockSize.y + blockSize.y)]
			]);
			z++;
		}
	}

	// 45 degrees (in radians)
	angle = Math.PI / (2 + 2 * rotation);
	
	// Scale y-axis by half
	var M25 = $M([
		[1,0],
		[0,0.5]
	]);
	
	// Translates across screen
	var M26 = $M([
		[offset_x, offset_y],
		[offset_x, offset_y],
		[offset_x, offset_y],
		[offset_x, offset_y]
	]);

	// This applies the angle and the scale to the 2D grid to make it into 2.5D isometric
	M2 = Matrix.Rotation(angle);
	M2 = M2.x(M25);
	
	// SVG namespace so that objects can be attached to the document.
	var svgNS = 'http://www.w3.org/2000/svg';
	
	// Creates the gridTransform Group
	gridGroup = document.createElementNS(svgNS, 'g');
	gridGroup.setAttributeNS(null, 'id', 'gridTransform');
	gridGroup.setAttributeNS(null, 'fill', '#DDD');
	gridGroup.setAttributeNS(null, 'stroke', '#777');
	gridGroup.setAttributeNS(null, 'stroke-width', '1');
	
	// Create string formatted for SVG paths, thus making squares
	for (i= 0; i <= (grid_x * grid_y - 1); i++) {
		var M = M1[i].x(M2); // Rotate & Squash
		N = M.round(); // Whole numbers
		N = N.add(M26); // Translate coordinates
		
		var gridID = 'bgGrid-' + i;
		
		pathElement = document.createElementNS(svgNS, 'path');
		pathElement.setAttributeNS(null, 'id', gridID);
		
		path = '';
		path += 'M ' + N.e(1,1) + ' ' + N.e(1,2);
		path += ' L ' + N.e(2,1) + ' ' + N.e(2,2);
		path += ' L ' + N.e(3,1) + ' ' + N.e(3,2);
		path += ' L ' + N.e(4,1) + ' ' + N.e(4,2);
		path += ' z';
		
		pathElement.setAttributeNS(null, 'd', path);
//		gridGroup.appendChild(pathElement);
		
		// This function probably adds more overhead than necessary.
		var gridcoors = findGridXY(pathElement);
		
		// Add new voxel position
		VoxArray(gridcoors.x, gridcoors.y, -1, gridID);

		GridField['bgGrid-' + i] = {x: gridcoors.x, y: gridcoors.y, z: -1};
	}	*/
	/*
	// Build UI before the grid is built
	UITransform(offset_x, offset_y);

	// Add the entire grid group. Everything in this script adds to that group, so this comes last.
	gridparent = document.getElementById('gridContainer');
	gridparent.appendChild(gridGroup);
	
	// Add timer and resolution info to Debug Box
	loggit("Available screen: " + screen_x + " pixels by " + screen_y + " pixels.");
	
	if(screen_x < gridsize_x && screen_y < gridsize_y) {
		loggit('Your window may be large enough. Please zoom out and refresh.');
	} else if (screen_x < gridsize_x) {
		loggit('Your window may not be wide enough. Please zoom out and refresh.');
	} else if (screen_y < (gridsize_y + 120)) {
		loggit('Your window may not be tall enough. Please zoom out and refresh.');
	}
	
	/// Position UI elements
	
	// Move RightButtons to the right
	movesubject = document.getElementById('RightButtons');
	movesubject.setAttributeNS(null, 'transform', 'translate(' + (screen_x - 220) + ', ' + (screen_y - 50) + ')');
	
	// Widen footerbg to the width of the screen
	movesubject = document.getElementById('footerbg');
	movesubject.setAttributeNS(null, 'width', (screen_x - 10));
	
	// Move the Footer to the bottom of the screen
	movesubject = document.getElementById('Footer');
	movesubject.setAttributeNS(null, 'transform', 'translate(0, ' + (screen_y - 65) + ')');

	// Make the triangle behind the logo
	movesubject = document.getElementById('logobg');
	path = '';
	path += 'M ' + (screen_x / 2 - 92) + ' ' + (screen_y - 63);
	path += ' L ' + (screen_x / 2) + ' ' + (screen_y - 109);
	path += ' L ' + (screen_x / 2 + 92) + ' ' + (screen_y - 63);
	path += ' z';
	movesubject.setAttributeNS(null, 'd', path);
	
	movesubject = document.getElementById('logobgstroke');
	path = '';
	path += 'M ' + (screen_x / 2 - 90) + ' ' + (screen_y - 65);
	path += ' L ' + (screen_x / 2) + ' ' + (screen_y - 109);
	path += ' L ' + (screen_x / 2 + 90) + ' ' + (screen_y - 65);
	movesubject.setAttributeNS(null, 'd', path);
	
	// Position blockBeta	
	// movesubject = document.getElementById('blockBeta');
	// movesubject.setAttributeNS(null, 'transform', 'translate(' + ((screen_x / 2) - 26) + ', ' + (screen_y - 93) + ')');
	
	// Position title text under blockBeta
	movesubject = document.getElementById('nanoblok');
	textoffset = movesubject.getBBox();
	movesubject.setAttributeNS(null, 'transform', 'translate(' + ((screen_x / 2) - (textoffset.width / 2)) + ', ' + (screen_y - 50) + ')');
}*/

// Initialize variables	

// General iso / block proportions
var sc1 = 45; // Size of the whole block
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
	
	for (var x = 0; x <= gridDims.c; x++) {
		for (var y = 0; y <= gridDims.r; y++) {
			var tile = {
				x: (x * sc2) + (y * sc2),
				y: ((y * sc4) + (gridSize.y - x * sc4)) + offsY
			};

			var set = hexiso(tile.x, tile.y);
			
			var tile = drawSet([1, 2, 7, 6], set, true);
			
			tile.setAttributeNS(null, 'id', 'gridTile-' + i);
			
			gridContainer.appendChild(tile);
			i++;
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