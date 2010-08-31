/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for block.js:
 * This file holds outdated SVG-based block rendering code. This stores data in the DOM, which uses more resources and is slower.
 * Soon to be deprecated.
 */

// Draws hexagonal points in iso perspective, based on hard coordinate and size of block. Depends on an orientation array (see block-grid.png in Nanoblok Extras). Returns static coordinates of where to draw blocks on the screen.
function hexiso (offset, blockSize) {
	// Builds an array of points that corresponds to an entire isometric block (six points), including center (7). Arrays for both X and Y coordinates. Offset added to hexagon proportions.	
	var isoX = Array();
	isoX [1] = blockSize.half + offset.x;
	isoX [2] = blockSize.full + offset.x;
	isoX [3] = blockSize.full + offset.x;
	isoX [4] = blockSize.half + offset.x;
	isoX [5] = offset.x;
	isoX [6] = offset.x;
	isoX [7] = blockSize.half + offset.x;

	var isoY = Array();
	isoY [1] = offset.y;
	isoY [2] = blockSize.quarter + offset.y;
	isoY [3] = blockSize.third + offset.y;
	isoY [4] = blockSize.full + offset.y;
	isoY [5] = blockSize.third + offset.y;
	isoY [6] = blockSize.quarter + offset.y;
	isoY [7] = blockSize.half + offset.y;
	
	return {x: isoX, y: isoY};
}

// A very useful function to draw a set of coordinates in a hexagonal setup at a certain offset.
// Very necessary for an isometric setup such as this.
function canvasDrawSet (hexSet, offset, settings) {
	var canvas = null;
	
	if (settings.grid) {
		canvas = 'grids';
	}
	else if ($C.swatchActive) {
		canvas = 'colors';
	}
	else if ($C.selection.enabled) {
		canvas = 'selection';
	}
	else {
		canvas = 'blocks';
	}
	
	var ctx = context(canvas);
	
	ctx.globalAlpha = 1.0;
	
	var hexSpot = hexSet.pop();
	var coorSet = hexiso(offset, $C.blockSize);
	var offsY = -35;
	
	ctx.beginPath();
	ctx.moveTo(coorSet.x[hexSpot], coorSet.y[hexSpot] + offsY);
	
	var i = 0;

	while (i < hexSet.length || i == 7) {
		hexSpot = hexSet.pop();
		ctx.lineTo(coorSet.x[hexSpot], coorSet.y[hexSpot] + offsY);
		i = i++;
	}
	
	if (settings.closed) {
		ctx.closePath();
	}
	
	if (settings.stroke !== false) {
		ctx.strokeStyle = settings.stroke;
		ctx.stroke();
	}
	if (settings.fill !== false) {
		ctx.fillStyle = settings.fill;
		ctx.fill();
	}
}

// colorBlock uses a color object (with separate color values for each face as well as its lines) to provide different shading for block faces.

var cubeShift = {a: -20, b: -10, c: 0, d: -30};
var blokShift = {a: -40, b: -20, c: 0, d: -60};

function colorBlockNew (color) {
	var blockColors = new Object();
	var shift;
	
	if ($C.swatchActive) {
		shift = cubeShift;
	}
	else {
		shift = blokShift;
	}
	
	blockColors.left = "rgb(" + smartShift(color.r, shift.a) + ", " + smartShift(color.g, shift.a) + ", " + smartShift(color.b, shift.a) + ")";
	blockColors.right = "rgb(" + smartShift(color.r, shift.b) + ", " + smartShift(color.g, shift.b) + ", " + smartShift(color.b, shift.b) + ")";
	blockColors.top = "rgb(" + smartShift(color.r, shift.c) + ", " + smartShift(color.g, shift.c) + ", " + smartShift(color.b, shift.c) + ")";
	blockColors.inset = "rgb(" + smartShift(color.r, shift.d) + ", " + smartShift(color.g, shift.d) + ", " + smartShift(color.b, shift.d) + ")";
	
	return blockColors;
}

function smartShift (color, shift) {
	if (color + shift < 0) {
		// For dark black.
		var shifted = color - shift;
	}
	else if (color + shift > 255) {
		// For light white.
		var shifted = Math.min(color + shift, 255);
	}
	else {
		// And everything inbetween.
		var shifted = color + shift;
	}
	
	return shifted;
}

// Paints a block on the board with proper color and occlusion.
// Takes coors x/y for position, xyz location on the grid, $C, and the color object of the block.
// A color id can be converted into a color object using the colorBlock function.
function canvasBlock (position, location, color) {
	var adjustedPosition = {x: position.x, y: position.y - $C.blockSize.half * (location.z + 1)};
	
	if ($C.swatchActive) {
		Arr = SwatchGhost;
	}
	else {
		Arr = Voxel;
	}
	
	// Top side. Always placed, unless there's a block above it.
	// Top block.
	/*
	var top = false;
	
	for (var i = location.z, ii = 32; i < ii; i++) {
		if (Arr[location.x][location.y][i] == -1) {
			top = true;
		}
		else {
			top = false;
			break;
		}
	} */
	
	if (Arr[location.x][location.y][location.z + 1] == -1) { // && top) {
		canvasDrawSet([1, 6, 7, 2], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
	}
	// Always draw top if block above it is invisible.
	else {
		if (!$C.swatchActive) {
			if (!FieldVisible[Voxel[location.x][location.y][location.z + 1]]) {
				canvasDrawSet([1, 6, 7, 2], adjustedPosition, {closed: true, fill: color.top, stroke: color.inset});
			}
		}
	}
	
	// Left side.
	if (Arr[location.x - 1][location.y][location.z] == -1 && Arr[location.x - 1][location.y + 1][location.z] == -1) {
		canvasDrawSet([6, 7, 4, 5], adjustedPosition, {closed: true, fill: color.left, stroke: color.inset});
	} else if (Arr[location.x - 1][location.y + 1][location.z] != -1 && Arr[location.x - 1][location.y][location.z] == -1) {
		canvasDrawSet([6, 7, 5], adjustedPosition, {closed: true, fill: color.left, stroke: color.inset});
	}
	
	// Right side.
	if (Arr[location.x][location.y + 1][location.z] == -1 && Arr[location.x - 1][location.y + 1][location.z] == -1) {
		canvasDrawSet([2, 7, 4, 3], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
	} else if (Arr[location.x - 1][location.y + 1][location.z] != -1 && Arr[location.x][location.y + 1][location.z] == -1) {
		canvasDrawSet([2, 7, 3], adjustedPosition, {closed: true, fill: color.right, stroke: color.inset});
	}
}

// This gathers necessary information for block placement, and determines whether the block should actually be placed.
function placeBlock (target) {
	// Make location object.
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: $C.layerOffset.z
	}
	
	// If the same block already exists at the location being painted, don't paint over it again.
	if (Voxel[location.x][location.y][location.z] != -1) {
		if (Field[Voxel[location.x][location.y][location.z]][3] != $C.selected.color) {
			placeBlockDraw(target, location);
		}
		else {
			loggit("Same block already exists at location.");
		}
	}
	else {
		placeBlockDraw(target, location);
	}
}

// Here is all the actual functionality required for placing the block, where it calls canvasBlock to place a block on the grid.
function placeBlockDraw (target, location) {
	// Draw the actual block using coordinates using the location of the grid's tiles as a reference for pixel-placement for all the rest of the blocks (this is the first argument). The target.id should look something like "x-123".
	// colorBlock is used to turn the color index into a color object (with separate color values for each face as well as its lines)
	canvasBlock(GridField[target.id].coors, location, colorBlockNew(SwatchField[$C.selected.color][3]));

	// Record information in the Field array, which is for serialization.
	Field.push([location.x, location.y, location.z, $C.selected.color]);
	FieldVisible.push(true);
	// As well as the Field index of the block internally using the Voxel array.
	Voxel[location.x][location.y][location.z] = Field.length - 1;

	// Let the user know they've placed a block.
	loggit("Block placed at " + location.x + ", " + location.y + ", " + location.z + ".")

	// Redraw the display so that this change shows up immediately.
	$C.posInd.redraw();
}

function removeBlock (target) {
	var time0 = new Date();
	
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: 0 + $C.layerOffset.z // forgot why I put a zero here.
	}
	
	if (Voxel[location.x][location.y][location.z] != -1) {
		Voxel[location.x][location.y][location.z] = -1;
		popField(location.x, location.y, location.z);
	
		$C.posInd.clearBlocks();
		drawAllBlocks();
		$C.posInd.redraw();
	
		var time1 = new Date();
		loggit("The block at " + location.x + ", " + location.y + ", " + location.z + " was removed in " + (time1 - time0) + " ms.");
	}
	else {
		loggit("Nothing to remove.");
	}
}

function drawAllBlocks () {
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	var gridPosition = 0;
	var coors = new Object();
	
	for (var i = 0, ii = Field.length; i < ii; i++) {
		if (FieldVisible[i]) {
			location = {x: Field[i][0], y: Field[i][1], z: Field[i][2]};
			gridPosition = location.x * $C.gridDims.c + location.y;
			coors = GridField["x-" + gridPosition].coors;
			color = colorBlockNew(SwatchField[Field[i][3]][3]);
			canvasBlock(coors, location, color);
		}
	}
}

function popField(x, y, z) {
	for (var i = 0, ii = Field.length; i < ii; i++) {
		// console.log(i);
		if (Field[i][0] == x && Field[i][1] == y && Field[i][2] == z) {
			Field.splice(i, 1);
			FieldVisible.splice(i, 1);
			break;
		}
	}
}

// Rebuilds the entire model scene from a field gotten from the server.
function rebuild () {
	initVoxels(Voxel);
	
	for (var i = 0, ii = Field.length; i < ii; i++) {
		Voxel[Field[i][0]][Field[i][1]][Field[i][2]] = i;
		FieldVisible.push(true);
	}
	
	$C.posInd.clearBlocks();
	drawAllBlocks();
	$C.posInd.redraw();
}

function drawSingleBlock (location, color) {
	var block = Field[i];

	var gridPosition = block[0] * $C.gridDims.c + block[1];
	var coors = GridField["x-" + gridPosition].coors;

	canvasBlock(coors, location, color);
}

var t = new Object();
var time1 = new Object();
var time0 = new Object();
var Swatch = new Array();
var SwatchGhost = new Array();
var SwatchField = new Array();

// Initialize the color swatch array if it hasn't been done already.
function swatchInit () {
	var index = 0;
	
	if ($C.swatchInit === false) {
		loggit("Initializing Color Array");
		// By inverting this, computation is sped up a great deal.
		for (var z = -1; z < $C.gridDims.c + 1; z++) {
			Swatch[z] = new Array();
			for (var y = -1; y < $C.gridDims.r + 1; y++) {
			Swatch[z][y] = new Array();
				for (var x = $C.gridDims.r + 1; x >= -1; x--) {
					if (x > -1 && x < $C.gridDims.c &&
						y > -1 && y < $C.gridDims.c &&
						z > -1 && z < $C.gridDims.c) {
							
						color = {
							r: (z + 1) * 8,
							g: (y + 1) * 8,
							b: 256 - (x + 1) * 8
						};
							
						Swatch[z][y][x] = index;
						// Last field is for a visibility toggle.
						SwatchField.push([x, y, z, color, true]);
						
						index++;
					}
					else {
						Swatch[z][y][x] = -1;
					}
				}
			}
		}
		
		$C.swatchInit = true;
	}
}

function fillColorSwatch () {
	loggit("Drawing Color Cube!");
	// Run the swatch function in such a way that the browser can render once each level is drawn.
	if ($C.animating === false) {
		$C.animating = true;
		// t = setInterval(buildColorSwatch, 1);
		$C.layerOffset.z = 30;
		$C.tools.gridUp();
		drawAllSwatch();
	}
	else {
		loggit("Animation already being run!");
	}
}

var h = 0;

function drawAllSwatch () {
	$C.swatchActive = true;
	
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	time0 = new Date();
	
	// Facilitates drawing of the array using canvasBlock occlusion.
	for (var x = -1; x < $C.gridDims.r + 1; x++) {
		SwatchGhost[x] = new Array();
		for (var y = -1; y < $C.gridDims.r + 1; y++) {
		SwatchGhost[x][y] = new Array();
			for (var z = -1; z < $C.gridDims.c + 1; z++) {
				SwatchGhost[x][y][z] = -1;
			}
		}
	}
	
	var gridPosition = 0;
	var coors = new Object();
	
	var runs = 0;
	
	// Inverted so the draw order is better.
	for (var i = SwatchField.length - 1; i >= 0; i--) {
		if (SwatchField[i][4]) {
			location = {x: SwatchField[i][0], y: SwatchField[i][1], z: SwatchField[i][2]};
			gridPosition = location.x * $C.gridDims.c + location.y;
			coors = GridField["x-" + gridPosition].coors;
			color = colorBlockNew(SwatchField[i][3]);
			SwatchGhost[location.x][location.y][location.z] = 1;
			canvasBlock(coors, location, color);
			
			runs++;
		}
	}
		
	$C.animating = false;
	$C.swatchComplete = true;
	
	time1 = new Date();
	loggit("Color Cube drawn in " + (time1 - time0) + " ms.");
	
	$C.posInd.redraw();
}

function closeColorSwatch () {
	$C.swatchActive = false;
	$C.animating = false;
	$C.layerOffset.z = 1;
	$C.tools.gridDown();
	SwatchGhost = new Array();
}

var Palette = function () {
	this.svgGroup = document.getElementById("sideColorsRight");
	this.colors = [
		26624, // red
		32386, // orange
		32673, // yellow
		7040, // green
		255, // blue
		21530, // purple
		32056, // pink
		32701, // white
		2048 // black;
	];
	this.paletteIndex = 0;
	
	this.add = function (colorIndex) {
		this.colors.push(colorIndex);
		this.draw();
	}
	
	this.remove = function (target) {
		if ($C.selected.color == parseInt(target.getAttribute("colorID"))) {
			$C.selected.color = -1;
		}
		
		var position = parseInt(target.getAttribute("colorPos"));
		this.colors.splice(position, 1);
		this.draw();
	}
	
	this.swatch = function (colorIndex, position) {
		var colorSwatch = document.createElementNS(svgNS, 'rect');
		
		var x = Math.floor(this.paletteIndex / 9);
		var y = this.paletteIndex % 9;
		
		colorSwatch.setAttributeNS(null, "colorID", colorIndex);
		colorSwatch.setAttributeNS(null, "colorPos", this.paletteIndex);
		colorSwatch.setAttributeNS(null, "fill", this.color(colorIndex));
		colorSwatch.setAttributeNS(null, "name", "color");
		colorSwatch.setAttributeNS(null, "id", "color" + colorIndex);
		colorSwatch.setAttributeNS(null, "x", -35 + 35 * x);
		colorSwatch.setAttributeNS(null, "y", 35 * y);
		colorSwatch.setAttributeNS(null, "height", 30);
		colorSwatch.setAttributeNS(null, "width", 30);
		colorSwatch.setAttributeNS(null, "rx", 3);
		colorSwatch.setAttributeNS(null, "transform", "skewY(26.565)");
		
		this.svgGroup.appendChild(colorSwatch);
		
		this.paletteIndex++;
	}
	
	this.color = function (colorIndex) {
		var colorObject = SwatchField[colorIndex][3];
		
		var rgbOutput = "rgb("
			+ colorObject.r + ", "
		 	+ colorObject.g + ", "
			+ colorObject.b + ")";
		return rgbOutput;
	}
	
	this.draw = function () {
		this.paletteIndex = 0;
		
		var colorChilds = this.svgGroup.childNodes;
		
		// It's better to loop through and remove from the end. Or you could just remove the firstChild. Either way works.
		for (var i = colorChilds.length - 1; i > -1; i--) {
			this.svgGroup.removeChild(colorChilds[i]);
		}
		
		for (var i = 0; i < this.colors.length; i++) {
			this.swatch(this.colors[i], i);
		}
	}
	
	this.faded = false;
	
	this.fade = function (toggledOn) {
		if (toggledOn) {
			var elements = document.getElementsByName("color")
			for (var i = 0, ii = elements.length; i < ii; i++) {
				elements[i].setAttributeNS(null, "fill-opacity", 0.3);
			}
			
			this.faded = true;
		}
		else {
			var elements = document.getElementsByName("color")
			for (var i = 0, ii = elements.length; i < ii; i++) {
				elements[i].setAttributeNS(null, "fill-opacity", 1.0);
			}
			
			this.faded = false;
		}
	}
}

function pickColor (target) {
	var pick = new Object();
	
	pick.x = parseInt(target.getAttributeNS(null, "c"));
	pick.y = parseInt(target.getAttributeNS(null, "r"));
	pick.z = $C.layerOffset.z;
	
	var swatchIndex = Swatch[pick.z][pick.y][pick.x];
	
	var color = SwatchField[swatchIndex][3];
	
	for (var i = 0; i < $C.palette.colors.length; i++) {
		$C.palette.colors[i]
	}
	
	
	if ($C.palette.colors[swatchIndex] == undefined) {
		$C.palette.add(swatchIndex);
	}
	
	$C.selected.color = swatchIndex;
}

function makeXHR (type, operation, data, callback) {
	var newData;
	var status = -1;
	var request = new XMLHttpRequest();
	if (!request) {
		loggit("Unable to connect.");
	}
	
	request.open(type, operation, true);
	request.setRequestHeader("Content-type", "application/json");
	// console.log(type + ", directory: /" + operation + ", data: " + data);
	
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			newData = request.responseText;
			callback(newData);
		}
	}
	
	try {
		request.send(data);
	} catch (e) {
		console.log(e);
	}
}

// Serialization.
function saveField () {
	// var fieldString = JSON.stringify(Field);
	var title = document.getElementById('saveTitle').value
	
	if (title == '') {
		Dialog.alert('No title entered.');
	}
	else if (Field.length == 0) {
		Dialog.alert('No blocks to save.');
	}
	else {
		var dbData = {
			title: title,
			Field: Field
		//	imageCanvas()
		};
	
		data = JSON.stringify(dbData);
	
		makeXHR("save", data);
		
		loggit("Blocks saved.");
	}
}

function listFields () {
	makeXHR("GET", "list", null, populateList);
}

function populateList (listData) {
	if (listData != undefined) {
		console.log(listData + ', adding json.');
		Dialog.json = listData;
		Dialog.show('dialog');
	}
	else {
		console.log(listData);
		loggit('There was an error listing.');
	}
}

// Deserialization.
function loadModel (url) {
	var fieldString = makeXHR("GET", url, null, loadField);
	// Field = JSON.parse(fieldString);
}

function loadField (loadData) {
	var loadString = JSON.parse(loadData);
	document.getElementById('saveTitle').value = loadString.title;
	Field = loadString.Field;
	Dialog.hide();
	rebuild();
}

// Temporary solution.
function imageCanvas () {
	var dataURL = document.getElementById('display').toDataURL(); // Will need to change to renderer once finished.
	
	return dataURL;
}

/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for data.js:
 * Handles data structures within the client, as well as requests to the server.
 * Also computes common variables used throughout the program, called by the $C variable attached to the window in main.js.
 */

// Field is short for Playfield, and each element contains 4 values; X, Y, Z, and color. This is strictly for serialization, and is in the order by which the user placed the blocks. Also, another array to tell if the voxel is visible.
var Field = [];
var FieldVisible = [];

// GridField stores the positions of the grid tiles. These are set by gridCoors() in grid.js. Used by the other grid functions to render.
var GridField = {};

// Voxels are volumetric pixels, 3D coordinates. This keeps track of those in order to speed up spatial determinations, such as if a block is close by to another block.
var Voxel = [];

// Many common variables used throughout the program.
var Common = function () {
	// Viewport information from the browser.
	this.windowSize = {x: window.innerWidth, y: window.innerHeight};
	
	this.blockDims = null;
	this.smallDisplay = false;
	
	// atan(0.5) in degrees, meant to represent 2:1 pixels.
	this.isoAngle = 26.565;
	
	// Change to a smaller display format if the window is too small. Not yet fully worked out.
	if (this.windowSize.x < 725 || this.windowSize.y < 760) {
		this.blockDims = 15; // For smaller screens
		loggit("Small display detected, adjusting.");
		this.smallDisplay = true;
	}
	else {
		this.blockDims = 20; // Regular size
	}
	
	// Size of blocks / tiles.
	this.blockSize = {
		full: this.blockDims,
		half: this.blockDims / 2,
		third: this.blockDims / 2 + this.blockDims / 4,
		quarter: this.blockDims / 4
	};
	
	// Throughout the program, the c field is used for various measures. If c is not the same as r-- or vice versa--, problems will occur.
	this.gridDims = {c: 32, r: 32};
	this.gridSize = {
		x: this.gridDims.c * this.blockSize.full,
		y: this.gridDims.r * this.blockSize.quarter,
		fullY: this.gridDims.r * this.blockSize.full
	};
	
	// Center of the window.
	this.center = {x: this.windowSize.x / 2, y: this.windowSize.y / 2};
	
	// Grid edges.
	this.edges = {
		left: this.center.x - this.gridSize.x / 2,
		right: this.center.x + this.gridSize.x / 2,
		top: this.windowSize.y - this.gridSize.y * 2,
		fullTop: this.windowSize.y - this.gridSize.y * 4
	};
	
	// This should technically be how far away from the left and top of the screen that the left-most, top-most corner of grid is located.
	this.offset = {
		x: 1,
		y: this.gridSize.y * 2 + 31
	};
	
	// From Tango Project colors:
	// http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines
	this.palette = [
		[164, 0, 0, 'red', null],
		[211, 127, 4, 'orange', null],
		[213, 184, 8, 'yellow', null],
		[42, 197, 18, 'green', null],
		[43, 84, 200, 'blue', null],
		[147, 29, 199, 'purple', null],
		[190, 67, 180, 'pink', null],
		[201, 202, 188, 'white', null],
		[55, 48, 51, 'black', null],
		[255, 255, 255, 'transparent', null]
	];
	
	// Various fields for selection states.
	this.selected = {
		color: 26624, // red
		lastColor: 0,
		tool: "color26624"
		// blocks: false,
		// area: {x: 0, y: 0, z: 0, l: 0, w: 0, h: 0},
		// initialSelection: {x: -1, y: -1, z: -1},
		// secondSelection: {x: -1, y: -1, z: -1}
	};
	
	this.layerOffset = {x: 0, y: 0, z: 0};
	
	// Updated as the marker is moved about the screen.
	this.markerPosition = {
		x: 31,
		y: 0,
		z: 0
	};

	// Position Indicator (which also contains the handy drawAll function)
	this.posInd = new PositionIndicator();
	
	// If the program is using the MouseMove event rather than an SVG grid, this will be enabled.
	this.mouseMove = false;
	
	// Make a new tools object containing all tool methods. (Separate from Input functions)
	this.tools = new Tools();
	
	this.toolNames = [
		"Load",
		"Save",
		"Fill",
		"Select",
		"Colors",
		"Delete"
	];
	
	this.toolMethods = [
		"load",
		"save",
		"fill",
		"select",
		"swatch",
		"remove"
	];
	
	// This is to make sure to not run another animation if an animation is already being run.
	this.animating = false;
	
	// Swatch only needs to be initialized once.
	this.swatchInit = false;
	
	// Used to tell if swatch is being displayed.
	this.swatchActive = false;
	
	// If swatch is fully drawn, this is true.
	this.swatchComplete = false;
	
	testCompat();
	
	this.selection = new Selection();
	
	this.palette = new Palette();
	
	this.renderer = new Renderer();
	
	this.titleFieldSelected = false;
}

// 3D Voxel array must be initialized before adding variables to it. -1 denotes that there is nothing there.
function initVoxels (voxArr) {
	// Initialize the voxel array.
	for (var x = -1; x < $C.gridDims.r + 1; x++) {
		if (voxArr[x] == undefined) {
			voxArr[x] = new Array();
		}
		for (var y = -1; y < $C.gridDims.r + 1; y++) {
			if (voxArr[x][y] == undefined) {
				voxArr[x][y] = new Array();
			}
			for (var z = -1; z < $C.gridDims.c + 1; z++) {
				voxArr[x][y][z] = -1;
			}
		}
	}
}

function testCompat () {
	var numTests = 1;
	var passedTests = 0;
	
	// Check for Native JSON:
	JSONtest = JSON.parse('{"works" : true}');
	if (JSONtest.works) {
		passedTests++;
	}
	
	if (passedTests == numTests) {
		// Do something meaningful.
	}
}

function fillSquare () {
	var time0 = new Date();
	
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	var w = 0;
	var l = 0;
	var i = 0;
	var t;
	
	if ($C.animating == false) {
		time0 = new Date();
		$C.animating = true;
		t = setInterval((function() {
			if (i >= 1023) {
				clearInterval(t);
				time1 = new Date();
				loggit("Square drawn in " + (time1 - time0) + " ms.");
				$C.animating = false;
			}
		
			blockColor = colorBlock($C.selected.color);

			location = {x: l, y: w, z: $C.layerOffset.z};

			var gridPosition = l * $C.gridDims.c + w;

			var coors = GridField["x-" + gridPosition].coors;

			Voxel[location.x][location.y][location.z] = $C.selected.color;
			Field.push([location.x, location.y, location.z, $C.selected.color]);

			canvasBlock(coors, location, blockColor);
		
			l++;
			if (l >= 32) {
				w++;
				l = 0;
				$C.posInd.redraw();
			}
			
			i++;
		}), 1);
	}
}var Dialog = {
	dialogEl: {},
	alertEl: {},
	showing: false,
	active: 'none',
	json: '[]',
	testString: '[{"title":"","url":"/load/ag9uYW5vYmxvay1lZGl0b3JyDQsSBlNwcml0ZRiVTgw"},{"title":"","url":"/load/ag9uYW5vYmxvay1lZGl0b3JyDgsSBlNwcml0ZRjK3AMM"},{"title":"","url":"/load/ag9uYW5vYmxvay1lZGl0b3JyDgsSBlNwcml0ZRjxogQM"}]',
	
	data: [],
	
	init: function () {
		this.dialogEl = document.getElementById('dialog');
		this.alertEl = document.getElementById('alert');
		
		// Load Dialog
		this.verts(10, 'dialogOuter');
		this.verts(20, 'dialogInner');
		
		// Alert Window
		this.verts(200, 'alertOuter');
		this.verts(210, 'alertInner');
		
		this.hide();
		this.print();
	},
	
	verts: function (inset, elementID) {
		var vertices = [
			{x: $C.gridSize.x / 2, y: inset},
			{x: $C.gridSize.x - inset, y: $C.gridSize.fullY / 4 + inset / 2},
			{x: $C.gridSize.x - inset, y: $C.gridSize.fullY / 4 + $C.gridSize.fullY / 2 - inset / 2},
			{x: $C.gridSize.x / 2, y: $C.gridSize.fullY - inset},
			{x: inset, y: $C.gridSize.fullY / 4 + $C.gridSize.fullY / 2 - inset / 2},
			{x: inset, y: $C.gridSize.fullY / 4 + inset / 2}
		];
		
		var element = document.getElementById(elementID);
		
		this.draw(vertices, element);
	},
	
	draw: function (vertices, element) {
		var hex = [];
		var path = '';
		
		// Offset each coordinate.
		for (var i = 0; i < 6; i++) {
			hex[i] = {x: vertices[i].x + $C.edges.left, y: vertices[i].y + $C.edges.fullTop - 33};
		}
		
		for (var corner = 0; corner < 6; corner++) {
			if (corner == 0) {
				path += 'M ' + hex[corner].x + ' ' + hex[corner].y;
			}
			else if (corner == 5) {
				path += ' ' + hex[corner].x + ' ' + hex[corner].y + ' Z';
			}
			else {
				path += ' L ' + hex[corner].x + ' ' + hex[corner].y;
			}
		}
		
		element.setAttributeNS(null, 'd', path);
		element.setAttributeNS(null, 'stroke', 'none');
	},
	
	show: function (type) {
		if (type == 'dialog' && !this.showing) {
			this.print();
			this.dialogEl.style.display = 'inline';
			this.showing = true;
		}
		if (type == 'alert' && !this.showing) {
			this.alertEl.style.display = 'inline';
			this.showing = true;
		}
	},
	
	hide: function () {
		this.dialogEl.style.display = 'none';
		this.alertEl.style.display = 'none';
		
		this.showing = false;
	},
	
	print: function () {
		var headerText = 'Choose a model:';
		var dialogLeft = document.getElementById('dialogLeft');
		
		removetext(dialogLeft);
		addtext(dialogLeft, headerText);
		
		this.data = JSON.parse(this.json);
		
		for (var i = 0, ii = this.data.length; i < ii; i++) {
			var textElement = addtext(dialogLeft, '- ' + this.data[i].title);
			textElement.setAttributeNS(null, 'id', 'leftList');
			console.log(this.data[i].url);
			textElement.setAttributeNS(null, 'url', this.data[i].url);
		}
	},
	
	lastHighlight: false,
	
	highlight: function (target) {
		if (this.lastHighlight) {
			this.lastHighlight.setAttributeNS(null, 'fill', '#666');
		}
		
		target.setAttributeNS(null, 'fill', 'orange');
		
		this.lastHighlight = target;
	},
	
	alert: function (msg) {
		this.show('alert');
		var alertText = document.getElementById('alertText');
		removetext(alertText);
		addtext(alertText, msg);
	},
	
	alertHighlight: false,
	
	alertButton: function (highlight) {
		var alertButton = document.getElementById('alertButton');
		
		if (highlight) {
			alertButton.setAttributeNS(null, 'fill', '#eee');
		}
		else {
			alertButton.setAttributeNS(null, 'fill', '#ddd');
		}
	}
};

/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for effects.js:
 * This file is for all the canvas-based effects that don't have a home in any of the other files yet.
 * Right now it's mostly for the overlays cursors.
 */

// Returns a canvas context based on its element id.
function context(element) {
	// Get the canvas element.
	var canvas = document.getElementById(element);
	// Get its 2D context
	if (canvas.getContext) {
		var context = canvas.getContext('2d');
	}
	return context;
}

// Updates the position indicators
var PositionIndicator = function () {
	this.ctx = context('overlays');
	this.grids = document.getElementById('grids');
	this.blocks = document.getElementById('blocks');
	this.display = document.getElementById('display');
	this.overlays = document.getElementById('overlays');
	this.colors = document.getElementById('colors');
	this.selection = document.getElementById('selection');
	// this.renderer = document.getElementById('renderer');
	this.displayCtx = context('display');
	
	this.redraw = function () {
		var offset = {x: 0, y: $C.windowSize.y};
		
		this.ctx.clearRect(0, 0, $C.windowSize.x, $C.windowSize.y);
		this.ctx.globalAlpha = 0.6;
	
		var gr1 = $C.blockSize.full;
		var gr2 = $C.blockSize.half;
		var gr4 = $C.blockSize.quarter;
	
		// Red Marker, and first of three color-coded small display offsets.
		var redOffs = -1;
		if ($C.smallDisplay) {redOffs = 0}
		// var offsY = offset.y - redOffs;
		var offsYtop = ($C.gridSize.y - redOffs)
			- ($C.markerPosition.x * $C.blockSize.quarter)
			+ ($C.gridDims.c - $C.layerOffset.z - 1) * $C.blockSize.half;
		var offsX = offset.x + $C.markerPosition.x * $C.blockSize.half;
	
		this.ctx.fillStyle = '#f00';
		this.ctx.beginPath();

		this.ctx.moveTo(offsX, 0 + offsYtop);
		this.ctx.lineTo(gr2 + offsX, offsYtop - gr4);
		this.ctx.lineTo(gr2 + offsX, gr4 + offsYtop);
		this.ctx.lineTo(0 + offsX, gr2 + offsYtop);

		this.ctx.closePath();
		this.ctx.fill();
	
		// Blue Marker
		var blueOffs = 6;
		if ($C.smallDisplay) {blueOffs = 4}
		offsYtop = (blueOffs)
			+ ($C.markerPosition.z * $C.blockSize.quarter)
			+ ($C.gridDims.c - $C.layerOffset.z - 1) * $C.blockSize.half;
		offsX = offset.x + $C.gridSize.x / 2 + ($C.markerPosition.z * $C.blockSize.half);
	
		this.ctx.fillStyle = '#00f';
		this.ctx.beginPath();
	
		this.ctx.moveTo(offsX, offsYtop - gr4);
		this.ctx.lineTo(gr2 + offsX, offsYtop);
		this.ctx.lineTo(gr2 + offsX, gr2 + offsYtop);
		this.ctx.lineTo(0 + offsX, gr4 + offsYtop);
	
		this.ctx.closePath();
		this.ctx.fill();
	
		// ($C.layerOffset.z * $C.blockSize.half) + ($C.markerPosition.z * $C.blockSize.quarter) + ($C.gridSize.y - $C.markerPosition.x * $C.blockSize.quarter) - greenOffs
	
		// Green Cursor
		var greenOffs = -306; // Couldn't figure out how to pare this down like the others, but this figure works.
		if ($C.smallDisplay) {greenOffs = -229}
		offsX = ($C.markerPosition.x * $C.blockSize.half) + ($C.markerPosition.z * $C.blockSize.half);
		offsYtop = -($C.layerOffset.z * $C.blockSize.half) + ($C.markerPosition.z * $C.blockSize.quarter) + ($C.gridSize.y - $C.markerPosition.x * $C.blockSize.quarter) - greenOffs;
	
		this.ctx.fillStyle = '#0f0';
		this.ctx.beginPath();
	
		// Points 1-6, in order.
		this.ctx.lineTo(offsX + gr2, offsYtop + gr2);
		this.ctx.lineTo(offsX + gr1, offsYtop + gr4 + gr2);
		this.ctx.lineTo(offsX + gr2, offsYtop + gr1);
		this.ctx.lineTo(offsX, offsYtop + gr4 + gr2);
	
		this.ctx.closePath();
		this.ctx.fill();
	
		// Green Outline
		this.ctx.beginPath();
		this.ctx.moveTo(offsX + gr2, offsYtop);
		this.ctx.lineTo(offsX + gr1, offsYtop + gr4);
		this.ctx.lineTo(offsX + gr1, offsYtop + gr4 + gr2);
		this.ctx.lineTo(offsX + gr2, offsYtop + gr1);
		this.ctx.lineTo(offsX, offsYtop + gr4 + gr2);
		this.ctx.lineTo(offsX, offsYtop + gr4);
		this.ctx.closePath();
	
		this.ctx.strokeStyle = '#0f0';
		this.ctx.stroke();
		
		// Orange level outline.
		var levelOffs = 35 + $C.blockDims * $C.layerOffset.z * 0.5 + $C.edges.top;
		this.ctx.beginPath();
		this.ctx.moveTo($C.gridCorners[0].x - $C.edges.left, $C.gridCorners[0].y - levelOffs);
		this.ctx.lineTo($C.gridCorners[1].x - $C.edges.left, $C.gridCorners[1].y - levelOffs);
		this.ctx.lineTo($C.gridCorners[2].x - $C.edges.left, $C.gridCorners[2].y - levelOffs);
		this.ctx.lineTo($C.gridCorners[3].x - $C.edges.left, $C.gridCorners[3].y - levelOffs);
		this.ctx.closePath();
		
		this.ctx.globalAlpha = 1.0;
		this.ctx.strokeStyle = '#f90';
		this.ctx.stroke();
		
		// Clear display and draw all.
		this.drawAll();
	}
	
	this.drawAll = function () {
		this.displayCtx.clearRect(0, 0, $C.gridSize.x, $C.gridSize.y * 4);
		this.displayCtx.globalCompositeOperation = "source-over";
		this.displayCtx.drawImage(this.grids, 0, 0);
		
		if ($C.swatchActive) {
			this.displayCtx.drawImage(this.colors, 0, 0);
		}
		else {
			this.displayCtx.drawImage(this.blocks, 0, 0);
			// Quick and easy trick to make selection transparent.
			this.displayCtx.globalAlpha = 0.5;
			this.displayCtx.drawImage(this.selection, 0, 0);
			this.displayCtx.globalAlpha = 1.0;
		}
		
		// this.displayCtx.drawImage(this.renderer, 0, 0);
		this.displayCtx.drawImage(this.overlays, 0, 0);
	}
	
	this.clearBlocks = function () {
		context('blocks').clearRect(0, 0, $C.gridSize.x, $C.gridSize.y * 4);
	}
	
	this.clearSwatch = function () {
		context('colors').clearRect(0, 0, $C.gridSize.x, $C.gridSize.y * 4);
	}
	
	this.clearSelection = function () {
		context('selection').clearRect(0, 0, $C.gridSize.x, $C.gridSize.y * 4);
	}
}

var example1 =
"[[12,19,0,26624],[12,18,0,26624],[11,17,0,26624],[11,14,0,26624],[11,13,0,26624],[12,13,0,26624],[12,12,0,26624],[13,11,0,26624],[13,12,0,26624],[14,12,0,26624],[14,13,0,26624],[15,13,0,26624],[15,14,0,26624],[16,14,0,26624],[16,15,0,26624],[17,15,0,26624],[17,16,0,26624],[16,17,0,26624],[16,18,0,26624],[15,18,0,26624],[15,19,0,26624],[14,19,0,26624],[14,18,0,26624],[13,18,0,26624],[13,19,0,26624],[11,18,0,26624],[10,18,0,26624],[10,17,0,26624],[10,16,0,26624],[10,15,0,26624],[11,15,0,26624],[12,14,0,26624],[13,14,0,26624],[13,15,0,26624],[14,15,0,26624],[14,16,0,26624],[15,16,0,26624],[14,17,0,26624],[13,17,0,26624],[12,17,0,26624],[11,16,0,26624],[12,15,0,26624],[15,18,1,26624],[15,17,1,26624],[16,17,1,26624],[16,16,1,26624],[16,15,1,26624],[15,15,1,26624],[14,15,1,26624],[14,14,1,26624],[13,14,1,26624],[13,13,1,26624],[12,13,1,26624],[12,14,1,26624],[11,14,1,26624],[11,15,1,26624],[10,15,1,26624],[10,16,1,26624],[11,16,1,26624],[11,17,1,26624],[12,17,1,26624],[12,18,1,26624],[13,18,1,26624],[13,17,1,26624],[14,17,1,26624],[14,16,1,26624],[14,18,1,26624],[12,16,1,26624],[13,16,1,26624],[13,15,1,26624],[15,17,2,26624],[15,16,2,26624],[14,16,2,26624],[14,15,2,26624],[13,15,2,26624],[13,14,2,26624],[12,15,2,26624],[12,14,2,26624],[11,15,2,26624],[11,16,2,26624],[12,16,2,26624],[12,17,2,26624],[13,17,2,26624],[14,17,2,26624],[15,12,1,26624],[15,11,1,26624],[16,11,1,26624],[16,10,1,26624],[17,10,1,26624],[16,9,1,26624],[10,13,1,26624],[9,13,1,26624],[9,12,1,26624],[8,12,1,26624],[7,12,1,26624],[13,20,1,26624],[12,20,1,26624],[12,21,1,26624],[11,21,1,26624],[11,22,1,26624],[10,22,1,26624],[12,19,1,26624],[13,19,1,26624],[15,12,2,26624],[15,13,2,26624],[14,13,2,26624],[10,13,2,26624],[11,13,2,26624],[11,14,2,26624],[9,13,2,26624],[12,18,2,26624],[12,19,2,26624],[11,19,2,26624],[13,15,3,26624],[12,15,3,26624],[12,16,3,26624],[13,16,3,26624],[13,17,3,26624],[14,16,3,26624],[14,17,3,26624],[12,14,3,26624],[13,14,3,26624],[14,14,3,26624],[15,15,3,26624],[14,15,3,26624],[11,13,3,26624],[12,13,3,26624],[12,12,3,26624],[13,12,3,26624],[13,13,3,26624],[14,13,3,26624],[12,17,3,26624],[15,17,3,26624],[16,17,3,26624],[16,16,3,26624],[15,16,3,26624],[16,15,3,26624],[15,14,3,26624],[15,13,1,26624],[15,14,1,26624],[15,16,1,26624],[11,17,2,26624],[13,18,2,26624],[14,18,2,26624],[13,19,2,26624],[15,18,2,26624],[15,15,2,26624],[14,14,2,26624],[14,17,4,26624],[14,16,4,26624],[15,17,4,26624],[15,16,4,26624],[16,16,4,26624],[16,15,4,26624],[15,15,4,26624],[15,14,4,26624],[16,14,4,26624],[16,17,4,26624],[13,17,4,26624],[12,16,4,26624],[11,16,4,26624],[11,15,4,26624],[10,15,4,26624],[10,14,4,26624],[11,13,4,26624],[12,13,4,26624],[13,13,4,26624],[13,14,4,26624],[14,14,4,26624],[14,15,4,26624],[13,16,4,26624],[12,17,4,26624],[11,17,4,26624],[12,15,4,26624],[12,14,4,26624],[13,15,4,26624],[11,14,4,26624],[14,13,4,26624],[14,12,4,26624],[13,12,4,26624],[12,12,4,26624],[15,13,4,26624],[15,13,5,26624],[15,14,5,26624],[15,15,5,26624],[16,15,5,26624],[15,16,5,26624],[15,17,5,26624],[14,17,5,26624],[13,17,5,26624],[12,17,5,26624],[12,16,5,26624],[12,15,5,26624],[11,15,5,26624],[11,14,5,26624],[12,14,5,26624],[12,13,5,26624],[12,12,5,26624],[13,13,5,26624],[13,14,5,26624],[14,14,5,26624],[14,15,5,26624],[14,16,5,26624],[13,16,5,26624],[11,13,5,26624],[10,13,5,26624],[11,12,5,26624],[13,12,5,26624],[14,13,5,26624],[13,15,5,26624],[14,12,5,26624],[15,14,6,26624],[15,13,6,26624],[14,13,6,26624],[14,14,6,26624],[15,15,6,26624],[14,15,6,26624],[13,15,6,26624],[13,14,6,26624],[14,17,6,26624],[15,18,6,26624],[15,19,6,26624],[14,18,6,26624],[13,17,6,26624],[13,16,6,26624],[12,16,6,26624],[12,15,6,26624],[11,15,6,26624],[11,14,6,26624],[12,14,6,26624],[15,16,6,26624],[16,16,6,26624],[15,17,6,26624],[14,16,6,26624],[12,13,6,26624],[13,13,6,26624],[15,12,7,7040],[15,13,7,7040],[16,13,7,7040],[16,14,7,7040],[15,14,7,7040],[15,15,7,7040],[16,15,7,7040],[16,16,7,7040],[16,17,7,7040],[15,18,7,7040],[14,18,7,7040],[14,17,7,7040],[13,17,7,7040],[12,17,7,7040],[12,16,7,7040],[11,16,7,7040],[12,15,7,7040],[11,15,7,7040],[12,14,7,7040],[13,14,7,7040],[14,14,7,7040],[14,15,7,7040],[14,16,7,7040],[15,16,7,7040],[13,15,7,7040],[11,14,7,7040],[12,13,7,7040],[12,12,7,7040],[13,12,7,7040],[14,12,7,7040],[14,13,7,7040],[13,13,7,7040],[16,20,8,7040],[15,20,8,7040],[14,19,8,7040],[13,19,8,7040],[12,18,8,7040],[11,17,8,7040],[10,17,8,7040],[10,16,8,7040],[10,15,8,7040],[11,15,8,7040],[11,14,8,7040],[11,13,8,7040],[12,13,8,7040],[12,12,8,7040],[12,11,8,7040],[13,11,8,7040],[14,11,8,7040],[15,11,8,7040],[15,12,8,7040],[16,12,8,7040],[16,13,8,7040],[17,13,8,7040],[17,14,8,7040],[17,15,8,7040],[18,15,8,7040],[18,16,8,7040],[18,17,8,7040],[18,18,8,7040],[17,18,8,7040],[17,19,8,7040],[16,18,8,7040],[15,18,8,7040],[15,17,8,7040],[16,17,8,7040],[17,17,8,7040],[17,16,8,7040],[16,15,8,7040],[15,14,8,7040],[15,13,8,7040],[14,13,8,7040],[13,13,8,7040],[12,14,8,7040],[11,12,8,7040],[11,11,8,7040],[10,13,8,7040],[10,14,8,7040],[11,16,8,7040],[12,17,8,7040],[13,18,8,7040],[15,19,8,7040],[16,19,8,7040],[19,19,9,7040],[19,20,9,7040],[18,20,9,7040],[18,21,9,7040],[17,21,9,7040],[16,21,9,7040],[16,22,9,7040],[15,22,9,7040],[14,22,9,7040],[14,21,9,7040],[13,21,9,7040],[13,20,9,7040],[12,20,9,7040],[10,18,9,7040],[10,17,9,7040],[8,16,9,7040],[7,14,9,7040],[7,13,9,7040],[6,13,9,7040],[7,12,9,7040],[8,12,9,7040],[9,12,9,7040],[9,13,9,7040],[9,14,9,7040],[9,15,9,7040],[8,14,9,7040],[8,13,9,7040],[8,11,9,7040],[9,11,9,7040],[10,11,9,7040],[10,10,9,7040],[11,10,9,7040],[12,10,9,7040],[13,10,9,7040],[14,10,9,7040],[14,11,9,7040],[15,11,9,7040],[15,12,9,7040],[16,12,9,7040],[16,11,9,7040],[17,11,9,7040],[19,12,9,7040],[20,13,9,7040],[21,13,9,7040],[21,14,9,7040],[20,14,9,7040],[20,15,9,7040],[19,14,9,7040],[19,13,9,7040],[18,13,9,7040],[18,12,9,7040],[18,11,9,7040],[18,14,9,7040],[18,15,9,7040],[19,15,9,7040],[19,16,9,7040],[19,17,9,7040],[20,17,9,7040],[20,18,9,7040],[19,18,9,7040],[18,17,9,7040],[17,12,9,7040],[17,10,9,7040],[17,8,9,7040],[16,8,9,7040],[16,9,9,7040],[16,10,9,7040],[15,10,9,7040],[16,22,10,7040],[16,21,10,7040],[15,22,10,7040],[14,22,10,7040],[14,21,10,7040],[13,21,10,7040],[12,21,10,7040],[12,22,10,7040],[11,22,10,7040],[11,21,10,7040],[10,21,10,7040],[9,20,10,7040],[9,19,10,7040],[8,19,10,7040],[8,18,10,7040],[8,17,10,7040],[8,16,10,7040],[8,15,10,7040],[8,14,10,7040],[8,13,10,7040],[8,12,10,7040],[9,12,10,7040],[9,11,10,7040],[10,11,10,7040],[10,10,10,7040],[11,10,10,7040],[11,9,10,7040],[12,9,10,7040],[13,9,10,7040],[14,9,10,7040],[15,9,10,7040],[16,9,10,7040],[17,9,10,7040],[17,10,10,7040],[17,11,10,7040],[18,11,10,7040],[18,12,10,7040],[19,12,10,7040],[19,13,10,7040],[20,13,10,7040],[20,14,10,7040],[20,15,10,7040],[20,16,10,7040],[20,17,10,7040],[20,18,10,7040],[19,18,10,7040],[19,19,10,7040],[19,20,10,7040],[18,20,10,7040],[18,21,10,7040],[17,21,10,7040],[17,22,10,7040],[15,21,10,7040],[13,20,10,7040],[12,19,10,7040],[11,19,10,7040],[11,18,10,7040],[19,17,11,7040],[19,16,11,7040],[19,15,11,7040],[19,14,11,7040],[18,14,11,7040],[18,13,11,7040],[19,13,11,7040],[19,18,11,7040],[18,18,11,7040],[18,19,11,7040],[18,20,11,7040],[17,20,11,7040],[17,21,11,7040],[16,21,11,7040],[16,22,11,7040],[15,21,11,7040],[15,22,11,7040],[14,22,11,7040],[14,21,11,7040],[13,21,11,7040],[12,21,11,7040],[11,21,11,7040],[11,20,11,7040],[10,20,11,7040],[10,19,11,7040],[9,19,11,7040],[9,18,11,7040],[8,18,11,7040],[9,17,11,7040],[9,16,11,7040],[9,15,11,7040],[9,14,11,7040],[9,13,11,7040],[10,13,11,7040],[10,12,11,7040],[10,11,11,7040],[11,11,11,7040],[11,10,11,7040],[12,10,11,7040],[13,10,11,7040],[14,10,11,7040],[14,9,11,7040],[15,9,11,7040],[15,10,11,7040],[16,10,11,7040],[16,11,11,7040],[16,12,11,7040],[17,12,11,7040],[17,13,11,7040],[20,15,11,7040],[16,12,12,7040],[15,12,12,7040],[14,11,12,7040],[14,12,12,7040],[13,11,12,7040],[13,12,12,7040],[12,12,12,7040],[12,13,12,7040],[11,13,12,7040],[11,14,12,7040],[10,14,12,7040],[10,15,12,7040],[10,16,12,7040],[11,16,12,7040],[10,17,12,7040],[10,18,12,7040],[10,19,12,7040],[11,19,12,7040],[12,19,12,7040],[13,20,12,7040],[14,20,12,7040],[15,20,12,7040],[16,20,12,7040],[16,19,12,7040],[17,19,12,7040],[12,20,12,7040],[11,20,12,7040],[12,18,12,7040],[13,18,12,7040],[14,18,12,7040],[15,18,12,7040],[15,17,12,7040],[16,17,12,7040],[17,18,12,7040],[17,17,12,7040],[18,17,12,7040],[18,16,12,7040],[18,15,12,7040],[18,14,12,7040],[17,14,12,7040],[17,13,12,7040],[16,13,12,7040],[15,11,12,7040],[14,13,12,7040],[13,13,12,7040],[13,14,12,7040],[12,14,12,7040],[12,15,12,7040],[11,15,12,7040],[12,16,12,7040],[11,17,12,7040],[16,19,13,7040],[15,19,13,7040],[14,19,13,7040],[13,19,13,7040],[16,18,13,7040],[14,21,13,7040],[13,21,13,7040],[12,21,13,7040],[12,20,13,7040],[12,19,13,7040],[12,18,13,7040],[13,17,13,7040],[13,16,13,7040],[14,16,13,7040],[14,15,13,7040],[14,14,13,7040],[14,13,13,7040],[15,13,13,7040],[15,14,13,7040],[16,14,13,7040],[16,15,13,7040],[17,15,13,7040],[16,16,13,7040],[16,17,13,7040],[15,17,13,7040],[15,18,13,7040],[14,17,13,7040],[15,15,13,7040],[12,17,13,7040],[13,18,13,7040],[14,18,14,7040],[15,16,14,7040],[15,11,0,26624],[15,12,0,26624],[16,12,0,26624],[17,11,0,26624],[18,11,0,26624],[19,11,0,26624],[19,12,0,26624],[19,13,0,26624],[18,14,0,26624],[18,15,0,26624],[18,16,0,26624],[19,16,0,26624],[19,15,0,26624],[20,15,0,26624],[20,16,0,26624],[19,17,0,26624],[18,17,0,26624],[17,18,0,26624],[17,19,0,26624],[17,20,0,26624],[16,20,0,26624],[17,12,0,26624],[17,13,0,26624],[16,13,0,26624],[17,14,0,26624],[16,16,0,26624],[17,22,11,255],[20,13,11,255],[21,15,9,255],[8,15,9,255],[12,19,9,255],[11,19,9,255],[10,20,9,7040],[11,20,9,7040],[10,19,9,7040]]";

var example2 = "[[2,3,0,26624],[3,3,0,26624],[3,4,0,26624],[3,5,0,26624],[4,5,0,26624],[5,6,0,26624],[5,7,0,26624],[6,7,0,26624],[6,8,0,26624],[7,8,0,26624],[7,9,0,26624],[8,9,0,26624],[8,10,0,26624],[9,10,0,26624],[9,11,0,26624],[10,11,0,26624],[10,12,0,26624],[11,12,0,26624],[11,13,0,26624],[12,13,0,26624],[12,14,0,26624],[13,14,0,26624],[13,15,0,26624],[14,16,0,26624],[15,16,0,26624],[15,17,0,26624],[16,17,0,26624],[16,18,0,26624],[17,18,0,26624],[17,19,0,26624],[18,19,0,26624],[18,20,0,26624],[19,20,0,26624],[19,21,0,26624],[20,21,0,26624],[20,22,0,26624],[21,22,0,26624],[21,23,0,26624],[22,23,0,26624],[22,24,0,26624],[23,24,0,26624],[23,25,0,26624],[24,25,0,26624],[24,26,0,26624],[25,26,0,26624],[25,27,0,26624],[26,28,0,26624],[27,28,0,26624],[27,29,0,26624],[28,29,0,26624],[28,30,0,26624],[29,30,0,26624],[29,31,0,26624],[30,31,0,26624],[31,31,0,26624],[31,30,0,26624],[31,27,0,26624],[31,28,0,26624],[31,29,0,26624],[31,26,0,26624],[31,25,0,26624],[31,24,0,26624],[31,23,0,26624],[31,22,0,26624],[31,21,0,26624],[31,20,0,26624],[31,19,0,26624],[31,18,0,26624],[31,17,0,26624],[30,17,0,26624],[30,16,0,26624],[30,15,0,26624],[30,14,0,26624],[30,13,0,26624],[30,12,0,26624],[30,11,0,26624],[29,10,0,26624],[29,9,0,26624],[29,8,0,26624],[29,7,0,26624],[30,7,0,26624],[30,5,0,26624],[30,4,0,26624],[30,3,0,26624],[30,2,0,26624],[29,2,0,26624],[29,1,0,26624],[29,0,0,26624],[26,0,0,26624],[25,0,0,26624],[24,1,0,26624],[23,1,0,26624],[22,1,0,26624],[21,1,0,26624],[20,1,0,26624],[19,1,0,26624],[18,1,0,26624],[18,2,0,26624],[14,2,0,26624],[11,2,0,26624],[10,2,0,26624],[9,2,0,26624],[8,3,0,26624],[7,3,0,26624],[6,3,0,26624],[5,3,0,26624],[4,3,0,26624],[17,2,0,26624],[16,2,0,26624],[15,2,0,26624],[13,2,0,26624],[12,2,0,26624],[27,0,0,26624],[28,0,0,26624],[14,15,0,26624],[29,11,0,26624],[2,2,0,26624],[1,2,0,26624],[1,1,0,26624],[0,0,0,26624],[0,1,0,26624],[4,6,0,26624],[9,3,0,26624],[25,1,0,26624],[30,6,0,26624],[30,30,1,32386],[29,29,1,32386],[28,28,1,32386],[27,27,1,32386],[26,27,1,32386],[26,26,1,32386],[25,25,1,32386],[24,24,1,32386],[23,23,1,32386],[22,22,1,32386],[21,21,1,32386],[20,20,1,32386],[19,19,1,32386],[18,19,1,32386],[18,18,1,32386],[17,17,1,32386],[16,16,1,32386],[15,15,1,32386],[14,14,1,32386],[13,13,1,32386],[12,12,1,32386],[11,11,1,32386],[10,10,1,32386],[9,9,1,32386],[8,8,1,32386],[7,7,1,32386],[6,6,1,32386],[5,5,1,32386],[4,4,1,32386],[5,4,1,32386],[6,4,1,32386],[30,29,1,32386],[30,28,1,32386],[30,27,1,32386],[30,26,1,32386],[30,25,1,32386],[30,24,1,32386],[30,23,1,32386],[30,22,1,32386],[30,21,1,32386],[30,20,1,32386],[30,19,1,32386],[30,18,1,32386],[29,17,1,32386],[29,16,1,32386],[29,15,1,32386],[29,14,1,32386],[29,13,1,32386],[29,12,1,32386],[28,11,1,32386],[28,10,1,32386],[28,9,1,32386],[28,8,1,32386],[28,7,1,32386],[29,5,1,32386],[29,6,1,32386],[29,4,1,32386],[29,3,1,32386],[28,2,1,32386],[28,1,1,32386],[27,1,1,32386],[26,1,1,32386],[25,2,1,32386],[24,2,1,32386],[23,2,1,32386],[22,2,1,32386],[21,2,1,32386],[20,2,1,32386],[19,2,1,32386],[18,3,1,32386],[17,3,1,32386],[16,3,1,32386],[15,3,1,32386],[14,3,1,32386],[13,3,1,32386],[12,3,1,32386],[11,3,1,32386],[10,3,1,32386],[7,4,1,32386],[8,4,1,32386],[9,4,1,32386],[29,28,2,32673],[28,27,2,32673],[27,26,2,32673],[26,25,2,32673],[25,24,2,32673],[24,23,2,32673],[23,22,2,32673],[22,21,2,32673],[21,20,2,32673],[20,19,2,32673],[19,18,2,32673],[18,17,2,32673],[17,16,2,32673],[16,15,2,32673],[15,14,2,32673],[14,13,2,32673],[13,12,2,32673],[12,11,2,32673],[11,10,2,32673],[10,9,2,32673],[9,8,2,32673],[8,7,2,32673],[7,6,2,32673],[6,5,2,32673],[7,5,2,32673],[8,5,2,32673],[9,5,2,32673],[10,4,2,32673],[11,4,2,32673],[12,4,2,32673],[13,4,2,32673],[14,4,2,32673],[15,4,2,32673],[16,4,2,32673],[17,4,2,32673],[18,4,2,32673],[19,3,2,32673],[19,4,2,32673],[20,3,2,32673],[20,4,2,32673],[21,3,2,32673],[22,3,2,32673],[23,3,2,32673],[24,3,2,32673],[25,3,2,32673],[26,2,2,32673],[27,2,2,32673],[28,3,2,32673],[28,4,2,32673],[28,5,2,32673],[28,6,2,32673],[27,11,2,32673],[27,12,2,32673],[27,10,2,32673],[27,9,2,32673],[27,8,2,32673],[27,7,2,32673],[28,12,2,32673],[28,13,2,32673],[28,14,2,32673],[28,15,2,32673],[28,16,2,32673],[28,17,2,32673],[29,27,2,32673],[29,26,2,32673],[29,25,2,32673],[29,24,2,32673],[29,23,2,32673],[29,22,2,32673],[29,21,2,32673],[29,20,2,32673],[29,19,2,32673],[29,18,2,32673],[28,26,3,7040],[27,25,3,7040],[26,24,3,7040],[25,23,3,7040],[24,22,3,7040],[23,21,3,7040],[22,20,3,7040],[21,19,3,7040],[20,18,3,7040],[19,17,3,7040],[18,16,3,7040],[17,15,3,7040],[16,14,3,7040],[15,13,3,7040],[14,12,3,7040],[13,11,3,7040],[12,10,3,7040],[11,9,3,7040],[10,8,3,7040],[9,7,3,7040],[8,6,3,7040],[9,6,3,7040],[10,5,3,7040],[11,5,3,7040],[12,5,3,7040],[13,5,3,7040],[14,5,3,7040],[15,5,3,7040],[16,5,3,7040],[17,5,3,7040],[18,5,3,7040],[19,5,3,7040],[20,5,3,7040],[21,4,3,7040],[22,4,3,7040],[23,4,3,7040],[24,4,3,7040],[25,4,3,7040],[26,3,3,7040],[27,3,3,7040],[27,6,3,7040],[27,5,3,7040],[27,4,3,7040],[26,12,3,7040],[26,11,3,7040],[26,10,3,7040],[26,9,3,7040],[26,8,3,7040],[26,7,3,7040],[27,14,3,7040],[27,13,3,7040],[27,15,3,7040],[27,16,3,7040],[27,17,3,7040],[28,18,3,7040],[28,19,3,7040],[28,20,3,7040],[28,21,3,7040],[28,22,3,7040],[28,23,3,7040],[28,24,3,7040],[28,25,3,7040],[27,24,4,255],[27,23,4,255],[27,22,4,255],[27,21,4,255],[27,20,4,255],[27,19,4,255],[27,18,4,255],[26,17,4,255],[26,16,4,255],[26,14,4,255],[26,13,4,255],[26,15,4,255],[25,11,4,255],[25,9,4,255],[25,10,4,255],[25,8,4,255],[25,7,4,255],[26,6,4,255],[26,5,4,255],[26,4,4,255],[25,5,4,255],[24,5,4,255],[23,5,4,255],[22,5,4,255],[21,5,4,255],[25,12,4,255],[20,6,4,255],[19,6,4,255],[18,6,4,255],[17,6,4,255],[16,6,4,255],[15,6,4,255],[14,6,4,255],[13,6,4,255],[12,6,4,255],[11,6,4,255],[10,6,4,255],[10,7,4,255],[11,8,4,255],[12,9,4,255],[13,10,4,255],[14,11,4,255],[15,12,4,255],[16,13,4,255],[17,14,4,255],[18,15,4,255],[19,16,4,255],[20,17,4,255],[21,18,4,255],[22,19,4,255],[23,20,4,255],[24,21,4,255],[25,22,4,255],[26,23,4,255],[24,6,5,21530],[23,6,5,21530],[22,6,5,21530],[21,6,5,21530],[20,7,5,21530],[19,7,5,21530],[18,7,5,21530],[17,7,5,21530],[16,7,5,21530],[15,7,5,21530],[14,7,5,21530],[13,7,5,21530],[12,7,5,21530],[11,7,5,21530],[12,8,5,21530],[13,8,5,21530],[13,9,5,21530],[14,9,5,21530],[14,10,5,21530],[15,11,5,21530],[16,12,5,21530],[17,12,5,21530],[17,13,5,21530],[18,13,5,21530],[18,14,5,21530],[19,14,5,21530],[19,15,5,21530],[20,15,5,21530],[20,16,5,21530],[21,16,5,21530],[22,17,5,21530],[21,17,5,21530],[22,18,5,21530],[23,18,5,21530],[23,19,5,21530],[24,20,5,21530],[25,21,5,21530],[26,22,5,21530],[25,6,5,21530],[24,12,5,21530],[24,11,5,21530],[24,10,5,21530],[24,9,5,21530],[24,8,5,21530],[24,7,5,21530],[25,13,5,21530],[25,14,5,21530],[25,15,5,21530],[25,16,5,21530],[25,17,5,21530],[26,18,5,21530],[26,19,5,21530],[26,20,5,21530],[26,21,5,21530],[25,20,6,32056],[25,19,6,32056],[25,18,6,32056],[24,17,6,32056],[24,16,6,32056],[24,15,6,32056],[24,14,6,32056],[24,13,6,32056],[23,12,6,32056],[23,11,6,32056],[23,10,6,32056],[23,9,6,32056],[23,8,6,32056],[23,7,6,32056],[22,7,6,32056],[21,7,6,32056],[20,8,6,32056],[19,8,6,32056],[18,8,6,32056],[17,8,6,32056],[16,8,6,32056],[15,8,6,32056],[14,8,6,32056],[15,9,6,32056],[15,10,6,32056],[16,11,6,32056],[17,11,6,32056],[18,12,6,32056],[19,13,6,32056],[20,14,6,32056],[21,15,6,32056],[22,16,6,32056],[23,17,6,32056],[24,18,6,32056],[24,19,6,32056],[16,9,7,26624],[16,10,7,26624],[17,10,7,26624],[18,10,7,26624],[18,11,7,26624],[19,11,7,26624],[19,12,7,26624],[20,12,7,26624],[20,13,7,26624],[21,13,7,26624],[21,14,7,26624],[22,15,7,26624],[23,16,7,26624],[23,15,7,26624],[23,14,7,26624],[23,13,7,26624],[22,12,7,26624],[22,11,7,26624],[22,10,7,26624],[22,9,7,26624],[22,8,7,26624],[21,8,7,26624],[20,9,7,26624],[19,9,7,26624],[18,9,7,26624],[17,9,7,26624],[22,14,8,32386],[22,13,8,32386],[21,12,8,32386],[21,11,8,32386],[21,10,8,32386],[21,9,8,32386],[20,10,8,32386],[19,10,8,32386],[18,10,8,32386],[20,11,8,32386],[22,12,8,32386],[22,11,8,32386],[22,10,8,32386],[22,9,8,32386],[20,9,8,32386],[19,9,8,32386],[18,9,8,32386],[17,9,8,32386],[19,11,8,32386],[20,12,8,32386],[21,13,8,32386],[18,9,9,32673],[19,9,9,32673],[22,10,9,32673],[22,11,9,32673],[21,12,9,32673],[22,13,9,32673],[22,12,9,32673],[20,11,9,32673],[19,10,9,32673],[20,9,9,32673],[21,9,9,32673],[22,9,9,32673],[19,9,10,7040],[20,9,10,7040],[21,9,10,7040],[22,10,10,7040],[22,9,10,7040],[22,11,10,7040],[22,12,10,7040],[20,10,10,7040],[21,10,10,7040],[21,11,10,7040],[20,9,11,255],[21,9,11,255],[22,9,11,255],[22,10,11,255],[22,11,11,255],[21,10,11,255],[21,9,12,21530],[22,9,12,21530],[22,10,12,21530],[22,9,13,32056]]";

var example3 = "[[25,18,0,12735],[25,17,0,12735],[25,16,0,12735],[24,15,0,12735],[23,15,0,12735],[22,15,0,12735],[21,15,0,12735],[20,15,0,12735],[24,19,0,12735],[23,19,0,12735],[22,19,0,12735],[21,19,0,12735],[20,19,0,12735],[19,18,0,12735],[19,17,0,12735],[19,16,0,12735],[25,19,1,12735],[24,20,1,12735],[23,20,1,12735],[22,20,1,12735],[21,20,1,12735],[20,20,1,12735],[19,19,1,12735],[18,18,1,12735],[18,17,1,12735],[18,16,1,12735],[19,15,1,12735],[20,14,1,12735],[21,14,1,12735],[22,14,1,12735],[23,14,1,12735],[24,14,1,12735],[25,15,1,12735],[26,16,1,12735],[26,17,1,12735],[26,18,1,12735],[17,16,2,12735],[17,17,2,12735],[17,18,2,12735],[18,19,2,12735],[19,20,2,12735],[18,15,2,12735],[19,14,2,12735],[20,14,2,12735],[21,14,2,12735],[22,14,2,12735],[23,14,2,12735],[24,14,2,12735],[25,15,2,12735],[26,16,2,12735],[27,16,2,12735],[28,16,2,12735],[29,16,2,12735],[30,16,2,12735],[31,17,2,12735],[30,18,2,12735],[29,18,2,12735],[28,18,2,12735],[27,18,2,12735],[26,19,2,12735],[25,20,2,12735],[24,20,2,12735],[23,20,2,12735],[22,20,2,12735],[21,20,2,12735],[20,20,2,12735],[30,17,2,12735],[29,17,2,12735],[28,17,2,12735],[27,17,2,12735],[16,17,3,12735],[15,17,3,12735],[16,18,3,12735],[16,16,3,12735],[17,15,3,12735],[18,14,3,12735],[17,19,3,12735],[18,20,3,12735],[19,21,3,12735],[20,22,3,12735],[21,23,3,12735],[22,24,3,12735],[19,13,3,12735],[20,12,3,12735],[21,11,3,12735],[22,10,3,12735],[22,11,3,12735],[22,12,3,12735],[22,13,3,12735],[22,14,3,12735],[22,15,3,12735],[22,16,3,12735],[22,17,3,12735],[22,18,3,12735],[22,19,3,12735],[22,20,3,12735],[22,21,3,12735],[22,22,3,12735],[22,23,3,12735],[23,20,3,12735],[23,19,3,12735],[24,20,3,12735],[24,19,3,12735],[25,19,3,12735],[25,18,3,12735],[26,18,3,12735],[26,17,3,12735],[25,16,3,12735],[24,15,3,12735],[23,15,3,12735],[25,17,3,12735],[24,16,3,12735],[23,16,3,12735],[23,18,3,23583],[23,17,3,23583],[24,17,3,23583],[24,18,3,23583],[21,22,4,15519],[21,21,4,15519],[21,20,4,15519],[21,19,4,15519],[22,18,4,15519],[22,17,4,15519],[21,16,4,15519],[21,15,4,15519],[21,14,4,15519],[21,13,4,15519],[21,12,4,15519],[20,13,4,15519],[19,14,4,15519],[19,15,4,15519],[19,16,4,15519],[19,17,4,15519],[19,18,4,15519],[19,19,4,15519],[19,20,4,15519],[20,20,4,15519],[20,21,4,15519],[20,14,4,15519],[20,15,4,15519],[20,16,4,15519],[21,17,4,15519],[20,17,4,15519],[20,18,4,15519],[20,19,4,15519],[21,18,4,15519],[17,16,3,12735],[17,17,3,12735],[17,18,3,12735],[18,15,3,12735],[18,16,3,12735],[18,17,3,12735],[18,18,3,12735],[18,19,3,12735],[18,16,4,12575],[17,16,4,12575],[17,17,4,12575],[17,18,4,12575],[18,18,4,12575],[18,17,4,12575],[16,17,4,12575],[18,15,4,12575],[18,19,4,12575],[19,15,5,12575],[19,19,5,12575],[20,20,5,12575],[20,19,5,12575],[20,18,5,12575],[20,17,5,12575],[20,16,5,12575],[20,15,5,12575],[21,15,5,12575],[20,14,5,12575],[21,14,5,12575],[21,13,5,12575],[21,19,5,12575],[21,20,5,12575],[21,21,5,12575],[19,16,5,20511],[19,17,5,20511],[18,17,5,20511],[18,18,5,20511],[19,18,5,20511],[18,16,5,20511],[17,17,5,20511],[21,12,3,12735],[21,13,3,12735],[20,13,3,12735],[20,14,3,12735],[19,14,3,12735],[19,15,3,12735],[19,16,3,12735],[19,17,3,12735],[19,18,3,12735],[19,19,3,12735],[19,20,3,12735],[20,20,3,12735],[20,19,3,12735],[20,18,3,12735],[20,17,3,12735],[20,16,3,12735],[20,15,3,12735],[21,14,3,12735],[21,15,3,12735],[21,16,3,12735],[21,17,3,12735],[21,18,3,12735],[21,19,3,12735],[21,21,3,12735],[21,20,3,12735],[21,22,3,12735],[20,21,3,12735],[22,25,3,15519],[21,25,3,15519],[20,25,3,15519],[19,25,3,15519],[22,9,3,15519],[21,9,3,15519],[20,9,3,15519],[19,9,3,15519],[18,25,3,32056],[18,9,3,32056]]";

var example4 = "[[19, 12, 11, 23915],[17, 11, 13, 32734],[18, 7, 0, 15393],[19, 9, 1, 23618],[17, 7, 5, 23915],[18, 14, 10, 32701],[20, 16, 3, 23915],[19, 4, 6, 23915],[17, 12, 11, 23915],[16, 11, 13, 32734],[17, 17, 1, 23618],[18, 10, 12, 32701],[18, 11, 15, 32734],[18, 7, 2, 23915],[19, 6, 8, 32503],[18, 8, 10, 32503],[17, 15, 11, 23915],[17, 17, 0, 15393],[19, 8, 11, 23915],[18, 10, 13, 32701],[18, 18, 0, 15393],[20, 7, 2, 23618],[19, 8, 13, 32503],[16, 14, 12, 32734],[18, 15, 15, 23915],[19, 19, 2, 23915],[18, 4, 0, 15393],[19, 5, 6, 23915],[21, 10, 13, 32701],[18, 12, 15, 23915],[18, 9, 0, 15393],[17, 7, 7, 23915],[19, 9, 9, 32503],[18, 9, 13, 32503],[18, 10, 14, 32701],[19, 12, 15, 23915],[17, 19, 0, 15393],[18, 16, 2, 23915],[18, 9, 1, 15393],[20, 7, 3, 23915],[17, 8, 4, 23915],[20, 10, 14, 32701],[17, 16, 1, 23618],[17, 16, 2, 23915],[19, 9, 1, 15393],[19, 6, 3, 23915],[18, 5, 5, 23915],[20, 7, 7, 23915],[19, 6, 9, 23915],[19, 9, 14, 32503],[19, 10, 15, 32701],[17, 16, 3, 23915],[20, 7, 1, 23618],[19, 9, 7, 23915],[21, 17, 13, 32734],[20, 19, 1, 23618],[17, 7, 2, 23915],[20, 12, 11, 23915],[19, 16, 0, 15393],[18, 6, 2, 23915],[18, 8, 8, 32503],[19, 7, 10, 23915],[19, 8, 10, 23915],[21, 14, 13, 32734],[19, 6, 0, 15393],[18, 9, 8, 32503],[17, 10, 12, 32701],[20, 17, 1, 23618],[19, 8, 2, 23915],[17, 7, 1, 23618],[18, 8, 10, 23915],[19, 10, 12, 32701],[17, 13, 11, 32734],[19, 17, 0, 15393],[18, 7, 10, 23915],[17, 14, 11, 32734],[17, 15, 14, 23915],[17, 7, 0, 15393],[19, 9, 12, 23915],[16, 13, 12, 32734],[16, 14, 13, 32734],[19, 16, 15, 32734],[18, 19, 2, 23915],[19, 9, 4, 23915],[20, 7, 2, 23915],[18, 5, 4, 23915],[18, 6, 9, 23915],[18, 7, 9, 32503],[19, 13, 10, 32701],[16, 15, 12, 23915],[19, 9, 15, 32503],[18, 8, 12, 32503],[17, 19, 1, 23618],[18, 9, 1, 23618],[18, 9, 7, 23915],[16, 16, 12, 32734],[20, 8, 1, 23618],[18, 6, 8, 32503],[19, 10, 10, 32701],[18, 15, 10, 23915],[21, 17, 12, 32734],[18, 9, 12, 23915],[20, 18, 3, 23915],[18, 10, 11, 32701],[18, 16, 0, 23915],[20, 7, 4, 23915],[20, 7, 5, 23915],[17, 10, 11, 32701],[17, 18, 1, 23618],[17, 8, 2, 23915],[19, 6, 5, 23915],[19, 8, 10, 32503],[21, 16, 12, 32734],[18, 16, 0, 15393],[18, 5, 6, 23915],[20, 10, 11, 32701],[18, 12, 11, 23915],[18, 17, 0, 15393],[18, 19, 3, 23915],[19, 7, 0, 15393],[19, 6, 6, 23915],[18, 8, 9, 32503],[21, 13, 12, 32734],[19, 15, 15, 23915],[20, 19, 0, 15393],[20, 18, 2, 23915],[19, 4, 2, 23915],[19, 9, 3, 23915],[20, 8, 4, 23915],[18, 6, 7, 23915],[19, 7, 9, 32503],[21, 14, 12, 32734],[20, 17, 14, 32734],[18, 7, 10, 32503],[18, 10, 10, 32701],[18, 12, 10, 23915],[16, 17, 12, 32734],[18, 4, 1, 23618],[20, 16, 0, 15393],[19, 9, 10, 32503],[17, 10, 13, 32701],[18, 13, 15, 32734],[19, 8, 6, 23915],[18, 9, 11, 32503],[19, 14, 15, 32734],[17, 18, 0, 15393],[17, 17, 1, 32734],[19, 6, 2, 23618],[18, 7, 9, 32503],[19, 7, 11, 32503],[16, 11, 12, 32734],[17, 13, 14, 32734],[18, 6, 3, 23915],[20, 13, 14, 32734],[19, 19, 0, 15393],[20, 8, 1, 15393],[18, 6, 4, 23915],[19, 6, 10, 32503],[18, 9, 15, 32503],[18, 13, 10, 32701],[21, 15, 12, 23915],[21, 16, 13, 32734],[17, 8, 6, 23915],[19, 7, 8, 32503],[20, 10, 12, 32701],[18, 5, 0, 15393],[18, 9, 2, 23915],[20, 8, 6, 23915],[18, 7, 12, 32503],[17, 14, 14, 32734],[17, 19, 2, 23915],[19, 4, 0, 15393],[18, 5, 2, 23915],[17, 8, 3, 23915],[20, 16, 14, 32734],[18, 19, 0, 15393],[18, 4, 2, 23915],[19, 5, 5, 23915],[18, 11, 10, 32701],[19, 5, 4, 23915],[18, 9, 5, 23915],[19, 5, 8, 32503],[18, 8, 10, 32503],[19, 12, 10, 23915],[16, 12, 13, 23915],[19, 19, 1, 23618],[19, 8, 0, 15393],[17, 8, 0, 15393],[18, 5, 2, 23618],[20, 10, 13, 32701],[20, 19, 2, 23915],[19, 8, 8, 32503],[17, 16, 0, 15393],[19, 6, 2, 23915],[18, 7, 9, 23915],[18, 9, 14, 32503],[19, 11, 10, 32701],[16, 16, 13, 32734],[19, 9, 11, 32503],[20, 16, 1, 23618],[17, 8, 5, 23915],[18, 5, 8, 32503],[18, 6, 10, 32503],[19, 14, 10, 32701],[20, 17, 3, 23915],[17, 11, 11, 32734],[21, 13, 13, 32734],[19, 16, 1, 23618],[19, 7, 0, 23915],[18, 4, 2, 23618],[18, 5, 3, 23915],[20, 7, 6, 23915],[21, 11, 12, 32734],[20, 11, 14, 32734],[20, 18, 0, 15393],[20, 8, 0, 15393],[19, 5, 3, 23915],[20, 17, 2, 23915],[18, 8, 0, 15393],[20, 8, 3, 23915],[18, 9, 4, 23915],[17, 8, 7, 23915],[18, 9, 9, 32503],[18, 8, 13, 32503],[19, 10, 14, 32701],[17, 7, 4, 23915],[19, 6, 7, 23915],[19, 8, 14, 32503],[18, 10, 15, 32701],[17, 8, 1, 15393],[17, 8, 1, 23618],[19, 7, 10, 32503],[19, 8, 12, 32503],[18, 16, 3, 23915],[18, 10, 10, 32503],[17, 16, 14, 32734],[19, 9, 12, 23915],[19, 16, 3, 23915],[19, 5, 1, 23618],[18, 4, 6, 23915],[19, 10, 11, 32701],[21, 15, 13, 23915],[19, 19, 3, 23915],[19, 6, 1, 23618],[19, 6, 4, 23915],[20, 8, 5, 23915],[19, 15, 10, 23915],[21, 12, 13, 23915],[20, 19, 3, 23915],[20, 7, 0, 15393],[17, 12, 14, 23915],[18, 5, 1, 23618],[19, 7, 2, 23915],[17, 7, 6, 23915],[19, 11, 11, 32734],[20, 17, 0, 15393],[19, 9, 8, 32503],[20, 18, 1, 23618],[19, 8, 10, 32503],[21, 10, 12, 32701],[20, 13, 11, 32734],[16, 13, 13, 32734],[19, 4, 1, 23618],[18, 6, 6, 23915],[18, 7, 8, 32503],[21, 11, 13, 32734],[18, 16, 1, 23618],[17, 19, 3, 23915],[18, 6, 0, 15393],[19, 9, 6, 23915],[18, 7, 11, 32503],[21, 12, 12, 23915],[18, 14, 15, 32734],[17, 17, 2, 32734],[18, 6, 2, 23915],[17, 7, 3, 23915],[19, 8, 9, 32503],[18, 6, 5, 23915],[20, 8, 7, 23915],[18, 8, 14, 32503],[16, 17, 13, 32734],[19, 5, 0, 15393],[19, 5, 2, 23618],[18, 8, 11, 23915],[16, 12, 12, 23915],[17, 11, 14, 32734],[19, 13, 15, 32734],[20, 14, 14, 32734],[20, 16, 2, 23915],[19, 9, 0, 15393],[19, 5, 2, 23915],[18, 5, 7, 23915],[17, 10, 14, 32701],[18, 6, 1, 23618],[20, 8, 2, 23915],[20, 11, 11, 32734],[20, 12, 14, 23915],[19, 7, 12, 32503],[19, 10, 13, 32701],[18, 16, 15, 32734],[19, 18, 0, 15393],[17, 18, 2, 23915],[18, 9, 3, 23915],[19, 5, 7, 23915],[19, 9, 13, 32503],[19, 16, 2, 23915],[19, 4, 2, 23618],[18, 8, 2, 23915],[16, 10, 13, 32701],[20, 14, 11, 32734],[19, 11, 15, 32734],[19, 9, 5, 23915],[18, 9, 10, 32503],[16, 15, 13, 23915],[17, 17, 14, 32734],[18, 17, 0, 23915],[18, 19, 1, 23618],[19, 9, 2, 23915],[18, 9, 6, 23915],[19, 9, 10, 23915],[20, 15, 11, 23915],[20, 15, 14, 23915],[16, 10, 12, 32701]]";

var Examples = [example1, example2, example3, example4];/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for grid.js:
 * Contains grid-related functions; one for the math to setup the points used by the grids, then an SVG-based grid plotter, and then a canvas-based grid plotter.
 */

// The gridCoors function creates a static set of coordinates from which to base the canvas and SVG grids upon.
function gridCoors (side) {	
	var i = 0;

	// Grid loop builds an absolute position tile, then places it at a specific x/y position on the grid.
	for (var x = 0; x < $C.gridDims.c; x++) {
		for (var y = 0; y < $C.gridDims.r; y++) {
			var tileCoors;

			// Bottom side.
			var hexSide = [1, 2, 7, 6];
			tileCoors = {
				x: (x * $C.blockSize.half) + (y * $C.blockSize.half) + $C.offset.x,
				y: ((y * $C.blockSize.quarter) + ($C.gridSize.y - x * $C.blockSize.quarter)) + $C.offset.y
			};
			
			GridField['x-' + i] = {x: x, y: y, z: -1, coors: tileCoors};
			
			// Left side.
			var hexSide = [1, 7, 5, 6];
			tileCoors = {
				x: (x * $C.blockSize.half)  + $C.offset.x,
				y: ((y * $C.blockSize.half) + (-$C.gridSize.y - x * $C.blockSize.quarter)) + $C.offset.y
			};
			
			GridField['y-' + i] = {x: x, y: y, z: -1, coors: tileCoors};

			// Right side.
			var hexSide = [6, 7, 4, 5];
			tileCoors = {
				x: (x * $C.blockSize.half) + $C.gridSize.x / 2 + $C.offset.x,
				y: ((y * $C.blockSize.half) + (-$C.gridSize.y * 2 + x * $C.blockSize.quarter)) + $C.offset.y
			};

			GridField['z-' + i] = {x: x, y: y, z: -1, coors: tileCoors};

			i++;
		}
	}
}

// Will be an option if the SVG mouse events don't work as well.
function gridScreen () {
	
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
function drawGrid (side) {
	var gridContainer = document.getElementById('gridContainer');
	
	var i = 0;
	
	var square = [0,0,0,0];
	
	for (var x = 0; x < $C.gridDims.c; x++) {
		for (var y = 0; y < $C.gridDims.r; y++) {
			var tileCoors = GridField['x-' + i];
			var hexSide = [1, 2, 7, 6];
			
			var adjCoors = {
				x: tileCoors.coors.x + ($C.windowSize.x - $C.gridSize.x) / 2,
				y: tileCoors.coors.y + $C.windowSize.y - $C.gridSize.y * 2
			};
			
			var set = hexiso(adjCoors, $C.blockSize);
			
			if (x == 31 && y == 0) {
				square[0] = {x: set.x[1], y: set.y[1]};
			}
			else if (x == 0 && y == 0) {
				square[1] = {x: set.x[6], y: set.y[6]};
			}
			else if (x == 0 && y == 31) {
				square[2] = {x: set.x[7], y: set.y[7]};
			}
			else if (x == 31 && y == 31) {
				square[3] = {x: set.x[2], y: set.y[2]};
			}
			
			var tile = drawSet(hexSide, set, true);
			
			// Column, Row
			tile.setAttributeNS(null, 'c', x);
			tile.setAttributeNS(null, 'r', y);
			
			var blockID = 'x-' + i;
			tile.setAttributeNS(null, 'id', blockID);
			
			// Debug
			// tile.setAttributeNS(null, 'stroke', 'red');
			// tile.setAttributeNS(null, 'stroke-opacity', '0.3');
			
			gridContainer.appendChild(tile);
			
			i++;
		}
	}
	
	$C.gridCorners = square;
}

// Draws the grids using canvas.
// Lots of nested loops here. Individual loops for each grid.
function canvasGrid (side, mode) {
	var i = 0;
		
	for (var x = 0; x < $C.gridDims.c; x++) {
		for (var y = 0; y < $C.gridDims.r; y++) {
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
				
				// hexSet, offset, $C, closed, color, stroke
				canvasDrawSet(hexSet, offset,
					{closed: true, fill: fill, stroke: stroke, grid: true});
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
				
				canvasDrawSet(hexSet, offset,
					{closed: true, fill: fill, stroke: stroke, grid: true});
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
				
				canvasDrawSet(hexSet, offset,
					{closed: true, fill: fill, stroke: stroke, grid: true});
			}
			
			i++;
		}
	}
}

/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for input.js:
 * Event handlers and the functions they run.
 */

function InitEvents () {
	/* Event listeners */
	window.addEventListener('mousedown', function (evt) {
		Click(evt);
		mouseDown = true;
	}, false);
	
	window.addEventListener('mouseup', function (evt) {
		mouseDown = false;
	}, false);

	if (!$C.mouseMove) {
		window.addEventListener('mouseover', function (evt) {
			Hover(evt, 'in');
		}, false);

		window.addEventListener('mouseout', function (evt) {
			Hover(evt, 'out');
		}, false);
	}
	
	if ($C.mouseMove) {
		window.addEventListener('mousemove', function (evt) {
			MousePos(evt);
		}, false);
	}
	
	window.addEventListener('keydown', function (evt) {
		Key(evt);
	}, false);
	
	window.addEventListener('keyup', function (evt) {
		Key(evt);
	}, false);

	window.onresize = function() {
		if(initialized) {
			loggit('Resolution change detected, click refresh button.');
		}
		displayResized = true;
	}
}

// Handles click events from its corresponding event listener.
function Click (evt) {
	var target = evt.target;
	
	var inputs = [
		"gridUp",
		"gridDown",
		"rotLeft",
		"rotRight"
	];
	
	// References toolNames in ui.js.
	for (var i = 0, ii = $C.toolNames.length; i < ii; i++) {
		if (target.id == "toolButton" + toolNames[i] || target.id == "toolText" + toolNames[i]) {
			$C.tools[$C.toolMethods[i]]();
		}
	}
	
	for (var i = 0, ii = inputs.length; i < ii; i++) {
		if (target.id == inputs[i] + "Button" || target.id == inputs[i] + "Text") {
			$C.tools[inputs[i]]();
		}
	}
	
	// Color selection.
	if (target.id.substr(0,5) == "color") {
		if ($C.palette.faded) {
			$C.palette.remove(target);
		}
		else {
			// The last color is used to deselect the last color.
			$C.selected.lastColor = $C.selected.color;

			// Set the current color to the element's color ID.
			$C.selected.color = parseInt(target.getAttribute('colorID'));
			
			$C.tools.color();
		}
	}
	
	// Block placement (first click, and if only one single click)
	if ($C.selected.tool == "toolButtonDelete" && target.id.substr(0,2) == 'x-') {
		removeBlock(target);
	}
	else if ($C.selected.tool == "toolButtonSelect" && target.id.substr(0,2) == 'x-') {
		$C.selection.select(target);
	}
	else if ($C.swatchActive && target.id.substr(0,2) == 'x-') {
		pickColor(target);
	}
	else if (target.id.substr(0,2) == 'x-')
	{
		placeBlock(target);
	}
	
	// UI Elements
	if (target.id == 'alertButton' || target.id == 'alertButtonText') {
		Dialog.hide();
	}
	if (target.id == 'leftList') {
		loadModel(target.getAttribute('url'));
	}
}

// Gets hover events from its corresponding event listener, including whether the user hovered in or out of the object.
function Hover (evt, inout) {
	var target = null;
	
	if ($C.mouseMove) {
		target = evt;
	}
	else {
		target = evt.target;
	}
	// Place a block on the x-grid as long as the mouse is down and place it only when moving into the cell, otherwise the block would be placed twice.
	if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in" && $C.selected.tool.substr(0,5) == "color") {
		placeBlock(target);
	}
	else if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in" && $C.selected.tool == "toolButtonDelete") {
		removeBlock(target);
	}
	
	// Puts information about the position of the cursor over the grid into the markerPosition field in $C, allowing that to be used by the positionIndicator function.
	if (target.id.substr(0,2) == 'x-' && inout == "in") {
		$C.markerPosition.x = target.getAttribute("c");
		$C.markerPosition.z = target.getAttribute("r");
		$C.posInd.redraw();
	}
	
	// UI Elements
	if (target.id == 'leftList') {
		Dialog.highlight(target);
	}
}

// var shiftPressed;
var ex = 0;

function Key (evt) {
	ctrlPressed = evt.ctrlKey;
	
	// console.log(evt.keyCode);
	
	if (evt.type == "keydown") {
		if (!$C.titleFieldSelected) {
			// DKEY for delete.
			if (evt.keyCode == 68) {
				$C.tools.remove();
			}
			// CKEY for color cube.
			if (evt.keyCode == 67) {
				$C.tools.swatch();
			}
			// FKEY for fill.
			if (evt.keyCode == 70) {
				$C.tools.fill();
			}
			// SKEY for select.
			if (evt.keyCode == 83 && !ctrlPressed) {
				$C.tools.select();
			}
			// UP and DOWN arrows for changing Z level.
			if (evt.keyCode == 38) {
				$C.tools.gridUp();
			}
			if (evt.keyCode == 40) {
				$C.tools.gridDown();
			}
			// LEFT and RIGHT arrows for rotation.
			if (evt.keyCode == 37) {
				$C.tools.rotLeft();
			}
			if (evt.keyCode == 39) {
				$C.tools.rotRight();
			}
			// CTRL+SKEY for save.
			if (evt.keyCode == 83 && ctrlPressed) {
				$C.tools.save();
			}
			// CTRL+LKEY for load.
			if (evt.keyCode == 76 && ctrlPressed) {
				$C.tools.load();
			}
			// SHIFTKEY for toggle options.
			if (evt.keyCode == 16) {
				$C.palette.fade(true);
			}
			// ESCKEY or ENTER to hide dialogs.
			if (Dialog.showing) {
				if (evt.keyCode == 27 || evt.keyCode == 13) {
					Dialog.hide();
				}
			}
			// debug (RKEY)
			if (evt.keyCode == 82) {
				// $C.renderer.render();
				var temp = JSON.stringify(Field);
				Field = JSON.parse(temp);
				rebuild();
				loggit('Model rebuilt. (sorry!)');
			}
			// example (EKEY)
			if (evt.keyCode == 69) {
				if (ex < Examples.length) {
					Field = JSON.parse(Examples[ex]);
					ex++;
				}
				else {
					ex = 0;
					Field = JSON.parse(Examples[ex]);
					ex++;
				}
				rebuild();
				console.log('rebuilding model');
			}
		}
	}
	
	if (evt.type == "keyup") {
		// SHIFTKEY for toggle options.
		if (evt.keyCode == 16) {
			$C.palette.fade(false);
		}
	}
}

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

var Renderer = function () {
	this.canvas = document.getElementById('renderer');
	this.ctx = context('renderer');
	
	this.scale = 2;
	this.rectPoints = [];
	
	this.bufferMask = [];
	
	this.octree = [];
	this.scale = 32;
	this.depth = 0;
	
	this.buildOctree = function () {
		// First, find how deep the octrees should go. For a 32vx object, this is 5.
		this.depth = 0;
		var level = this.scale;
		while (level > 1) {
			level /= 2;
			this.depth++;
		}
		
		// Then, build your octree. Eight for the octants.
		this.octree = this.recursiveArray(this.depth, 8, []);
	}
	
	// This function works backwards, creating an array of eight leaves, then pushing several of those to a new array of nodes, recursively.
	this.recursiveArray = function (depth, leaves, array) {
		var temp = [];
		
		if (depth > 0) {
			for (var node = 0; node < leaves; node++) {
				temp.push(array);
			}
			return (this.recursiveArray(temp, depth - 1, leaves));
		}
		else {
			return array;
		}
	}
	
	this.scales = [];
	this.rscales = [];
	
	this.convertVoxels = function () {
		var octree = new Array(Field.length);
		
		for (var i = 0, ii = this.depth; i < ii; i++) {
			this.scales.push(Math.pow(2, i));
		}
		for (var i = this.depth - 1; i >= 0; i--) {
			this.rscales.push(Math.pow(2, i));
		}
		
		for (var i = 0, ii = Field.length; i < ii; i++) {
			// ind = new Array(6);
			// octree[i] = this.saveVoxel(Field[i], this.depth, ind);
			octree[i] = this.saveVoxel(Field[i], this.depth - 1, []);
		}
		
		this.octree = octree;
		console.log(octree);
	}
	
	this.iterations = 0;
	
	// Saves the voxel in the appropriate spot in the octree array.
	// Indices in the octree array, in order of scale.
	this.saveVoxel = function (vox, level, indices) {
		var x = vox[0];
		var y = vox[1];
		var z = vox[2];
		
		// var pos = {x: 0, y: 0, z: 0};
		var index = 0;
		
		if (level >= 0) {
			(x / this.scales[level] > this.rscales[level]) ? index += 1 : index += 0;
			(y / this.scales[level] > this.rscales[level]) ? index += 2 : index += 0;
			(z / this.scales[level] > this.rscales[level]) ? index += 4 : index += 0;
			
			// indices[level] = index;
			indices.push(index);
			console.log('level:' + level + ' scale:' + this.scales[level] + ' x: ' + x / this.scales[level] + ', ' + index);
			// console.log(level + ': ' + x + ', ' + y + ', ' + z);
			// console.log('x: ' + x / level > scale);
			// this.iterations++;
			// console.log('iterations: ' + this.iterations);
			return (this.saveVoxel(vox, level - 1, indices));
		}
		else {
			return indices;
		}
	}
	
	this.recursiveVoxels = function (vox, level) {
		if (level > 1) {
			
			return (this.recursiveVoxels(vox, level / 2));
		}
	}
	
	this.render = function () {
		var date0 = new Date();
		
		this.buildOctree();
		this.convertVoxels();
		
		var date1 = new Date();
		console.log('time: ' + (date1 - date0));
	}
	
	this.findDepthBuffer = function () {
		// find top Voxels
		
	}
	
	this.buildRectPoints = function () {
		var rectPoints = {x: 0, y: 0, z: 0, w: 0, h: 0, c: null};
		
		for (var i = 0, ii = Field.length; i < ii; i++) {
			rectPoints.x = Field[i][0] * this.scale;
			rectPoints.y = Field[i][1] * this.scale;
			rectPoints.z = Field[i][2] * this.scale;
			rectPoints.w = this.scale;
			rectPoints.h = this.scale;
			rectPoints.c = SwatchField[Field[i][3]][3];
			
			this.rectPoints.push(rectPoints);
		}
	}
	
	this.transformPoints = function () {
		
	}
	
	this.rectMask = [];
	
	this.renderRects = function () {
		// Create rectMask 2D array
		for (var i = 0; i < 64 * 64; i++) {
			// if () {
				this.rectMask.push(Math.floor(this.rectPoints[i].z));
			// }
		}
		
		var it = 0;
		
		for (var y = 0; y < 64; y++) {
			for (var x = 0; x < 64; x++) {
				this.rectMask[it]
			}
			
			it++;
		}
	}
	
	this.test = function () {
		var ctx = context('grids');
		ctx.fillStyle = 'orange';
		ctx.fillRect(0,0,3,3);
		var img = ctx.getImageData(0, 0, 3, 3);
		console.log(img);
	}
	
	this.pixrender = function () {
		this.clear();
		
		var color = {r: 255, g: 255, b: 255};
		var img = this.ctx.createImageData(this.canvas.width, this.canvas.height);
		var index = 0;
		
		for (var y = 0; y < 64; y++) {
			for (var x = 0; x < 64; x++) {
				for (var z = 0; z < 32; z++) {
					if (Voxel[Math.floor(x / 2)][Math.floor(y / 2)][z] != -1) {
						color = SwatchField[Field[Voxel[Math.floor(x / 2)][Math.floor(y / 2)][z]][3]][3];
					}
				}
				
				index = (x + y * 64) * 4;
				
				img.data[index + 0] = color.r;
				img.data[index + 1] = color.g;
				img.data[index + 2] = color.b;
				img.data[index + 3] = 255;
				
				color = {r: 255, g: 255, b: 255};
			}
		}
		
		this.ctx.putImageData(img, 0, 0);
	}
	
	this.clear = function () {
		this.ctx.clearRect(0, 0, 64, 64);
	}
}

var time0;

var SelectionVox = new Array();

var Selection = function () {
	// If a selection has been drawn, this is true.
	this.enabled = false;
	
	// Defines the bounds of selection.
	this.start = {x: 0, y: 0, z: 0};
	this.end = {x: 0, y: 0, z: 0};
	
	// This is so the begin is only drawn once.
	this.begin = true;
	
	this.area = {x: 0, y: 0, z: 0};
	
	this.selectionField = new Array();
	
	this.select = function (target) {
		time0 = new Date();
		
		this.enabled = true;
		
		if (this.begin) {
		 	this.start.x = parseInt(target.getAttributeNS(null, "c"));
			this.start.y = parseInt(target.getAttributeNS(null, "r"));
			this.start.z = $C.layerOffset.z;
			this.end.x = parseInt(target.getAttributeNS(null, "c"));
			this.end.y = parseInt(target.getAttributeNS(null, "r"));
			this.end.z = $C.layerOffset.z;
			this.begin = false;
		}
		else {
			this.end.x = parseInt(target.getAttributeNS(null, "c"));
			this.end.y = parseInt(target.getAttributeNS(null, "r"));
			this.end.z = $C.layerOffset.z;
		}
		
		this.draw();
	}
	
	this.deselect = function () {
		// Reset start and end values.
		this.start = {x: 0, y: 0, z: 0};
		this.end = {x: 0, y: 0, z: 0};
		// this.area = {x: 0, y: 0, z: 0};
		this.begin = true;
		
		// Clear canvas.
		$C.posInd.clearSelection();
		$C.posInd.redraw();
		
		// Make sure it's off.
		this.enabled = false;
		console.log('selection off');
	}
	
	this.draw = function () {
		$C.posInd.clearSelection();
		
		// Facilitates drawing of the array using canvasBlock occlusion.
		for (var x = -1; x < $C.gridDims.r + 1; x++) {
			SelectionVox[x] = new Array();
			for (var y = -1; y < $C.gridDims.r + 1; y++) {
			SelectionVox[x][y] = new Array();
				for (var z = -1; z < $C.gridDims.c + 1; z++) {
					SelectionVox[x][y][z] = -1;
				}
			}
		}
		
		var location = {x: 0, y: 0, z: 0};
		
		var i = 0;
		
		var xDiff = Math.abs(this.end.x - this.start.x);
		var yDiff = Math.abs(this.end.y - this.start.y);
		var zDiff = Math.abs(this.end.z - this.start.z);
		
		// This basically draws every block inside the selection area.
		
		var offset = {};
		
		for (var x = 0; x < xDiff + 1; x++) {
			for (var y = 0; y < yDiff + 1; y++) {
				for (var z = 0; z < zDiff + 1; z++) {
					if (this.begin) {
						location.x = this.start.x;
						location.y = this.start.y;
						location.z = this.start.z;
					}
					else {
						offset = {x: x, y: y, z: z};
						location = this.normalize(this.start, this.end, offset);
					}
					
					this.selectionField.push([location.x, location.y, location.z]);
				
					gridPosition = location.x * $C.gridDims.c + location.y;
					coors = GridField["x-" + gridPosition].coors;
					yellow = "rgb(255, 255, 0)";
					color = {left: yellow, right: yellow, top: yellow, inset: yellow};
					canvasBlock(coors, location, color);
					SelectionVox[x][y][z] = 1;
					i++;
				}
			}
		}
		
		$C.posInd.redraw();
		
		var time1 = new Date();
		console.log(xDiff + ", " + yDiff + ", run : " + i + " times.");
		
		loggit("Selected " + i + " blocks.");
		
		this.area = {x: xDiff, y: yDiff, z: zDiff};
	}
	
	this.fill = function () {
		var time2 = new Date();
		
		var diff = {}
		var norm = {};
		
		for (var z = 0; z < this.area.z; z++) {
			for (var y = -1; y < this.area.y; y++) {
				for (var x = this.area.x + 1; x > 0; x--) {
					diff = {x: x, y: y, z: z};
					norm = this.normalize(this.start, this.end, diff);
					Field.push([norm.x, norm.y, norm.z, $C.selected.color]);
					console.log(norm);
					Voxel[x][y][z] = Field.length - 1;
				}
			}
		}
		
		this.deselect();
		
		drawAllBlocks();
		$C.posInd.redraw();
		
		var time3 = new Date();
		
		console.log('Fill took: ' + (time3 - time2) + 'ms.');
	}
	
	this.remove = function () {
		
	}
	
	this.normalize = function (start, end, offset) {
		var location = {x: 0, y: 0, z: 0};
		
		if (start.x > end.x) {
			location.x = offset.x + end.x;
		}
		else {
			location.x = offset.x + start.x;
		}
		if (start.y > end.y) {
			location.y = offset.y + end.y;
		}
		else {
			location.y = offset.y + start.y;
		}
		if (start.z > end.z) {
			location.z = offset.z + end.z;
		}
		else {
			location.z = offset.z + start.z;
		}
		
		return location;
	}
}

function fillSelection () {
	
}

function removeSelection () {
	
}

/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for text.js:
 * Takes a message and outputs it to a debug box on the screen.
 * Because the box does not have a scroll bar, scrolling code had to be written.
 */

var svgNS = "http://www.w3.org/2000/svg";
var loggitLog = new Array();

function loggit (str) {
	var log = document.getElementById("debugText");
	
	var childCount = log.getElementsByTagName('tspan').length;

	var numLines = 5;
	
	if (childCount >= numLines){
		log.removeChild(log.firstChild);
	}
	
	var textElement = addtext(log, str);
	
	// Save all messages for later.
	loggitLog.push(str);
}

function addtext (element, str) {
	var textElement = document.createElementNS(svgNS, 'tspan');
	textElement.setAttributeNS(null, 'x', '7');
	textElement.setAttributeNS(null, 'dy', '15');

	textElement.textContent = str;

	element.appendChild(textElement);
	element.getElementsByTagName('tspan')[0].setAttributeNS(null, 'dy', 2);
	
	return textElement;
}

// Thanks to Matt Thommes: http://matthom.com/archive/2007/05/03/removing-all-child-nodes-from-an-element
function removetext (element) {
	if (element.hasChildNodes()) {
		while (element.childNodes.length >= 1) {
			element.removeChild(element.firstChild);
		}
	}
}

/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for tools.js:
 * Logic for selecting tools and their associated functions.
 */

// Top-side mode/settings buttons.
var Tools = function () {
	this.activate = function (toolName) {
		if ($C.selected.tool == "toolButton" + toolName)
		{
			this.selectColor();
		}
		else {
			document.getElementById($C.selected.tool).setAttributeNS(null, "stroke-opacity", "0.0");
			$C.selected.tool = "toolButton" + toolName;
			document.getElementById($C.selected.tool).setAttributeNS(null, "stroke-opacity", "1.0");
			loggit($C.selected.tool.substr(10,100) + " tool activated.");
		}
	}
	// For when the tool button is clicked again, to default to block placement.
	// Get the color swatch (its name corresponds to its color), then set its black outline to transparent,
	// making it appear deselected.
	this.selectColor = function () {
		// Deselect previous tool.
		if ($C.selected.lastColor != -1) {
			document.getElementById($C.selected.tool).setAttributeNS(null, "stroke-opacity", "0.0");
		}
		$C.selected.tool = "color" + $C.selected.color;
		document.getElementById($C.selected.tool).setAttributeNS(null, "stroke-opacity", "1.0");
	}
	
	// Save button.
	this.save = function () {
		saveField();
	}
	
	// Load button.
	this.load = function () {
		if (Dialog.showing) {
			Dialog.hide();
		}
		else {
			listFields();
		}
	}
	
	// Refresh button.
	this.refresh = function () {
		Update("refresh", {gridMode: "standard"});
		loggit("Canvas refreshed.");
	}
		
	// Remove button, its state can be toggled by the user.
	this.remove = function () {
		if ($C.selection.enabled) {
			$C.selection.remove();
		}
		else {
			this.activate("Delete");
		}
	}
	
	this.gridUp = function () {
		if($C.layerOffset.z < ($C.gridDims.r - 1)) {
			$C.layerOffset.z++;
			$C.posInd.redraw();
			// Raise the SVG grid.
			var gridOffset = -389;
			if ($C.smallDisplay) {gridOffset = -309};
			document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(-1,"
				+ (gridOffset - $C.layerOffset.z * $C.blockSize.half) + ")");
			
			// For Color Cube slicing.
			if ($C.swatchActive) {
				for (var s = 0; s < 1024; s++) {
					SwatchField[s + (($C.layerOffset.z) * 1024)][4] = true;
				}
				$C.posInd.clearSwatch();
				drawAllSwatch();
			}
			// For block slicing.
			else {
				for (var i = 0, ii = Field.length; i < ii; i++) {
					if (Field[i][2] == $C.layerOffset.z) {
						FieldVisible[i] = true;
					}
				}
				
				$C.posInd.clearBlocks();
				drawAllBlocks();
				$C.posInd.redraw();
			}
			
			loggit("Slice up to " + $C.layerOffset.z);
		}
	}
	this.gridDown = function () {
		if($C.layerOffset.z > 0) {
			$C.layerOffset.z--;
			$C.posInd.redraw();
			// Lower the SVG grid.
			var gridOffset = -389;
			if ($C.smallDisplay) {gridOffset = -309};
			document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(-1,"
				+ (gridOffset - $C.layerOffset.z * $C.blockSize.half) + ")");
			
			// For Color Cube slicing.
			if ($C.swatchActive) {
				for (var s = 0; s < 1024; s++) {
					SwatchField[s + (($C.layerOffset.z + 1) * 1024)][4] = false;
				}
				$C.posInd.clearSwatch();
				drawAllSwatch();
			}
			// For block slicing.
			else {
				for (var i = 0, ii = Field.length; i < ii; i++) {
					if (Field[i][2] > $C.layerOffset.z) {
						FieldVisible[i] = false;
					}
				}
				
				$C.posInd.clearBlocks();
				drawAllBlocks();
				$C.posInd.redraw();
			}
			
			loggit("Slice down to " + $C.layerOffset.z);
		}
	}
	
	this.color = function () {
		this.selectColor();
		// loggit("Selected color is: " + $C.palette[$C.selected.color][3] + ".");
	}
	
	this.swatch = function () {
		if ($C.swatchActive) {
			this.activate("Colors");
			closeColorSwatch();
			loggit("Color Cube closed.");
		}
		else {
			this.activate("Colors");
			fillColorSwatch();
		}
	}
	
	this.rotLeft = function () {
		if (!$C.swatchActive) {
			rotate(1);
		}
	}
	
	this.rotRight = function () {
		if (!$C.swatchActive) {
			rotate(0);
		}
	}
	
	this.select = function () {
		this.activate("Select");
		// Toggle off.
		if ($C.selection.enabled) {
			$C.selection.deselect();
		}
	}
	
	this.fill = function () {
		if ($C.selection.enabled) {
			$C.selection.fill();
			loggit('Selection fill.');
		}
		else {
			this.activate("Fill");
		}
		
		loggit('Fill tool not yet implemented.');
	}
}

var rotation = 0;

function rotate (direction) {
	var location = new Object();
	
	// This function works on both the grid and the color cube.
	if ($C.swatchActive) {
		initVoxels(Swatch);
	}
	else {
		initVoxels(Voxel);
	}
	
	var x = 0;
	var y = 0;
	var z = 0;
	
	var Fx = 0;
	var Fy = 0;
	
	if ($C.swatchActive) {
		Fld = SwatchField;
	}
	else {
		Fld = Field;
	}
	
	var ang = (90 * Math.PI) / 180;
	
	if (!direction) {
		ang = (-90 * Math.PI) / 180;
	}

	// This is where the magic happens.
	for (var i = 0, ii = Fld.length; i < ii; i++) {
		
		// Field coordinates.
		Fx = Fld[i][0];
		Fy = Fld[i][1];
		z = Fld[i][2];
		
		// Translate coordinates over one in order to compensate for the zero origin issue.
		Fx++;
		Fy++;
		
		// A lovely matrix transformation.
		x = Math.round(Fx * Math.cos(ang) - Fy * Math.sin(ang));
		y = Math.round(Fx * Math.sin(ang) + Fy * Math.cos(ang));
		
		// To keep blocks from going off-grid, put them on the other side.
		if (x < 0) {
			x = ($C.gridDims.c) + x;
		}
		
		if (y < 0) {
			y = ($C.gridDims.r) + y;
		}
		
		// More compensation for zero origin issue.
		if (direction) {
			y--;
		}
		else {
			x--;
		}
		
		// Assign color. Works with both old and new color systems.
		var color = Fld[i][3];
		var visibility = false;
		
		if ($C.swatchActive) {
			visibility = Fld[i][4];
		}

		// Add to respective field, but voxel doesn't need to be added to color cube.
		if ($C.swatchActive) {
			Fld[i] = [x, y, z, color, visibility];
		}
		else {
			Fld[i] = [x, y, z, color];
		}
		Voxel[x][y][z] = Fld[i][3];
	}
	
	// Tell which field to put back into (cube or grid), and their associated functions.
	if ($C.swatchActive) {
		SwatchField = Fld;
		$C.posInd.clearSwatch();
		drawAllSwatch();
	}
	else {
		Field = Fld;
		$C.posInd.clearBlocks();
		drawAllBlocks();
	}
	
	$C.posInd.redraw();
	
	// True for left, False for right.
	if (direction) {	
		if (rotation < 3) {
			rotation++;
		}
		else {
			rotation = 0;
		}
		loggit("Rotated left to " + rotation * 90 + " degrees.");
	}
	else {
		if (rotation > 0) {
			rotation--;
		}
		else {
			rotation = 3;
		}
		loggit("Rotated right to " + rotation * 90 + " degrees.");
	}
}

/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for ui.js:
 * Organizes a static user interface layout based upon window size and absolute positioning, but with proportions so that the interface looks similar from window to window.
 * Contains some flawed animation code that needs to be deprecated.
 */

var canvases = [
	'grids',
	'blocks',
	'overlays',
	'display',
	'debug',
	'colors',
	'selection'
];

var toolNames = [
	"Load",
	"Save",
	"Fill",
	"Select",
	"Colors",
	"Delete",
]

function moveElement (name, operation) {
	var element = document.getElementById(name);
	
	var str = "";
	
	if (operation.move) {
		str += "translate(" + operation.move.x + "," + operation.move.y + ")";
		if (operation.skewX || operation.skewY) {
			str += ",";
		}
	}
	if (operation.skewY) {
		str += "skewY(" + operation.skewY + ")";
		if (operation.skewX) {
			str += ",";
		}
	}
	if (operation.skewX) {
		str += "skewX(" + operation.skewX + ")";
	}

	element.setAttributeNS(null, "transform", str);
	
	if (operation.height) {
		element.setAttributeNS(null, "height", operation.height);
	}
	if (operation.width) {
		element.setAttributeNS(null, "width", operation.width);
	}
}

function drawUI () {
	// Nanoblok logo text
	moveElement('logoText', {skewY: -$C.isoAngle});
		
	// Set viewport height.
	moveElement('grid', {height: $C.windowSize.y - 5});
	// var gridElement = document.getElementById('grid');
	// gridElement.setAttributeNS(null, "height", $C.windowSize.y - 5);
	
	// Set positions and dimensions of all canvases.
	for (var i = 0, ii = canvases.length; i < ii; i++) {
		var effectsElement = document.getElementById(canvases[i]);
		effectsElement.setAttributeNS(null, "height", $C.gridSize.fullY + 2);
		effectsElement.setAttributeNS(null, "width", $C.gridSize.x);
		effectsElement.style.top = $C.edges.top - $C.gridSize.y * 2 - 34 + "px";
		effectsElement.style.left = $C.edges.left + "px";
	}
	
	// Position SVG grid.
	var gridOffset = -389;
	if ($C.smallDisplay) {gridOffset = -309};
	moveElement('gridContainer', {move: {x: -1, y: gridOffset}});
	
	// Position debug / status.
	moveElement('statusContainer', {move: {x: $C.edges.left, y: ($C.edges.top - $C.gridSize.y - 145)}});
	
	// Position buttons on the top.
	moveElement('sideButtonsTop', {move: {x: $C.center.x + 5, y: $C.edges.top - $C.gridSize.y * 2 - 121}});
	
	// Position arrows on the left side.
	moveElement('sideButtonsLeft', {move: {x: $C.edges.left - 25, y: $C.edges.top - $C.gridSize.y - 20}});

	// Position axis labels.
	moveElement('yAxis', {move: {x: $C.edges.left + $C.gridSize.x / 4, y: $C.edges.top + $C.gridSize.y * 1.5},  skewY: 26.565, skewX: -45});
	moveElement('xAxis', {move: {x: $C.edges.left + $C.gridSize.x / 2 + $C.gridSize.x / 4 - 20, y: $C.edges.top + $C.gridSize.y * 1.5 + 10}, skewY: -26.565, skewX: 45});

	// Position color palette.
	moveElement("sideColorsRight", {move: {x: $C.edges.right + 40, y: $C.edges.top - $C.gridSize.y - 9}});
	
	// Make color palette from default colors.
	$C.palette.draw();
	
	// Draw toolbar. Won't work with numbers greater than 10.
	for (var i = 0; i < 6; i++) {
		var x = 0;
		var y = 0;
		
		if(i % 2) {x = 30 * i - 30} else {x = 30 * i};
		if(i % 2) {y = 0} else {y = 38};
		
		// Create a rect and give it all its attributes.
		var toolButton = document.createElementNS(svgNS, 'rect');
		toolButton.setAttributeNS(null, "id", "toolButton" + $C.toolNames[i]);
		toolButton.setAttributeNS(null, "x", x);
		toolButton.setAttributeNS(null, "y", y);
		toolButton.setAttributeNS(null, "height", 30);
		toolButton.setAttributeNS(null, "width", 52);
		toolButton.setAttributeNS(null, "rx", 3);
		toolButton.setAttributeNS(null, "transform", "skewY(26.565)");
		
		// Same for that tool's text.
		var toolText = document.createElementNS(svgNS, 'text');
		toolText.setAttributeNS(null, "id", "toolText" + $C.toolNames[i]);
		toolText.setAttributeNS(null, "x", x + 4);
		toolText.setAttributeNS(null, "y", y + 24);
		toolText.setAttributeNS(null, "fill", "white");
		toolText.setAttributeNS(null, "fill-opacity", "1");
		toolText.setAttributeNS(null, "stroke", "none");
		toolText.setAttributeNS(null, "transform", "skewY(26.565)");
		toolText.textContent = toolNames[i];
		
		var sideButtonsTop = document.getElementById("sideButtonsTop");
		sideButtonsTop.appendChild(toolButton);
		sideButtonsTop.appendChild(toolText);
	}
	
	var renderOffset = 96;
	if($C.smallDisplay) {renderOffset = 20};
	moveElement('renderDisplay', {move: {x: $C.edges.right - renderOffset, y: $C.edges.fullTop}});
	var rendererCanvas = document.getElementById('renderer');
	
	rendererCanvas.setAttributeNS(null, "height", 64);
	rendererCanvas.setAttributeNS(null, "width", 64);
	rendererCanvas.style.left = $C.edges.right - renderOffset + "px";
	rendererCanvas.style.top = $C.edges.fullTop + "px";
	
	// If it's a small display, the size of the debug box should be smaller.
	if ($C.smallDisplay) {
		document.getElementById('debugBox').setAttributeNS(null, "width", 234);
	}
	
	// Position rotation buttons.
	// moveElement('rotLeftButton', {move: {x: $C.edges.right - 96, y: $C.edges.fullTop}});
	
	// Move save dialog into position.
	var savePos = {x: $C.edges.left + $C.gridSize.x / 2 + 15, y: $C.edges.fullTop - 125};
	
	var saveDialog = document.getElementById('dialogSave');
	saveDialog.style.posLeft = savePos.x + 75;
	saveDialog.style.posTop = savePos.y;
	
	moveElement('saveBG', {move: {x: savePos.x, y: savePos.y}, skewX: -116.565});
	
	moveElement('dialogLeft', {move: {x: $C.edges.left + 30, y: $C.edges.fullTop + $C.gridSize.y / 2 + 70},  skewY: -26.565, height: $C.gridSize.y * 2 - 40, width: $C.gridSize.x / 2 - 30});
	moveElement('alertText', {move: {x: $C.edges.left + $C.gridSize.x / 2 - 110, y: $C.edges.fullTop + $C.gridSize.y + 90},  skewY: -26.565, height: $C.gridSize.y - 40, width: $C.gridSize.x / 4 - 30});
	moveElement('alertButton', {move: {x: $C.edges.left + $C.gridSize.x / 2 + 3, y: $C.edges.fullTop + $C.gridSize.y + 27},  skewY: 26.565, height: 30, width: 100});
	moveElement('alertButtonText', {move: {x: $C.edges.left + $C.gridSize.x / 2 + 3, y: $C.edges.fullTop + $C.gridSize.y + 27},  skewY: 26.565, height: 30, width: 100});
}

