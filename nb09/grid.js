var Grid = function () {
	this.array = [];
	
	this.init = function (cols, rows) {
		var s = 2.0;
		
		// Loop starts at negative half to center grid.
		var co = Math.floor(cols / 2);
		var ro = Math.floor(rows / 2);
		
		var blok = new Block("tile");
		blok.make(
			{r: 0.7, g: 0.7, b: 0.7},
			{x: 1.0, y: 1.0, z: 1.0},
			{x: 1.0, y: 1.0, z: 1.0}
		)
		
		for (var c = -co, cc = co; c < cc; c++) {
			for (var r = -ro, rr = ro; r < rr; r++) {
				this.array.push(blok.instance({x: c * s, y: -1.0, z: r * s}));
			}
		}
		
		$C.scene.add(this.array);
	}
}

/*

var node = {
	type: "translate",
	x: this.position.x,
	y: this.position.y,
	z: this.position.z,
	nodes: [{
		type: "material",
		baseColor: this.color,
		specularColor: this.color,
		specular: 0.9,
		shine: 1.0,
		nodes: [{
			type: "cube",
			xSize: this.size.x,
			ySize: this.size.y,
			zSize: this.size.z,
			solid: this.solid
		}]
	}]
}

$C.scene.add(blok.make({r: 0.9, g: 0.3, b: 0.9}, {x: 0.0, y: 0.0, z: 0.0}));

*/