define(function () {
	var utils = {};

	utils.encode = function (x, y, z, d) {
		return x * d * d + y * d + z;
	}

	utils.decode = function (hash, d) {
		var coors = {};
		coors.x = (hash / (d * d)) | 0;
		coors.y = ((hash / d) | 0) - coors.x * d;
		coors.z = hash % d;
		return coors;
	}

	return utils;
})