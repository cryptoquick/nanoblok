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

function gridTransform(grid_x, grid_y, screen_x, screen_y, rotation) {
	
	// Initialize variables
	var size_x = 45;
	var size_y = 45;
	
	var gridsize_x = Math.floor(Math.sqrt(2) * size_x * grid_x);
	var gridsize_y = Math.floor(gridsize_x / 2);
	
	var offset_x = Math.floor((screen_x / 2) - gridsize_x / 2);
	var offset_y = (screen_y - gridsize_y) + 145;

	var UIbar = 3;
	var M1 = [];
	var z = 0;
		
	// Populate matrices with initial 2D grid
	for (x = 0; x <= (grid_x - 1); x++) {
		for (y = 0; y <= (grid_y - 1); y++) {
			M1[z] = $M([
				[(x * size_x), (y * size_y)],
				[(x * size_x + size_x), (y * size_y)],
				[(x * size_x + size_x), (y * size_y + size_y)],
				[(x * size_x), (y * size_y + size_y)]
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
		gridGroup.appendChild(pathElement);
		
		// This function probably adds more overhead than necessary.
		var gridcoors = findGridXY(pathElement);
		
		// Add new voxel position
		VoxArray(gridcoors.x, gridcoors.y, -1, gridID);

		GridField['bgGrid-' + i] = {x: gridcoors.x, y: gridcoors.y, z: -1};
	}
	
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
/*	movesubject = document.getElementById('blockBeta');
	movesubject.setAttributeNS(null, 'transform', 'translate(' + ((screen_x / 2) - 26) + ', ' + (screen_y - 93) + ')');*/
	
	// Position title text under blockBeta
	movesubject = document.getElementById('nanoblok');
	textoffset = movesubject.getBBox();
	movesubject.setAttributeNS(null, 'transform', 'translate(' + ((screen_x / 2) - (textoffset.width / 2)) + ', ' + (screen_y - 50) + ')');
}