define([
	'app/canvas',
	'app/geom',
	'lib/gl-matrix'
],
function (canvas, geom, matrix) {
	var render = {};

	render.axes = {x: 150, y: 150, z: 0, sx: 100, sy: 100, sz: 100, r: 0, rx: 0, ry: 0, rz: 0, q: quat4.identity()};
	render.rots = [];
	render.lastRotAxis = '';
	render.bounds = {};

	render.init = function () {
		canvas.init();

		render.axes.q = quat4.identity();
	};

	render.addRotAxis = function (deg, axis) {
		var rotObj = {
			r: deg * (Math.PI / 180),
			rx: 0,
			ry: 0,
			rz: 0
		};

		rotObj[axis] = 1;

		render.axes.q = quat4.multiply(render.axes.q, quat4.fromAngleAxis(
			rotObj.r,
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
				clear: false,
				offset: 1,
				bounds: {bx0: canvas.width, by0: canvas.height, bx1: -1, by1: -1}
			},
			gons = [],
			trigons = [],
			fillColors = [
				[53, 249, 0, 255],
				[38, 215, 0, 255],
				[28, 186, 0, 255]
			];

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

		modelView = render.viewMatrix(render.axes);

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

				// Calculate bounding box.
				if (dest[0] < dims.bounds.bx0)
					dims.bounds.bx0 = Math.floor(dest[0]);
				if (dest[0] > dims.bounds.bx1)
					dims.bounds.bx1 = Math.ceil(dest[0]);
				if (dest[1] < dims.bounds.by0)
					dims.bounds.by0 = Math.floor(dest[1]);
				if (dest[1] > dims.bounds.by1)
					dims.bounds.by1 = Math.ceil(dest[1]);
			}

			// Backface culling
			normal = render.surfaceNormal(trigons);
			normalDot = vec3.dot([0, 0, -1], normal);
			
			if (debug)
				console.log(normal, normalDot);

			if (normalDot > 0.0)
				gons.push(points);
		}

		// Debug Bounds
		if (debug)
			gons.push([
				dims.bounds.bx0, dims.bounds.by0,
				dims.bounds.bx1, dims.bounds.by0,
				dims.bounds.bx1, dims.bounds.by1,
				dims.bounds.bx0, dims.bounds.by1
			]);

		render.bounds = dims.bounds;

		/* Rasterization */
		canvas.clear();

		render.instructions();

		// Faces
		/*for (var fg = 0, fgg = gons.length; fg < fgg; fg++) {
			canvas.fillPoly(gons[fg], fillColors[fg] || [0, 0, 0, 0]); // Top
		}*/

		// Lines
		canvas.drawPolygons(gons, dims, [0, 0, 0, 255], fillColors);

		// For testing purposes only
		if (debug)
			window.location.hash = JSON.stringify(render.axes);
	}

	render.viewMatrix = function (axes) {
		var modelView = mat4.create();

		mat4.fromRotationTranslation(axes.q, [
			axes.sx + axes.x,
			axes.sy + axes.y,
			axes.sz + axes.z
		], modelView);

		mat4.scale(modelView,
			[
				axes.sx,
				axes.sy,
				axes.sz
			]
		);

		return modelView;
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