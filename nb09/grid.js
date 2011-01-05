var Grid = function () {
	this.array = [];
	this.dims = {cols: 0, rows: 0, height: 0}
	this.offsY = -20.0;
	
	this.init = function (cols, rows) {
		// For when we want to know the grid size later.
		this.dims = {cols: cols, rows: rows, height: 32};
		
		var s = 2.0;
		
		// Loop starts at negative half to center grid.
		var co = Math.floor(cols / 2);
		var ro = Math.floor(rows / 2);
		
		var color = {r: 0.7, g: 0.7, b: 0.7};
		
		var mainTile = new NewBlock("tile", "");
		mainTile.make();
		
		for (var c = -co, cc = co; c < cc; c++) {
			for (var r = -ro, rr = ro; r < rr; r++) {
				var tile = new NewBlock("tile", "grid" + 32 * c + r);
				tile.instance(color, {x: c * s, y: -1.0 + this.offsY, z: r * s});
				$C.scene.addGrid([tile.uniqueID])
			}
		}
	}
}