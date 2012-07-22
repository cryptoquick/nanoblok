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
		var size = 64,
			pxsize = 2;

		// Faces
		canvas.fillPoly(geom.pointsToHex([1, 2, 0, 6], size), [53, 249, 0, 255]); // Top
		canvas.fillPoly(geom.pointsToHex([2, 3, 4, 0], size), [38, 215, 0, 255]); // Left
		canvas.fillPoly(geom.pointsToHex([0, 4, 5, 6], size), [28, 186, 0, 255]); // Right
		
		// Outline
		var dims = {
			x: 0,
			y: 0,
			width: size,
			height: size,
			pxsize: pxsize
		};

		canvas.drawPoly(geom.pointsToHex([1, 2, 3, 4, 5, 6, 1], size), dims, [0, 0, 0, 255]);

		// Inlay
		// canvas.drawPoly(geom.pointsToHex([6, 0, 2], size), pxsize, [0, 0, 0, 255]);
		// canvas.drawPoly(geom.pointsToHex([0, 4], size), pxsize, [0, 0, 0, 255]);
	};

	render.test2 = function () {

	}

	render.init();

	return render;
})