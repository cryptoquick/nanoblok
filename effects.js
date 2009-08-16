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

function tileHover (target, inout) {
	var init0 = new Date();
	
//	window.clearInterval(fadeInterval);
	var tile = document.getElementById(target.id);
	
	if (inout == 'in') {
		var bbox = tile.getBBox();
		canvasDrawTile(bbox.x, bbox.y);
	//	tile.setAttributeNS(null, 'stroke', '#aaa');
	}
/*	if (inout == 'out') {
		tile.setAttributeNS(null, 'fill', '#ddd');
	//	tile.setAttributeNS(null, 'stroke', '#aaa');
	}*/
	
//	fadeInterval = window.setInterval("fadeOut()", 25);
	
	var init1 = new Date();
	loggit(target.id + ': ' + target.getAttribute('c') + ', ' + target.getAttribute('r') + '. ' + (init1 - init0) + 'ms.');
}

function canvasDrawTile (x, y) {
	var ctx = context('effects');
	var size = 25;
	var tile = hexiso(x, y);
	
	// Grid styles
	ctx.fillStyle   = 'orange';
//	ctx.strokeStyle = '#777';
//	ctx.lineWidth   = 1.5;
	// Grid transforms
	ctx.beginPath();
	ctx.moveTo(tile.x[1], tile.y[1]);
	ctx.lineTo(tile.x[2], tile.y[2]);
	ctx.lineTo(tile.x[7], tile.y[7]);
	ctx.lineTo(tile.x[6], tile.y[6]);
	ctx.closePath();
	ctx.fill();
	
//	ctx.globalAlpha = 0.5;
	
	ctx.save();
//	ctx.strokeRect(x, y, size, size);
	
//	ctx.fillRect(x * size, y * size, size, size);
//	ctx.strokeRect(x * size, y * size, size, size);
}

function fadeOut () {
	var ctx = context('effects');

	// Make the grid background
	var gr1 = 800;
	var gr2 = gr1 / 2;
	var gr4 = gr1 / 4;
	
	var offsY = 21;

	ctx.fillStyle   = '#ddd';
	ctx.beginPath();
	ctx.moveTo(gr2, 0 + offsY);
	ctx.lineTo(gr1, gr4 + offsY);
	ctx.lineTo(gr2, gr2 + offsY);
	ctx.lineTo(0, gr4 + offsY);
	ctx.closePath();
	ctx.fill();
	ctx.scale(16, 16);

	// Not sure...
	ctx.globalCompositeOperation = 'lighter';
}