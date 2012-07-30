define([
	'app/colors',
	'app/utils'
],
function (colors, utils) {
	var canvas = canvas || {};

	canvas.init = function () {
		// Grab all canvas elements present in the document
		canvas.els = document.getElementById('nb').getElementsByTagName('canvas');

		// Adjust the canvas for high-DPI displays
		canvas.width = window.innerWidth,
		canvas.height = window.innerHeight;

		if (window.devicePixelRatio) {
			canvas.width *= window.devicePixelRatio;
			canvas.height *= window.devicePixelRatio;
		}

		canvas.els[0].setAttribute("width", canvas.width);
		canvas.els[0].setAttribute("height", canvas.height);
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
		canvas.fillBounds = {};
	};

	// Digital Differential Analyzer, DDA. Ported to JS by CQ.
	canvas.dda = function (x0, y0, x1, y1, dims) {
		var dx = (x1 - x0), // Distance
			dy = (y1 - y0),
			steps = 0, k = 0,	// Steps / Iterations
			xincr = 0.0, yincr = 0.0, // Increment per step
			x = x0, y = y0; // Start
			ax = Math.abs(dx), ay = Math.abs(dy), // |distance|
			by = []; // For fill bounds

		// Get the most steps, in order to draw the diagonals correctly
		if (ax >= ay)
			steps = ax;
		else
			steps = ay; // Not sure when this 'fix' will become a bug...

		// Determine step increments
		xincr = dx / steps;
		yincr = dy / steps;

		// Debug
		// console.log(steps, xincr, yincr);

		canvas.lineBuffer.push(x | 0, y | 0);

		// Loop~
		for (k = 0; k < steps; k++) {
			x += xincr;
			y += yincr;
			canvas.lineBuffer.push(x | 0, y | 0);

			// Fill Bounds
			if (by = canvas.fillBounds[y]) {
				if (by[0] > x)
				canvas.fillBounds[y][1] = x;
			}
			else {
				canvas.fillBounds[y] = [dims.bx0, dims.bx1];
			}
		}
	}

	canvas.drawPolygons = function (gons, dims, color) {
		var x0 = 0, y0 = 0,
			x1 = 0, y1 = 0,
			p = 0, gon = 0,
			plen = 0,
			points = [];

		for (gon = 0, gong = gons.length; gon < gong; gon++) {
			points = gons[gon];
			plen = points.length;
			for (p = 0, pp = plen; p < pp; p+=2) {
				x0 = points[(p + 0) % plen] / dims.pxsize | 0;
				y0 = points[(p + 1) % plen] / dims.pxsize | 0;
				x1 = points[(p + 2) % plen] / dims.pxsize | 0;
				y1 = points[(p + 3) % plen] / dims.pxsize | 0;

				canvas.dda(x0, y0, x1, y1, dims);
			}
		}
		
		// Draw indices computed by line().
		canvas.drawIndices(dims, color);
	}

	canvas.fillPoly = function (points, color) {
		var ctx = canvas.ctx[0];
		ctx.beginPath();
		ctx.moveTo(points[0], points[1]);

		for (var p = 0, pp = points.length; p < pp; p += 2) {
			ctx.lineTo(points[p], points[p + 1]);
		}

		ctx.fillStyle = 'rgba(' + color.join(',') + ')';
		ctx.fill();
	}

	canvas.drawIndices = function (dims, color) {
		function imgMethod (x, y, w, h) {
			if (dims.clear)
				return canvas.ctx[0].createImageData(w, h);
			else
				return canvas.ctx[0].getImageData(x, y, w, h);
		}

		// Bounds needs some padding.
		dims.bounds.bx0 -= dims.offset * 4;
		dims.bounds.bx1 += dims.offset * 4;
		dims.bounds.by0 -= dims.offset * 4;
		dims.bounds.by1 += dims.offset * 4;

		var halfOffset = dims.pxsize / 2,
			img = imgMethod(
				dims.bounds.bx0,
				dims.bounds.by0,
				dims.bounds.bx1 - dims.bounds.bx0,
				dims.bounds.by1 - dims.bounds.by0
			),
			data = img.data,
			index = 0,
			bufferindex = 0,
			width = dims.bounds.bx1 - dims.bounds.bx0,
			x = 0, y = 0,
			bufflen = canvas.lineBuffer.length,
			px2 = Math.round(dims.pxsize / 2),
			offs = dims.offset;

		while (bufflen-=2) {
			x = canvas.lineBuffer[bufflen] * dims.pxsize;
			y = canvas.lineBuffer[bufflen + 1] * dims.pxsize;

			for (py = y + offs, ppy = y + dims.pxsize + offs; py < ppy; py++) {
				for (px = x + offs, ppx = x + dims.pxsize + offs; px < ppx; px++) {
					index = ((py - dims.bounds.by0) * width + px - dims.bounds.bx0) * 4;
					data[index    ] = color[0];
					data[index + 1] = color[1];
					data[index + 2] = color[2];
					data[index + 3] = color[3];
				}
			}
		}

		img.data = data;
		canvas.ctx[0].putImageData(img, dims.bounds.bx0, dims.bounds.by0);
	}

	canvas.clear = function () {
		canvas.ctx[0].clearRect(0, 0, canvas.els[0].width, canvas.els[0].height);
	}

	canvas.zBuffer = function(voxels, direction) {
		var voxel = [];

		for (var v = 0, vv = voxels.length; v < vv; v++) {
			voxel = voxels[v];


		}
	}

	return canvas;
});