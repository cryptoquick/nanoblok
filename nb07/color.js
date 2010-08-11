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
	
	this.remove = function (position) {
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

