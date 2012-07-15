define([
	'app/canvas',
	'lib/gl-matrix'
],
function (canvas, matrix) {
	var render = {};

	render.init = function () {
		canvas.init();
	}

	// Render
	render.full = function (data) {

	}

	return render;
})