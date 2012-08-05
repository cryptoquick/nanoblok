define([
	'app/canvas',
	'app/geom',
	'app/render',
	'lib/gl-matrix'
], function (canvas, geom, render, matrix) {
	var vr = {};
	vr.rays = [];
	vr.axes = [];

	vr.normalizeViewMatrix = function (scale) {
		console.log(render.bounds);

		// render.bounds.bx0
	}

	vr.initRays = function (dims, axes) {
		var x = 0, y = 0, z = 0,
			scale2 = dims.scale * 2,
			sides0 = [], sides1 = [],
			lines0 = [], lines1 = [],
			view = [];

		// Construct ray array
		/*for (z = 0; z < dims2; z++) {
			for (y = 0; y < dims2; y++) {
				for (x = 0; x < dims2; x++) {

				}
			}
		}*/

		for (y = 0; y < scale2; y++) {
			for (x = 0; x < scale2; x++) {
				sides0.push(x, y, 1);
				sides1.push(x, y, dims.scale);
			}
		}

		view = render.viewMatrix(axes);

		for (var i = 0, ii = sides0.length; i < ii; i += 3) {
			var x0 = sides0[i],
				y0 = sides0[i + 1],
				z0 = sides0[i + 2],
				x1 = sides1[i],
				y1 = sides1[i + 1],
				z1 = sides1[i + 2],
				vec0 = mat4.create(),
				vec1 = mat4.create();

			mat4.multiplyVec3(view, [x0, y0, z0], vec0);
			mat4.multiplyVec3(view, [x1, y1, z1], vec1);

			lines0.push(vec0);
			lines1.push(vec1);
		}

		console.log(lines0, lines1);
	}

	return vr;
});