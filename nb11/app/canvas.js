define([
	'app/colors',
	'app/utils'
],
function (colors, utils) {
	var canvas = {};

	canvas.init = function () {
		// Grab all canvas elements present in the document
		canvas.els = document.getElementById('nb').getElementsByTagName('canvas');

		// Adjust the canvas for high-DPI displays
		canvas.els[0].setAttribute("width", window.innerWidth * window.devicePixelRatio);
		canvas.els[0].setAttribute("height", window.innerHeight * window.devicePixelRatio);
		canvas.els[0].style.width = window.innerWidth + 'px';
		canvas.els[0].style.height = window.innerHeight + 'px';

		// Get context from canvases
		canvas.ctx = [];

		for (var i = 0, ii = canvas.els.length; i < ii; i++) {
			canvas.ctx[i] = canvas.els[i].getContext('2d');
		}

		// Initialize canvas image objects
		canvas.img = [];

		// zBuffer Arrays
		canvas.buf = [];
		canvas.buf[0] = [];

		// lineBuffer
		canvas.lineBuffer = [];
	};

/*	function initBuffer () {
		canvas.buf[0];
	}*/

	// Render
	canvas.simpleDraw = function (voxels, size, offsetX, offsetY) {
		var width = canvas.els[0].width,
			height = canvas.els[0].height,
			index = 0,
			img = canvas.img[0],
			data = img.data,
			x = 0, y = 0,
			color = [],
			voxel = [],
			arraySize = width * height * 4,
			vw = 32, vh = 32,
			sx = 0, sy = 0;

		for (var v = 0, vv = voxels.length; v < vv; v++) {
			// Gather coordinate information
			voxel = voxels[v];
			x = voxel[1];
			y = 32 - voxel[2];

			// Get color data from swatch lookup
			color = colors.swatch[voxel[3]];

			for (sy = 0; sy < size; sy++) {
				for (sx = 0; sx < size; sx++) {
					// Calculate index
					index = ((
						((x + offsetX * y) * size + sx) + 
						((y + offsetY * x) * size + sy) * width
					) | 0) * 4; // Bitwise floor, then advance by four (colors)
					
					if (index >= arraySize)
						break;

					// Set pixel data, times size
					data[index] = color[0];
					data[index + 1] = color[1];
					data[index + 2] = color[2];
					data[index + 3] = 255;
				}
			}
		}

		img.data = data;
		canvas.ctx[0].putImageData(img, 0, 0);
	};

	// http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
	canvas.line = function (x0, y0, x1, y1) {
		var dx = Math.abs(x1-x0),
			dy = Math.abs(y1-y0),
			sx = (x0 < x1) ? 1 : -1,
			sy = (y0 < y1) ? 1 : -1,
			err = dx-dy,
			width = canvas.els[0].width;

		while(true){
			// Put our pixels into a lineBuffer object with pixel indices as keys.
			canvas.lineBuffer.push(y0 * width + x0);

			if ((x0==x1) && (y0==y1)) break;

			var e2 = 2*err;

			if (e2>-dy){
				err -= dy;
				x0  += sx;
			}

			if (e2 < dx){
				err += dx;
				y0  += sy;
			}
		}
	}

	// Digital Differential Analyzer, DDA. Ported to JS by CQ.
	canvas.dda = function (x0, y0, x1, y1) {
		var Dx = x1 - x0,
			Dy = y1 - y0,
			steps = 0,
			k = 0,
			xincr = 0.0, yincr = 0.0,
			x = x0, y = y0;
			ax = Math.abs(Dx), ay = Math.abs(Dy),
			width = canvas.els[0].width;

		if (ax > ay)
			steps = ax;
		else
			steps = ay;

		xincr = Dx / steps;
		yincr = Dy / steps;

		// console.log(steps, x, y, xincr, yincr, width);

		for (k = 0; k < steps; k++) {
			x += xincr;
			y += yincr;
			canvas.lineBuffer.push(y * width + x | 0);
		}
	}

	canvas.drawPoly = function (points) {
		var x0 = 0, y0 = 0,
			x1 = 0, y1 = 0,
			ctx = canvas.ctx[0];

		// Fill polygon first.
		ctx.beginPath();
		ctx.moveTo(points[0], points[1]);

		for (var p = 0, pp = points.length; p < pp; p += 2) {
			ctx.lineTo(points[p], points[p + 1]);

			if (p == pp - 2) {
				x0 = points[0];
				y0 = points[1];
				x1 = points[p];
				y1 = points[p + 1];
			}
			else {
				x0 = points[p];
				y0 = points[p + 1];
				x1 = points[p + 2];
				y1 = points[p + 3];
			}

			canvas.dda(x0, y0, x1, y1);
		}

		ctx.fill();

		// Draw indices computed by line().
		canvas.drawIndices(4);
	}

	canvas.drawIndices = function (pxsize) {
		var lineBuffer = canvas.lineBuffer,
			line = [],
			img = canvas.ctx[0].getImageData(0, 0, canvas.els[0].width, canvas.els[0].height),
			data = img.data,
			index = 0,
			bufferindex = 0,
			width = canvas.els[0].width,
			ylast = 0,
			x = 0, y = 0,
			x0 = width + 1, x1 = -1,
			bufflen = lineBuffer.length;
	
		// console.log(lineBuffer[406080]);

		while (bufflen--) {
			for (y = 0; y < pxsize; y++) {
				for (x = 0; x < pxsize; x++) {
					bufferindex = lineBuffer[bufflen];
					index = y * width + bufferindex + x;
					index *= 4;
					data[index] 	= 255;
					data[index + 1] = 0;
					data[index + 2] = 0;
					data[index + 3] = 255;
				}
			}
		}

		img.data = data;
		canvas.ctx[0].putImageData(img, 0, 0);
	}

	canvas.zBuffer = function(voxels, direction) {
		var voxel = [];

		for (var v = 0, vv = voxels.length; v < vv; v++) {
			voxel = voxels[v];


		}
	}

	canvas.init();

	return canvas;
})