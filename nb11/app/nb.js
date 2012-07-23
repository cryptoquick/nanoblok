define([
	'app/render',
	'app/utils',
	'data/examples'
],
function (render, utils, EXAMPLES) {
	// Global nanoblok object.
	var nb = {};

	nb.init = function () {
		utils.benchmark(function () {
			render.blok();
			// render.test2();
		}, 1);
	};

	nb.init();

	return nb;
});