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
		canvas.drawPoly([
			250, 0,
			500, 125,
			500, 375,
			250, 500,
			0  , 375,
			0  , 125
		]);
	/*	canvas.drawPoly([
			0, 375,
			250, 250,
			0, 125
		]);
		canvas.drawPoly([
			250, 0,
			250, 250,
			500, 125
		]); // :(
		canvas.drawPoly([
			500, 125,
			250, 250,
			500, 375
		]);  // :)
		canvas.drawPoly([
			500, 375,
			250, 250,
			250, 500
		]); // :( 
		canvas.drawPoly([
			250, 500,
			250, 250,
			0, 375
		]);   // :T 
		canvas.drawPoly([
			0, 375,
			250, 250,
			0, 125
		]); // :(
		canvas.drawPoly([
			0, 125,
			250, 250,
			250, 0
		]);*/
	};

	render.init();

	return render;
})