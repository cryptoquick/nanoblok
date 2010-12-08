window.addEventListener('load', function () {
	Initialize();
}, false);

/*window.addEventListener('keydown', function (evt) {
	Key(evt);
}, false);*/

function Initialize () {
	var date0 = new Date();
	window.$C = new Common();
	swatchInit();
	demo();
	var date1 = new Date();
	console.log("Took " + (date1 - date0) + "ms to render.");
}

function demo () {
	for (var i = 0; i < Examples.length; i++) {
		SpriteModels.push(expand(Examples[i]));
	}
	var img;
	for (var i = 0; i < Examples.length; i++) {
		for (var j = 0; j < 1; j++) {
			img = pixelRender(overhead(SpriteModels[i], j));
			displayDraw(img, {x: 32 * i, y: j * 32});
		}
	}
}

/*var ex = 1;

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
}*/
