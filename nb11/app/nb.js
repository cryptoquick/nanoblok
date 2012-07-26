define([
	'app/render',
	'app/input',
	'app/utils',
	'data/examples'
],
function (render, input, utils, EXAMPLES) {
	// Global nanoblok object.
	var nb = {},
	x = 0, y = 0, rx = 0, ry = 0, rz = 0;

	nb.init = function () {
		/*utils.benchmark(function () {
			render.blok();
		}, 1);*/

		render.init();

		var rd = 5,
			td = 10.0,
			sd = 10.0,
			actions = {};

		input.addKeydown(document, 65, nb.renderTest, input.addToTransform, -rd, 'rx', 1); // W
		input.addKeydown(document, 68, nb.renderTest, input.addToTransform, rd, 'rx', 1); // S
		input.addKeydown(document, 87, nb.renderTest, input.addToTransform, -rd, 'ry', 1); // A
		input.addKeydown(document, 83, nb.renderTest, input.addToTransform, rd, 'ry', 1); // D
		input.addKeydown(document, 81, nb.renderTest, input.addToTransform, -rd, 'rz', 1); // Q
		input.addKeydown(document, 69, nb.renderTest, input.addToTransform, rd, 'rz', 1); // E
		input.addKeydown(document, 37, nb.renderTest, input.addToTransform, -td, 'x'); // Left
		input.addKeydown(document, 39, nb.renderTest, input.addToTransform, td, 'x'); // Right
		input.addKeydown(document, 38, nb.renderTest, input.addToTransform, -td, 'y'); // Up
		input.addKeydown(document, 40, nb.renderTest, input.addToTransform, td, 'y'); // Down
		input.addKeydown(document, 189, nb.renderTest, function () {
			render.axes.sx -= sd;
			render.axes.sy -= sd;
			render.axes.sz -= sd;
		}); // -
		input.addKeydown(document, 187, nb.renderTest, function () {
			render.axes.sx += sd;
			render.axes.sy += sd;
			render.axes.sz += sd;
		}); // +
		input.addKeydown(document, 78, nb.renderTest, function () {
			render.addRot(45, 0, 1, 0);
			render.addRot(45, 0, 0, 1);
		}); // N
		input.addKeydown(document, 67, nb.renderTest, function () {
			render.axes = {x: 100, y: 100, z: 0, sx: 50, sy: 50, sz: 50, r: 0, rx: 0, ry: 0, rz: 0, q: quat4.identity()};
			render.rots = [];
		}); // C

		if (window.location.hash) {
			render.axes = JSON.parse(window.location.hash.substr(1));
		}

		nb.renderTest();
	};

	nb.renderTest = function () {
		utils.benchmark(function () {
			render.test2();
		}, 1);
	}

	nb.init();

	return nb;
});