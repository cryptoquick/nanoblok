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

/*function buildColorSwatch () {
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
	
	l = 0;
	w = 0;
	
	if ($C.animating || $C.swatchComplete == false) {
		for (var i = 0; i < 1023; i++) {
			blockColor = colorBlockNew(SwatchField[i * (h + 1)][3]);
		
			location = {x: l, y: w, z: h};
		
			gridPosition = l * $C.gridDims.c + w;
			coors = GridField["x-" + gridPosition].coors;
		
			SwatchGhost[location.x][location.y][location.z] = 1;
		
			canvasBlock(coors, location, blockColor);
			
			l = i % 32;
			w = (l * i) % 32;
			
			// console.log(l + ", " + w + ", " + h);
		}
	
		$C.posInd.redraw();
		h++;
	}
}*/

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
	
	console.log("Swatch: " + runs);
	
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

