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
	var pixArr = overhead(example1);
	render(pixArr);
	var date1 = new Date();
	console.log("Took " + (date1 - date0) + "ms to render.");
}

function render (pixArr) {
	rectRender(pixArr);
	// Render Over should be false if canvas is blank.
	pixelRender(pixArr, true);
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
		var pixArr = overhead(Field);
		render(pixArr);
		console.log('New model loaded.');
	}
}
