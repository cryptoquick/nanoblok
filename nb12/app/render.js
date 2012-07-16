define([
	'app/canvas',
	'lib/gl-matrix'
],
function (canvas, matrix) {
	var render = {};

	render.init = function () {
		
	};

	// Render
	render.full = function (data) {
		canvas.simpleDraw(data, 1);
	};

	render.init();

	return render;
})