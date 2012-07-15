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
	canvas.draw = function (data) {
		var width = canvas.els[0].width,
			height = canvas.els[0].height,
			index = 0,
			data = canvas.img[0].data;
	};

	return canvas;
})