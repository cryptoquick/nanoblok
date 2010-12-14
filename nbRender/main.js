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

function colorDemo () {
	var field = SwatchField;
	var voxels = voxArr(32);
	for (var i = 0, ii = field.length; i < ii; i++) {
		var x = field[i][0];
		var y = field[i][1];
		var z = field[i][2];
		var color = SwatchField[i][3];
		
		voxels[x][y][z] = color;
	}
	return voxels;
}

function demo () {
	for (var i = 0; i < Examples.length; i++) {
		SpriteModels.push(expand(Examples[i]));
	}
	SpriteModels.push(colorDemo());
	var img;
	for (var i = 0; i < Examples.length + 1; i++) {
		for (var j = 0; j < 1; j++) {
			var img = pixelRender(iso(SpriteModels[i]));
			displayDraw(img, {x: (size + 1) * i, y: (j * size) + 1});
		}
	}
//	var img = pixelRender(iso(expand(SwatchField)));
//	displayDraw(img, {x: (64 * 5 + 1) * i, y: (64 * 5) + 1});
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
