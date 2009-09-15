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

function tileHover (target, inout, offset, blockSize) {
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

function canvasDrawTile (bbox, offset, blockSize, hexSide, color) {
	var ctx = context('effects');
//	var size = 25;
	var tile = hexiso(bbox, blockSize);

//	ctx.scale(1, 1);

	// Grid styles
	ctx.strokeStyle = '#aaa';
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
	
	ctx.globalAlpha = .75;
}

// Draws background grid.
function canvasBG (blockSize, gridDims, gridSize, offset, edges, side) {
	var ctx = context('effects');

	// Grid dimensions
	var gr1 = gridSize.x;
	var gr2 = gr1 / 2;
	var gr4 = gr1 / 4;
	
	var offsY = offset.y - 29;

//	ctx.globalCompositeOperation = 'lighter';
	
	ctx.scale(1, 1);
//	ctx.strokeStyle = '#333';
	
	if (side == "bottom") {
		ctx.fillStyle = '#eee';
		ctx.beginPath();
		ctx.moveTo(gr2 + offset.x, 0 + offsY);
		ctx.lineTo(gr1 + offset.x, gr4 + offsY);
		ctx.lineTo(gr2 + offset.x, gr2 + offsY);
		ctx.lineTo(0 + offset.x, gr4 + offsY);
	}
	if (side == "left") {
		ctx.fillStyle = '#ddd';
		ctx.beginPath();
		ctx.moveTo(gr2 + offset.x, offsY - gridSize.y * 2);
		ctx.lineTo(gr2 + offset.x, gridSize.y - gr4 + offsY);
		ctx.lineTo(0 + offset.x, offsY + gr4);
		ctx.lineTo(0 + offset.x, offsY - gridSize.y);
	}
	if (side == "right") {
		ctx.fillStyle = '#ccc';
		ctx.beginPath();
		ctx.moveTo(gr2 + offset.x, offsY - gridSize.y * 2);
		ctx.lineTo(gr1 + offset.x, offsY - gr4);
		ctx.lineTo(gr1 + offset.x, offsY + gr4);
		ctx.lineTo(gr2 + offset.x, offsY);
	}
	ctx.closePath();
	ctx.fill();
	ctx.save();
	
	if (side == "bottom") {
		canvasGrid(gridDims, gridSize, blockSize, offset, "bottom");
	}
	if (side == "left") {
		canvasGrid(gridDims, gridSize, blockSize, offset, "left");
	}
	if (side == "right") {
		canvasGrid(gridDims, gridSize, blockSize, offset, "right");
	}
}

function canvasGrid (gridDims, gridSize, blockSize, offset, side, mode) {
	var i = 0;
		
	for (var x = 0; x < gridDims.c; x++) {
		for (var y = 0; y < gridDims.r; y++) {
			if (side == "bottom") {
				var hexSide = [1, 2, 7, 6];
				var tile = GridField["x-" + i].coors;
				
				if (mode == "standard") {
					tileColor = '#eee';
				}
				if (mode == "number") {
					var tileColor = "rgb(" + (255 - i / 4) + ", " + (255 - i / 4) + ", " + (255 - i / 4) + ")";
				}
				
				canvasDrawTile(tile, offset, blockSize, hexSide, tileColor);
			}
			if (side == "left") {
				var hexSide = [1, 7, 5, 6];
				var tile = GridField["y-" + i].coors;
				
				if (mode == "standard") {
					tileColor = '#ddd';
				}
				if (mode == "number") {
					var tileColor = "rgb(" + (255 - i / 4) + ", " + (255 - i / 4) + ", " + (255 - i / 4) + ")";
				}
				
				canvasDrawTile(tile, offset, blockSize, hexSide, tileColor);
			}
			if (side == "right") {
				var hexSide = [6, 7, 4, 5];
				var tile = GridField["z-" + i].coors;
				
				if (mode == "standard") {
					tileColor = '#ccc';
				}
				if (mode == "number") {
					var tileColor = "rgb(" + (255 - i / 4) + ", " + (255 - i / 4) + ", " + (255 - i / 4) + ")";
				}
				
				canvasDrawTile(tile, offset, blockSize, hexSide, tileColor);
			}
			
			i++;
		}
	}
}

function attachBlock(position, blockSize) {
	blockID = 'block-' + blockTick;
	blockTick++;
//	bbox = voxelBBox(position);
	bbox = targetElement.getBBox();
	color = 'bla';
//	offset = voxelBBox(position.x + axis.x, position.x + axis.y, position.z + axis.z - 1);
	blockBlank = makeObject(bbox, blockSize); //offset.x, offset.y);
	block = setColor(blockBlank, color);
	block.setAttributeNS(null, 'id', blockID);
//	block.setAttributeNS(null, 'block-color', color);
//	blockOrder(target, block);
	SVGRoot.appendChild(block);
	voxelCoordinates = blockRecord(blockID, position);
//	loggit('Block placed on the grid at ' + voxelCoordinates.x + ', ' + voxelCoordinates.y);
}

function canvasBlock(position, blockSize) {
	canvasDrawTile (coors, offset, blockSize, hexSide, color)
}