define([
	'app/render',
	'data/examples'
],
function (render, EXAMPLES) {
	// Global nanoblok object.
	var nb = {};

	nb.init = function () {
		render.full(EXAMPLES[0]);
	};

	nb.init();

	return nb;
});