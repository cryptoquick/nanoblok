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
	if ($C.swatchInit == false) {
		loggit("Initializing Color Array");
		for (var x = -1; x < $C.gridDims.r + 1; x++) {
			Swatch[x] = new Array();
			for (var y = -1; y < $C.gridDims.r + 1; y++) {
			Swatch[x][y] = new Array();
				for (var z = -1; z < $C.gridDims.c + 1; z++) {
					if (x > -1 && x < $C.gridDims.c &&
						y > -1 && y < $C.gridDims.c &&
						z > -1 && z < $C.gridDims.c) {
						color = {
							r: (z + 1) * 8,
							g: 256 - (y + 1) * 8,
							b: (x + 1) * 8
						};
							
						Swatch[x][y][z] = color;
						SwatchField.push([x, y, z, color]);
					}
					else {
						Swatch[x][y][z] = -1;
					}
				}
			}
		}
		$C.swatchInit = true;
	}
}

function fillColorSwatch () {
	$C.swatchActive = true;
	
	if ($C.swatchComplete == false) {
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
	
		loggit("Drawing Color Cube");
		// Run the swatch function in such a way that the browser can render once each level is drawn.
		if ($C.animating == false) {
			time0 = new Date();
			$C.animating = true;
			t = setInterval(buildColorSwatch, 1);
		}
		else {
			loggit("Animation already being run!");
		}
	}
	else {
		loggit("Displaying Color Array");
		$C.swatchActive = true;
		$C.layerOffset.z = 30;
		$C.tools.gridUp();
	}
}

var h = 0;

function buildColorSwatch () {
	var gridPosition = 0;
	var coors = new Object();
	
	if (h >= 32) {
		clearInterval(t);
		time1 = new Date();
		loggit("Color Cube drawn in " + (time1 - time0) + " ms.");
		$C.animating = false;
		$C.swatchComplete = true;
		// SwatchGhost = new Array();
		$C.layerOffset.z = 30;
		$C.tools.gridUp();
		h = 0;
	}
	
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	if ($C.animating || $C.swatchComplete == false) {
		for (var w = 0; w < 32; w++) {
			for (var l = 0; l < 32; l++) {
				blockColor = colorBlockNew(Swatch[h][l][w]);
			
				location = {x: l, y: w, z: h};
			
				gridPosition = l * $C.gridDims.c + w;
				coors = GridField["x-" + gridPosition].coors;
			
				SwatchGhost[location.x][location.y][location.z] = 1;
			
				canvasBlock(coors, location, blockColor);
			}
		}
	
		$C.posInd.redraw();
		h++;
	}
}

function drawAllSwatch () {
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	var gridPosition = 0;
	var coors = new Object();
	
	for (var i = 0; i < SwatchField.length; i++) {
		location = {x: SwatchField[i][0], y: SwatchField[i][1], z: SwatchField[i][2]};
		gridPosition = location.x * $C.gridDims.c + location.y;
		coors = GridField["x-" + gridPosition].coors;
		color = colorBlockNew(SwatchField[i][3]);
		canvasBlock(coors, location, color);
	}
}

function closeColorSwatch () {
	$C.swatchActive = false;
	$C.animating = false;
	$C.layerOffset.z = 1;
	$C.tools.gridDown();
	SwatchGhost = new Array();
}

