define([
	'app/color'
],
function (color) {
	var canvas = {};

	canvas.init = function () {
		// Grab all canvas elements present in the document
		canvas.els = document.getElementById('nb').getElementsByTagName('canvas');

		// Adjust the canvas for high-DPI displays
		canvas.els[0].setAttribute("width", window.innerWidth * window.devicePixelRatio);
		canvas.els[0].setAttribute("height", window.innerHeight * window.devicePixelRatio);
		canvas.els[0].style.width = window.innerWidth;
		canvas.els[0].style.height = window.innerHeight;

		// Get context from canvases
		canvas.ctx = [];

		for (var i = 0, ii = canvas.els.length; i < ii; i++) {
			canvas.ctx[i] = canvas.els[i].getContext('2d');
		}

		// Initialize canvas image objects
		canvas.img = [];
		canvas.img[0] = canvas.ctx[0].createImageData(window.innerWidth, window.innerHeight);

		color.swatch = color.init();
	};

	// Render
	canvas.simpleDraw = function (voxels) {
		var width = canvas.els[0].width,
			height = canvas.els[0].height,
			index = 0,
			data = canvas.img[0].data,
			x = 0, y = 0,
			color = [];

		for (var v = 0, vv = voxels.length; v < vv; v++) {
			index = x + y * width;
		}

		for (y = 0; y < height; y++) {
			for (x = 0; x < width; x++) {
				index = x + y * width;
				color = pixels[index];
				index = index * 4;
				if (color) {
					data[index + 0] = color[0];
					data[index + 1] = color[1];
					data[index + 2] = color[2];
					data[index + 3] = 255;
				}
				else {
					data[index + 0] = 255;
					data[index + 1] = 255;
					data[index + 2] = 255;
					data[index + 3] = 0;
				}
			}
		}
	};

	return canvas;
})