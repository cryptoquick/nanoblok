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
			render.full(EXAMPLES[0]);
		}, 1);
	};

	nb.init();

	return nb;
});