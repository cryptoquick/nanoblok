define([
	'app/colors',
	'app/geom'
],
function (colors, geom) {
	var canvas = {},
	colors = colors;

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
		canvas.img[0] = canvas.ctx[0].createImageData(canvas.els[0].width, canvas.els[0].height);

		// zBuffer Arrays
		canvas.buf = [];
		canvas.buf[0] = [];
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
					data[index + 0] = color[0];
					data[index + 1] = color[1];
					data[index + 2] = color[2];
					data[index + 3] = 255;
				}
			}
		}

		img.data = data;
		canvas.ctx[0].putImageData(img, 0, 0);
	};

	canvas.drawPoly = function (points) {
		var x = 0, y = 0,
			negx = Number.MAX_VALUE, posx = Number.MIN_VALUE,
			negy = Number.MAX_VALUE, posy = Number.MIN_VALUE,
			bx = 0, by = 0,
			slopes = [];

		for (var p = 0, pp = points.length; p < pp; p += 2) {
			x = points[p];
			y = points[p + 1];

			// Find bounds
			if (x < negx)
				negx = x;
			if (x > posx)
				posx = x;
			if (y < negy)
				negy = y;
			if (y > posy)
				posy = y;

			if (p == pp - 2) {
				
			}
			else {
				
			}
		}

		for (by = negy; by < posy; by++) {
			for (bx = negx; bx < posx; bx++) {

			}
		}

		console.log(points.length, negx, negy, posx, posy);
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