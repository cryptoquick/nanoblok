/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for main.js:
 * Has event listeners and corresponding handlers for Initialization, Update (to refresh all parts of the screen), Click, and Hover. 
 */

var initialized = false;

window.addEventListener('load', function () {
	Initialize();
}, false);

var mouseDown = false;
var displayResized = false;

/* Main Functions */
function Initialize ()
{
	loggit("Program loaded.");
	
	var init0 = new Date();
	
	// Attach our common variables to the window for easy access.
	window.$C = new Common();
	
	// Initialize the voxel array.
	initVoxels(Voxel);
	
	// Initialize the color swatch for color IDs.
	swatchInit();
	
	// Run core graphics functions in default state.
	Update("initialize", {gridMode: "standard"});
	
	// Post-initialization tasks.
	var init1 = new Date();
	
	loggit('Program initialized in ' + (init1 - init0) + ' ms.');
	initialized = true;
	
	InitEvents();
}

// Redraw grid, redraw UI, redraw canvas...
function Update (updateMode, updateSettings) {	
	if (updateMode == "resize" || updateMode == "initialize") {
		gridCoors();
	//	removeUI();
	//	removeGrid();
	}
	
	// Draw SVG elements
	if (updateMode == "resize" || updateMode == "initialize") {
		drawUI();
		drawGrid("bottom");
	}

	// Draw canvas grid...
	if (updateMode == "resize" || updateMode == "canvas" || updateMode == "initialize") {		
		canvasGrid("bottom", updateSettings.gridMode);
		canvasGrid("left", updateSettings.gridMode);
		canvasGrid("right", updateSettings.gridMode);
		
		// ...and some logic for button outlines / selection.
		if (updateSettings.gridMode == "standard") {
			
			// Select color button at update.
			$C.tools.selectColor();
		}
	}
	
	Dialog.init();
	
	$C.posInd.redraw();
}

