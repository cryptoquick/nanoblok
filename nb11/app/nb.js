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
		utils.benchmark(function () {
			render.blok();
		}, 1);

		var rd = 0.1,
			td = 10.0,
			actions = {};

		input.addKeydown(document, 65, render.test2, input.addToTransform, -rd, 'rx', 1); // W
		input.addKeydown(document, 68, render.test2, input.addToTransform, rd, 'rx', 1); // S
		input.addKeydown(document, 87, render.test2, input.addToTransform, -rd, 'ry', 1); // A
		input.addKeydown(document, 83, render.test2, input.addToTransform, rd, 'ry', 1); // D
		input.addKeydown(document, 81, render.test2, input.addToTransform, -rd, 'rz', 1); // Q
		input.addKeydown(document, 69, render.test2, input.addToTransform, rd, 'rz', 1); // E
		input.addKeydown(document, 37, render.test2, input.addToTransform, -td, 'x'); // Left
		input.addKeydown(document, 39, render.test2, input.addToTransform, td, 'x'); // Right
		input.addKeydown(document, 38, render.test2, input.addToTransform, -td, 'y'); // Up
		input.addKeydown(document, 40, render.test2, input.addToTransform, td, 'y'); // Down

		if (window.location.hash)
			render.axes = JSON.parse(window.location.hash.substr(1));

		render.test2();
	};

	nb.init();

	return nb;
});