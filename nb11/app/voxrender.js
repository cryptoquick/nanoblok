define([
	'app/canvas',
	'app/geom',
	'app/render',
	'lib/gl-matrix'
], function (canvas, geom, render, matrix) {
	var vr = {};
	vr.rays = [];
	vr.axes = [];
	vr.cube = [];

	vr.normalizedViewMatrix = function (axes, scale) {
		// console.log(render.bounds);

		var view = render.viewMatrix(axes),
			scale = 0;

		for (var i = 0, ii = view.length; i < ii; i++) {
			if (Math.abs(view[i]) > scale)
				scale = view[i];
		}

		scale = 1 / scale;

		nview = mat4.scale(view, vec3.create([scale, scale, scale])); // Normalized view
		// Reset translation.
		nview[12] = 0;
		nview[13] = 0;
		nview[14] = 0;

		return nview;
		// render.bounds.bx0
	}

	vr.initArray3 = function (scale) {
		var xarr = [],
			yarr = [],
			zarr = [];

		for (var z = 0; z < scale; z++) {
			yarr = [];
			for (var y = 0; y < scale; y++) {
				xarr = [];
				for (var x = 0; x < scale; x++) {
					xarr.push(0);
				}
				yarr.push(xarr);
			}
			zarr.push(yarr);
		}

		vr.cube = zarr;
	}

	vr.expand = function (example, axes, scale) {
		var view = vr.normalizedViewMatrix(axes, scale),
			scale2 = scale * 2;

		vr.initArray3(scale2);

		for (var i = 0, ii = example.length; i < ii; i++) {
			var ex = example[i],
				vec = vec3.create();

			mat4.multiplyVec3(view, [ex[0], ex[1], ex[2]], vec);

			if (vec[0] > 0 && vec[0] < scale2 &&
				vec[1] > 0 && vec[1] < scale2 &&
				vec[2] > 0 && vec[2] < scale2) {
				var x = Math.round(vec[0]),
					y = Math.round(vec[1]),
					z = Math.round(vec[2]);

				vr.cube[z][y][x] = ex[3];
			}
		}
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