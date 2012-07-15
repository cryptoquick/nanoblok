define(function () {
	var color = {};

	color.init = function () {
		var index = 0,
		x = 0, y = 0, z = 0,
		swatch = {},
		color = [];

		for (z = 0; z < 32; z++) {
			for (y = 0; y < 32; y++) {
				for (x = 31; x >= 0; x--) {
					color = [
						(z + 1) * 8,
						(y + 1) * 8,
						256 - (x + 1) * 8
					];
					
					swatch[index] = color;
					
					index++;
				}
			}
		}
		
		return swatch;
	};

	return color;
});
