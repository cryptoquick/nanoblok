define([
	'app/render',
	'data/examples'
],
function (render, EXAMPLES) {
	// Global nanoblok object.
	var nb = {};

	nb.init = function () {
		console.log(EXAMPLES[0][0]);
		render.init();
	}

	return nb;
});