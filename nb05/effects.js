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
		var bbox = tile.getBBox();
		canvasDrawTile(bbox.x, bbox.y, offset, blockSize);
	//	tile.setAttributeNS(null, 'stroke', '#aaa');
	}
	if (inout == 'out') {
	//	canvasBG(offset);
	//	tile.setAttributeNS(null, 'stroke', '#aaa');
	}
	
	var init1 = new Date();
	loggit(target.id + ': ' + target.getAttribute('c') + ', ' + target.getAttribute('r') + '. ' + (init1 - init0) + 'ms.');
}

function canvasDrawTile (x, y, offset, blockSize) {
	var ctx = context('effects');
	var size = 25;
	var tile = hexiso({x: x, y: y - 35}, blockSize);

	ctx.scale(1, 1);

	// Grid styles
//	ctx.fillStyle = 'red';

	// Grid transforms
	ctx.beginPath();
	ctx.moveTo(tile.x[1], tile.y[1]);
	ctx.lineTo(tile.x[2], tile.y[2]);
	ctx.lineTo(tile.x[7], tile.y[7]);
	ctx.lineTo(tile.x[6], tile.y[6]);
	ctx.closePath();
	ctx.fill();
	
	ctx.globalAlpha = 0.5;
}

// Draws background grid.
function canvasBG (gridSize, offset, edges, side) {
	var ctx = context('effects');

	// Grid dimensions
	var gr1 = gridSize.x;
	var gr2 = gr1 / 2;
	var gr4 = gr1 / 4;
	
	var offsY = offset.y - 29;

//	ctx.globalCompositeOperation = 'lighter';
	
	ctx.scale(1, 1);
	ctx.strokeStyle = '#333';
	
	if (side == "bottom") {
		ctx.fillStyle   = '#eee';
		ctx.beginPath();
		ctx.moveTo(gr2 + offset.x, 0 + offsY);
		ctx.lineTo(gr1 + offset.x, gr4 + offsY);
		ctx.lineTo(gr2 + offset.x, gr2 + offsY);
		ctx.lineTo(0 + offset.x, gr4 + offsY);
	}
	if (side == "left") {
		ctx.fillStyle   = '#ddd';
		ctx.beginPath();
		ctx.moveTo(gr2 + offset.x, offsY - gridSize.y * 2);
		ctx.lineTo(gr2 + offset.x, gridSize.y - gr4 + offsY);
		ctx.lineTo(0 + offset.x, offsY + gr4);
		ctx.lineTo(0 + offset.x, offsY - gridSize.y);
	}
	if (side == "right") {
		ctx.fillStyle   = '#ccc';
		ctx.beginPath();
		ctx.moveTo(gr2 + offset.x, offsY - gridSize.y * 2);
		ctx.lineTo(gr1 + offset.x, offsY - gr4);
		ctx.lineTo(gr1 + offset.x, offsY + gr4);
		ctx.lineTo(gr2 + offset.x, offsY);
	}
	ctx.closePath();
	ctx.fill();
	ctx.save();
}