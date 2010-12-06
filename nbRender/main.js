window.addEventListener('load', function () {
	Initialize();
}, false);

window.addEventListener('keydown', function (evt) {
	Key(evt);
}, false);

function Initialize () {
	var date0 = new Date();
	window.$C = new Common();
	swatchInit();
	overhead(example1);
	var date1 = new Date();
	console.log("Took " + (date1 - date0) + "ms to render.");
}

var ex = 1;

function Key (evt) {
	var Field;
	
	// example (EKEY)
	if (evt.keyCode == 69) {
		if (ex < Examples.length) {
			Field = Examples[ex];
			ex++;
		}
		else {
			ex = 0;
			Field = Examples[ex];
			ex++;
		}
		overhead(Field);
		console.log('New model loaded.');
	}
}
