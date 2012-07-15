require([
		'app/main'
	],
function (nb) {
	app = {};
	app.init = function () {
		nb.test();
	}
	return app;
});