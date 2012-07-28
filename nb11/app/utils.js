define(function () {
	var utils = {};

	utils.encode2 = function (x, y, d) {
		return y * d + x;
	}

/*	utils.decode2 = function (hash, d) {
		var coors = {};
		coors.y = (hash / d) | 0;
		coors.x = coors.y % d;
		// coors.x = hash % d;
		// coors.y = ((hash - coors.x) / d) | 0;
		return coors;
	}*/

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

	utils.bitIndicesEncode = function (model, d) {
		var voxel = 0,
			voxelbits = 0;
		for (var i = 1, ii = model.length; i < ii; i++) {
			voxel = model[i];
			voxelbits |= utils.encode3(voxel[0], voxel[1], voxel[2], d);
		}

		return voxelbits;
	}

	utils.bitIndicesDecode = function (voxelbits, d) {
		var indices = [];
		for (var i = 1, ii = Math.pow(d, 3); i < ii; i *= 2) {
			if (voxelbits & i) {
				indices.push(utils.decode3(i, d));
			}
		}

		return indices;
	}

	return utils;
});