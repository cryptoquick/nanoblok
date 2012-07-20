define(function () {
	var utils = {};

	utils.encode2 = function (x, y, d) {
		return y * d + x;
	}

	// Hash three values within a cubic dimension.
	utils.encode3 = function (x, y, z, d) {
		return x * d * d + y * d + z;
	}

	utils.decode3 = function (hash, d) {
		var coors = {};
		coors.x = (hash / (d * d)) | 0;
		coors.y = ((hash / d) | 0) - coors.x * d;
		coors.z = hash % d;
		return coors;
	}

	utils.benchmark = function (f, i) {
		var ii = i || 100,
			d0 = new Date();

		while (ii--) {
			f();
		}

		var avg = (((new Date()) - d0) / i) | 0;

		console.log('Function took an average of ', avg, 'ms, after', i, 'runs.');
	}

	return utils;
})