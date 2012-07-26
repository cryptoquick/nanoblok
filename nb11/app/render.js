define([
	'app/canvas',
	'app/geom',
	'lib/gl-matrix'
],
function (canvas, geom, matrix) {
	var render = {};

	render.axes = {x: 0, y: 0, z: 0, sx: 50, sy: 50, sz: 50, r: 0, rx: 0, ry: 0, rz: 0};

	render.init = function () {
		
	};

	// Render
	render.blok = function () {
		var size = 64,
			pxsize = 2;

		if (window.devicePixelRatio) {
			size *= window.devicePixelRatio;
			pxsize *= window.devicePixelRatio;
		}

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
		var persp = matrix.mat4.create(),
			modelView = [],
			modelVecs =
			[
				[
					[	 1.0,	-1.0,	-1.0	],
					[	-1.0,	-1.0,	-1.0	],
					[	-1.0,	-1.0,	 1.0	],
					
					[	 1.0,	-1.0,	 1.0	],
					[	 1.0,	-1.0,	-1.0	],
					
				],
				[
					[	-1.0,	 1.0,	 1.0	],
					[	 1.0,	-1.0,	 1.0	],
					[	 1.0,	 1.0,	-1.0	],
					[	 1.0,	 1.0,	 1.0	]
				]
			],
			size = 128,
			pxsize = 4,
			points = [],
			dims = {
				x: 0,
				y: 0,
				width: 512,
				height: 512,
				pxsize: pxsize,
				offsetXY: 0,
				clear: false
			};
		
		mat4.identity(modelView);

		mat4.translate(
			modelView,
			[
				render.axes.sx + render.axes.x,
				render.axes.sy + render.axes.y,
				render.axes.sz + render.axes.z
			]
		);

		mat4.rotate(
			modelView,
			render.axes.r,
			[
				render.axes.rx,
				render.axes.ry,
				render.axes.rz
			]
		);

		mat4.scale(modelView,
			[
				render.axes.sx,
				render.axes.sy,
				render.axes.sz
			]
		);

		// console.log(modelView);

		dims.clear = true;

		for (var m = 0, mm = modelVecs.length; m < mm; m++) {
			points = [];
			canvas.lineBuffer = [];
			dims.clear = m == 0;

			// Push each vector as a point, using the x/y values of that vector.
			for (var v = 0, vv = modelVecs[m].length; v < vv; v++) {
				var dest = vec3.create();
				mat4.multiplyVec3(modelView, modelVecs[m][v], dest)
				points.push(dest[0], dest[1]);
			}

			canvas.drawPoly(points, dims, [255, 0, 0, 255]);
		}

		// console.log(points);

		// console.log(modelView)

		// For testing purposes only
		window.location.hash = JSON.stringify(render.axes);
	}

	render.init();

	return render;
})