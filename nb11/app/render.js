define([
	'app/canvas',
	'app/geom',
	'lib/gl-matrix'
],
function (canvas, geom, matrix) {
	var render = {};

	render.axes = {x: 100, y: 100, z: 0, sx: 50, sy: 50, sz: 50};
	render.rots = [];
	render.lastRotAxis = '';

	render.init = function () {
		canvas.init();

		render.axes.q = quat4.identity();
	};

	render.addRot = function (deg, addRotAxis, ry, rz) {
		render.axes.q = quat4.multiply(render.axes.q, quat4.fromAngleAxis(
			deg * (Math.PI / 180),
			[
				rx,
				ry,
				rz
			]
		));
	}

	render.addRotAxis = function (deg, axis) {
		var rotObj = {
			r: deg * (Math.PI / 180),
			rx: 0,
			ry: 0,
			rz: 0
		};
		rotObj[axis] = 1;

		render.axes.q = quat4.multiply(render.axes.q, quat4.fromAngleAxis(
			deg * (Math.PI / 180),
			[
				rotObj.rx,
				rotObj.ry,
				rotObj.rz
			]
		));
	}

	// Render
	render.blok = function () {
		var size = 64,
			pxsize = 2;

		if (window.devicePixelRatio) {
			size *= window.devicePixelRatio;
			pxsize *= window.devicePixelRatio;
		}
		
		// Outline
		var dims = {
			x: 0,
			y: 0,
			width: size,
			height: size,
			pxsize: pxsize,
			offsetXY: 0,
			clear: false
		};

		canvas.drawPoly(geom.pointsToHex([1, 2, 3, 4, 5, 6, 1], size), dims, [0, 0, 0, 255]);

		// Inlay
		canvas.drawPoly(geom.pointsToHex([6, 0, 2], size), dims, [0, 0, 0, 255]);
		canvas.drawPoly(geom.pointsToHex([0, 4], size), dims, [0, 0, 0, 255]);
	};

	render.test2 = function () {
		var modelView = mat4.create(),
			modelVerts = [
				// Front face
				[
					[-1.0, -1.0,  1.0],
					[1.0, -1.0,  1.0],
					[1.0,  1.0,  1.0],
					[-1.0,  1.0,  1.0]
				],
				// Back face
				[
					[-1.0, -1.0, -1.0],
					[-1.0,  1.0, -1.0],
					[1.0,  1.0, -1.0],
					[1.0, -1.0, -1.0]
				],
				// Top face
				[
					[-1.0,  1.0, -1.0],
					[-1.0,  1.0,  1.0],
					[1.0,  1.0,  1.0],
					[1.0,  1.0, -1.0]
				],
				// Bottom face
				[
					[-1.0, -1.0, -1.0],
					[1.0, -1.0, -1.0],
					[1.0, -1.0,  1.0],
					[-1.0, -1.0,  1.0]
				],
				// Right face
				[
					[1.0, -1.0, -1.0],
					[1.0,  1.0, -1.0],
					[1.0,  1.0,  1.0],
					[1.0, -1.0,  1.0]
				],
				// Left face
				[
					[-1.0, -1.0, -1.0],
					[-1.0, -1.0,  1.0],
					[-1.0,  1.0,  1.0],
					[-1.0,  1.0, -1.0]
				]
			];
			size = 128,
			pxsize = 2,
			points = [],
			dims = {
				x: 0,
				y: 0,
				width: 512,
				height: 512,
				pxsize: pxsize,
				offsetXY: 0,
				clear: false,
				offset: 2
			},
			gons = [],
			trigons = [];

		if (window.devicePixelRatio) {
			size *= window.devicePixelRatio;
			pxsize *= window.devicePixelRatio;
		}

		if (debug)
			console.log(render.axes, [
				render.axes.sx + render.axes.x,
				render.axes.sy + render.axes.y,
				render.axes.sz + render.axes.z
			], modelView);

		mat4.fromRotationTranslation(render.axes.q, [
			render.axes.sx + render.axes.x,
			render.axes.sy + render.axes.y,
			render.axes.sz + render.axes.z
		], modelView);

		mat4.scale(modelView,
			[
				render.axes.sx,
				render.axes.sy,
				render.axes.sz
			]
		);

		/* Apply transformation matrix to polygons */
		for (var m = 0, mm = modelVerts.length; m < mm; m++) {
			points = [];
			trigons = [];
			canvas.lineBuffer = [],
			normal = [];
			normalDot = 0.0;

			// Push each vector as a point, using the x/y values of that vector.
			for (var v = 0, vv = modelVerts[m].length; v < vv; v++) {
				var dest = vec3.create();
				mat4.multiplyVec3(modelView, modelVerts[m][v], dest);
				points.push(dest[0], dest[1]);
				trigons.push([dest[0], dest[1], dest[2]]);
			}

			// Backface culling
			normal = render.surfaceNormal(trigons);
			normalDot = vec3.dot([1, 1, -1], normal);
			console.log(normal, normalDot);

			if (normalDot > 0.0)
				gons.push(points);
		}

		canvas.clear();

		render.instructions();

		var fillColors = [
			[53, 249, 0, 255],
			[38, 215, 0, 255],
			[28, 186, 0, 255],
			[53, 249, 0, 255],
			[38, 215, 0, 255],
			[28, 186, 0, 255]
		];

		// Faces
		for (var fg = 0, fgg = gons.length; fg < fgg; fg++) {
			canvas.fillPoly(gons[fg], fillColors[fg] || [0, 0, 0, 0]); // Top
		}

		// Lines
		canvas.drawPolygons(gons, dims, [0, 0, 0, 255]);

		// For testing purposes only
		if (debug)
			window.location.hash = JSON.stringify(render.axes);
	}

	// Newell's method
	render.surfaceNormal = function (polygon) {
		var normal = [0, 0, 0],
			currentVertex = [0, 0, 0],
			nextVertex = [0, 0, 0];

		for (var v = 0, vv = polygon.length; v < vv; v++) {
			currentVertex = polygon[v];
			nextVertex = polygon[(v + 1) % polygon.length];

			normal[0] += (currentVertex[1] - nextVertex[1]) * (currentVertex[2] + nextVertex[2]);
			normal[1] += (currentVertex[2] - nextVertex[2]) * (currentVertex[0] + nextVertex[0]);
			normal[2] += (currentVertex[0] - nextVertex[0]) * (currentVertex[1] + nextVertex[1]);
		}

		return vec3.normalize(normal);
	}

	render.dot = function (a, b) {
		return(a[0]*b[0] + a[1]*b[1] + a[2]*b[2]);
	}

	render.instructions = function () {
		var ctx = canvas.ctx[0];
		ctx.fillStyle = '#000';
		ctx.font = 12 * (window.devicePixelRatio || 1) + 'px monospace';
		ctx.fillText('KEYS -- Rotate X: W/S, Y: A/D, Z: Q/E, Translate: Arrows, Scale: +/-', 10 * (window.devicePixelRatio || 1), 15 * (window.devicePixelRatio || 1));
	}

	return render;
});