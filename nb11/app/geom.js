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

	// More generic version of DDA used by voxrender
	geom.dda = function (x0, y0, x1, y1) {
		var dx = (x1 - x0), // Distance
			dy = (y1 - y0),
			steps = 0, k = 0,	// Steps / Iterations
			xincr = 0.0, yincr = 0.0, // Increment per step
			x = x0, y = y0; // Start
			ax = Math.abs(dx), ay = Math.abs(dy), // |distance|
			line = [], fly = 0, flx = 0;

		// Get the most steps, in order to draw the diagonals correctly
		if (ax >= ay)
			steps = ax;
		else
			steps = ay; // Not sure when this 'fix' will become a bug...

		// Determine step increments
		xincr = dx / steps;
		yincr = dy / steps;

		line.push(x | 0, y | 0);

		// Loop~
		for (k = 0; k < steps; k++) {
			x += xincr;
			y += yincr;

			flx = x | 0;
			fly = Math.round(y);

			line.push(flx, fly);
		}

		return line;
	}

	return geom;
});