define([
	'app/render',
	'app/utils',
	'data/examples'
],
function (render, utils, EXAMPLES) {
	// Global nanoblok object.
	var nb = {},
	x = 0, y = 0, rx = 0, ry = 0, rz = 0;

	nb.init = function () {
		utils.benchmark(function () {
			render.blok();
		}, 1);

		window.addEventListener('keydown', function(evt) {
			var rd = 0.1,
				td = 10.0,
				actions = {};

			actions[65] = function () {
				ry -= rd;
			}
			actions[68] = function () {
				ry += rd;
			}
			actions[87] = function () {
				rx -= rd;
			}
			actions[83] = function () {
				rx += rd;
			}
			actions[81] = function () {
				rz -= rd;
			}
			actions[69] = function () {
				rz += rd;
			}
			actions[37] = function () {
				x -= td;
			}
			actions[39] = function () {
				x += td;
			}
			actions[38] = function () {
				y -= td;
			}
			actions[40] = function () {
				y += td;
			}

			if (actions[evt.keyCode]) {
				evt.preventDefault();
				render.test2(x, y, rx, ry, rz);
				console.log('keypress', evt.keyCode, x, y, rx, ry, rz);
			}
		}, false);
	};

	nb.init();

	return nb;
});