define([
	'app/voxrender',
	'app/render',
	'app/input',
	'app/utils',
	'app/canvas',
	'data/examples'
],
function (vr, render, input, utils, canvas, EXAMPLES) {
	// Global nanoblok object.
	var nb = {},
	x = 0, y = 0, rx = 0, ry = 0, rz = 0;

	nb.init = function () {
		/*utils.benchmark(function () {
			render.blok();
		}, 1);*/
		
		render.init();

		// Select Renderer
		nb.render = nb.renderTest;
		// nb.render = nb.voxRender;

		var rd = 5,
			td = 10.0,
			sd = 10.0,
			actions = {};

		input.addKeydown(document, 65, nb.render, input.addToTransform, -rd, 'rx', 1); // W
		input.addKeydown(document, 68, nb.render, input.addToTransform, rd, 'rx', 1); // S
		input.addKeydown(document, 87, nb.render, input.addToTransform, -rd, 'ry', 1); // A
		input.addKeydown(document, 83, nb.render, input.addToTransform, rd, 'ry', 1); // D
		input.addKeydown(document, 81, nb.render, input.addToTransform, -rd, 'rz', 1); // Q
		input.addKeydown(document, 69, nb.render, input.addToTransform, rd, 'rz', 1); // E
		input.addKeydown(document, 37, nb.render, input.addToTransform, -td, 'x'); // Left
		input.addKeydown(document, 39, nb.render, input.addToTransform, td, 'x'); // Right
		input.addKeydown(document, 38, nb.render, input.addToTransform, -td, 'y'); // Up
		input.addKeydown(document, 40, nb.render, input.addToTransform, td, 'y'); // Down
		input.addKeydown(document, 189, nb.render, function () {
			render.axes.sx -= sd;
			render.axes.sy -= sd;
			render.axes.sz -= sd;
		}); // -
		input.addKeydown(document, 187, nb.render, function () {
			render.axes.sx += sd;
			render.axes.sy += sd;
			render.axes.sz += sd;
		}); // +
		input.addKeydown(document, 78, nb.render, function () {
			render.axes = {x: 150, y: 150, z: 0, sx: 100, sy: 100, sz: 100, r: 0, rx: 0, ry: 0, rz: 0, q: quat4.identity()};
			render.addRotAxis(45, 'rx');
			render.addRotAxis(45, 'ry');
		}); // N
		input.addKeydown(document, 67, nb.render, function () {
			render.axes = {x: 150, y: 150, z: 0, sx: 100, sy: 100, sz: 100, r: 0, rx: 0, ry: 0, rz: 0, q: quat4.identity()};
			render.rots = [];
		}); // C - Reset
		input.addKeydown(document, 80, nb.render, function () {
			window.location.hash = JSON.stringify(render.axes);
		}); // P - Printout (to URL)
		input.addKeydown(document, 80, nb.render, function () {
			window.location.hash = JSON.stringify(render.axes);
		}); // R - Render

		if (window.location.hash) {
			render.axes = JSON.parse(window.location.hash.substr(1));
		}

		// nb.renderTest();
		// nb.voxRender();
		nb.render();
	};

	nb.renderTest = function () {
		var ctx = canvas.ctx[0],
			avg = 0;

		if (!debug) {			
			avg = utils.benchmark(function () {
				render.test2();
			}, 1, true);

			ctx.fillStyle = 'blue';
			ctx.font = 12 * (window.devicePixelRatio || 1) + 'px monospace';
			ctx.fillText('FPS ' + ((1000 / avg) | 0), 10 * (window.devicePixelRatio || 1), 30 * (window.devicePixelRatio || 1));
		}
		else
			render.test2();

	/*	utils.benchmark(function () {
			var voxelbits = utils.bitIndicesEncode(EXAMPLES[0], 32);
			console.log(voxelbits, utils.bitIndicesDecode(voxelbits, 32).length, EXAMPLES[0].length);
		}, 1);*/
	}

	nb.voxRender = function () {
		var dims = {
			x: 0,
			y: 0,
			width: 512,
			height: 512,
			clear: false,
			offset: 1,
			bounds: {bx0: canvas.width, by0: canvas.height, bx1: -1, by1: -1},
			size: 128,
			pxsize: 2,
			scale: 32
		};

		if (window.devicePixelRatio) {
			dims.size *= window.devicePixelRatio;
			dims.pxsize *= window.devicePixelRatio;
		}

		var view = vr.normalizedViewMatrix(render.axes, dims.scale);
			// voxels = vr.expand(EXAMPLES[0], view, dims.scale);

		render.dims = dims;
		render.drawVoxels(EXAMPLES[0], view);
	}

	return nb;
});