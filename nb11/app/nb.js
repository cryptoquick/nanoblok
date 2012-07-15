define([
	'app/render',
	'data/examples'
],
function (render, EXAMPLES) {
	// Global nanoblok object.
	var nb = {};

	nb.init = function () {
		render.init();
		render.full(EXAMPLES[0]);
	};

	return nb;
});