define([
	'app/canvas',
	'app/geom',
	'lib/gl-matrix'
],
function (canvas, geom, matrix) {
	var render = {};

	render.init = function () {
		
	};

	// Render
	render.blok = function () {
		var size = 500,
			pxsize = 4; // 4 is a great value!

		// Faces
		canvas.fillPoly(geom.pointsToHex([1, 2, 0, 6], size), '#42F21D'); // Top
		canvas.fillPoly(geom.pointsToHex([2, 3, 4, 0], size), '#22C000'); // Left
		canvas.fillPoly(geom.pointsToHex([0, 4, 5, 6], size), '#30D700'); // Right
		
		// Outline
		canvas.drawPoly(geom.pointsToHex([1, 2, 3, 4, 5, 6, 1], size), pxsize);

		// Inlay
		canvas.drawPoly(geom.pointsToHex([6, 0, 2], size), pxsize);
		canvas.drawPoly(geom.pointsToHex([0, 4], size), pxsize);
	};

	render.init();

	return render;
})