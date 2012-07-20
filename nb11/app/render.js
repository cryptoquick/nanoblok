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
		// canvas.simpleDraw(data, 16, 0, 0.5);
	/*	canvas.drawPoly([
			250, 0,
			500, 125,
			500, 375,
			250, 500,
			0  , 375,
			0  , 125
		]); */
		canvas.drawPoly([
			250, 0,
			500, 125,
			500, 375,
			250, 500,
			0  , 375,
			0  , 125
		]);
	};

	render.init();

	return render;
})