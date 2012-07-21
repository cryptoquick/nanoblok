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
		var pxsize = 4; // 4 is a great value!

		// Outline
		canvas.drawPoly([
			250, 0,
			500, 125,
			500, 375,
			250, 500,
			0  , 375,
			0  , 125,
			250, 0
		], pxsize); 

		// Inlay
		canvas.drawPoly([
			0, 125,
			250, 250,
			500, 125
		], pxsize);
		canvas.drawPoly([
			250, 250,
			250, 500
		], pxsize);

		// Faces
	};

	render.init();

	return render;
})