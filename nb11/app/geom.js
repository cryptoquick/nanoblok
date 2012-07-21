define(function () {
	var geom = {};

	// Return a hexagon by Vertex and Scale
	geom.hex = function (v, s) {
		switch (v) {
			case 0: // Center
				return {x: 0.50 * s, y: 0.50 * s};
			case 1: // Top
				return {x: 0.50 * s, y: 0.00 * s};
			case 2:
				return {x: 1.00 * s, y: 0.25 * s};
			case 3:
				return {x: 1.00 * s, y: 0.75 * s};
			case 4:
				return {x: 0.50 * s, y: 1.00 * s};
			case 5:
				return {x: 0.00 * s, y: 0.75 * s};
			case 6:
				return {x: 0.00 * s, y: 0.25 * s};
		}
	}

	geom.pointsToHex = function (points, scale) {
		var point = 0,
			arr = [],
			hex = {};

		for (var p in points) {
			point = points[p];
			hex = geom.hex(point, scale);
			arr.push(hex.x, hex.y);
		}

		return arr;
	}

	return geom;
});