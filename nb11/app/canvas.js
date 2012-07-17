define([
	'app/colors'
],
function (colors) {
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
	};

	// Render
	canvas.simpleDraw = function (voxels, size) {
		var width = canvas.els[0].width,
			height = canvas.els[0].height,
			index = 0,
			img = canvas.img[0],
			data = img.data,
			x = 0, y = 0,
			color = [],
			voxel = [];

		for (var v = 0, vv = voxels.length; v < vv; v++) {
			// Gather coordinate information
			voxel = voxels[v];
			x = voxel[1];
			y = voxel[2];

			// Get color data from swatch lookup
			color = colors.swatch[voxel[3]];

			for (var sy = 0; sy < size; sy++) {
				for (var sx = 0; sx < size; sx++) {
					// Calculate index
					index = ((x * size + sx) + (y * size + sy) * width) * 4;
					
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

	canvas.init();

	return canvas;
})