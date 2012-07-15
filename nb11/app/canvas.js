define(function () {
	var canvas = {};

	canvas.init = function () {
		// Grab all canvas elements present in the document
		canvas.els = document.getElementById('nb').getElementsByTagName('canvas');
		
		// Get context from canvases
		canvas.ctx = [];

		for (var i = 0, ii = canvas.els.length; i < ii; i++) {
			canvas.ctx[i] = canvas.els[i].getContext('2d');
		}

		// Adjust the canvas for high-DPI displays
		canvas.els[0].setAttribute("width", window.innerWidth * window.devicePixelRatio);
		canvas.els[0].setAttribute("height", window.innerHeight * window.devicePixelRatio);
		canvas.els[0].style.width = window.innerWidth;
		canvas.els[0].style.height = window.innerHeight;
		canvas.ctx[0].scale(window.devicePixelRatio, window.devicePixelRatio);
	}

	// Render
	canvas.draw = function (data) {
		
	}

	return canvas;
})