/* SVG Effects */

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

var fadeInterval;

function tileHover (target, inout, commonVars) {
	var init0 = new Date();
	
//	window.clearInterval(fadeInterval);
	var tile = document.getElementById(target.id);
	
	if (inout == 'in') {
	//	var bbox = tile.getBBox();
	//	canvasDrawTile(bbox, offset, blockSize);
	//	tile.setAttributeNS(null, 'stroke', '#aaa');
	}
	if (inout == 'out') {
	//	canvasBG(offset);
	//	tile.setAttributeNS(null, 'stroke', '#aaa');
	}
	
	var init1 = new Date();
	loggit(target.id + ': ' + target.getAttribute('c') + ', ' + target.getAttribute('r') + '. ' + (init1 - init0) + 'ms.');
}

function canvasDrawTile (bbox, commonVars, hexSide, color, stroke) {
	var ctx = context('effects');
//	var size = 25;
	var tile = hexiso(bbox, commonVars);

//	ctx.scale(1, 1);

	// Grid styles
	ctx.strokeStyle = stroke;
	ctx.fillStyle = color;
	
	var offsY = 35;

	// Grid transforms
	ctx.beginPath();
	ctx.moveTo(tile.x[hexSide[0]], tile.y[hexSide[0]] - offsY);
	ctx.lineTo(tile.x[hexSide[1]], tile.y[hexSide[1]] - offsY);
	ctx.lineTo(tile.x[hexSide[2]], tile.y[hexSide[2]] - offsY);
	ctx.lineTo(tile.x[hexSide[3]], tile.y[hexSide[3]] - offsY);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.globalAlpha = 1;
}

function canvasDrawSet (hexSet, offset, commonVars, settings) {
	var ctx = context('effects');
	ctx.globalAlpha = 1;
	ctx.strokeStyle = settings.stroke;
	if (settings.fill !== false) {
		ctx.fillStyle = settings.fill;
	}
	
	var hexSpot = hexSet.pop();
	var coorSet = hexiso(offset, commonVars);
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
	
	ctx.stroke();
	if (settings.fill !== false) {
		ctx.fill();
	}
}

// Draws background grid.
function canvasBG (commonVars) {
	var ctx = context('effects');

	// Grid dimensions
	var gr1 = commonVars.gridSize.x;
	var gr2 = gr1 / 2;
	var gr4 = gr1 / 4;
	
	var offsY = commonVars.offset.y - 29;

//	ctx.globalCompositeOperation = 'lighter';
	
	ctx.scale(1, 1);
//	ctx.strokeStyle = '#333';
	
	if (side == "bottom") {
		ctx.fillStyle = '#eee';
		ctx.beginPath();
		ctx.moveTo(gr2 + commonVars.offset.x, 0 + offsY);
		ctx.lineTo(gr1 + commonVars.offset.x, gr4 + offsY);
		ctx.lineTo(gr2 + commonVars.offset.x, gr2 + offsY);
		ctx.lineTo(0 + commonVars.offset.x, gr4 + offsY);
	}
	if (side == "left") {
		ctx.fillStyle = '#ddd';
		ctx.beginPath();
		ctx.moveTo(gr2 + commonVars.offset.x, offsY - commonVars.gridSize.y * 2);
		ctx.lineTo(gr2 + commonVars.offset.x, commonVars.gridSize.y - gr4 + offsY);
		ctx.lineTo(0 + commonVars.offset.x, offsY + gr4);
		ctx.lineTo(0 + commonVars.offset.x, offsY - commonVars.gridSize.y);
	}
	if (side == "right") {
		ctx.fillStyle = '#ccc';
		ctx.beginPath();
		ctx.moveTo(gr2 + commonVars.offset.x, offsY - commonVars.gridSize.y * 2);
		ctx.lineTo(gr1 + commonVars.offset.x, offsY - gr4);
		ctx.lineTo(gr1 + commonVars.offset.x, offsY + gr4);
		ctx.lineTo(gr2 + commonVars.offset.x, offsY);
	}
	ctx.closePath();
	ctx.fill();
	ctx.save();
	
	if (side == "bottom") {
		canvasGrid(commonVars, "bottom");
	}
	if (side == "left") {
		canvasGrid(commonVars, "left");
	}
	if (side == "right") {
		canvasGrid(commonVars, "right");
	}
}

// Lots of nested loops here. Individual loops for each grid.
function canvasGrid (commonVars, side, mode) {
	var i = 0;
		
	for (var x = 0; x < commonVars.gridDims.c; x++) {
		for (var y = 0; y < commonVars.gridDims.r; y++) {
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
				
				// hexSet, offset, commonVars, closed, color, stroke
				canvasDrawSet(hexSet, offset, commonVars,
					{closed: true, fill: fill, stroke: stroke});
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
				
				canvasDrawSet(hexSet, offset, commonVars,
					{closed: true, fill: fill, stroke: stroke});
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
				
				canvasDrawSet(hexSet, offset, commonVars,
					{closed: true, fill: fill, stroke: stroke});
			}
			
			i++;
		}
	}
	
	var blockDims = commonVars.blockSize.full * commonVars.gridDims.c; // Size of blocks / tiles.
	var blockSize = {
		full: blockDims,
		half: blockDims / 2,
		third: blockDims / 2 + blockDims / 4,
		quarter: blockDims / 4
	}
	
	var bigCommonVars = commonVars;
	bigCommonVars.blockSize = blockSize;
	
	var upperLeft = {x: commonVars.edges.left, y: (commonVars.edges.top - commonVars.gridSize.y * 2)};
	canvasDrawSet([1, 2, 3, 4, 5, 6], upperLeft, bigCommonVars,
		{closed: true, fill: false, stroke: "#aaa"});
}

function attachBlock (position, commonVars) {
	blockID = 'block-' + blockTick;
	blockTick++;
//	bbox = voxelBBox(position);
	bbox = targetElement.getBBox();
	color = 'bla';
//	offset = voxelBBox(position.x + axis.x, position.x + axis.y, position.z + axis.z - 1);
	blockBlank = makeObject(bbox, commonVars.blockSize); //offset.x, offset.y);
	block = setColor(blockBlank, color);
	block.setAttributeNS(null, 'id', blockID);
//	block.setAttributeNS(null, 'block-color', color);
//	blockOrder(target, block);
	SVGRoot.appendChild(block);
	voxelCoordinates = blockRecord(blockID, position);
//	loggit('Block placed on the grid at ' + voxelCoordinates.x + ', ' + voxelCoordinates.y);
}

function canvasBlock (position, commonVars) {
	canvasDrawTile (bbox, commonVars, [1, 6, 7, 2], color);
	
	var upperLeft = {x: commonVars.edges.left, y: (commonVars.edges.top - commonVars.gridSize.y * 2)};
	canvasDrawSet([1, 2, 3, 4, 5, 6], upperLeft, bigCommonVars,
		{closed: true, fill: false, stroke: "#aaa"});
}

function colorBlock (color) {
	var color = palette[3]; // kludge
	var colorR = color[0];
	var colorG = color[1];
	var colorB = color[2];
	var colorLeft = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
	var colorRight = "rgb(" + (colorR + 20) + ", " + (colorG + 20) + ", " + (colorB + 20) + ")";
	var colorTop = "rgb(" + (colorR + 40) + ", " + (colorG + 40) + ", " + (colorB + 40) + ")";
	var colorLines = "rgb(" + (colorR + 50) + ", " + (colorG + 50) + ", " + (colorB + 50) + ")";
}
