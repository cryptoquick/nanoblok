BLOK.Color = function (r, g, b) {
	if (r && b && g)
		this.setRGB(r, g, b);
	
	return this;
};

BLOK.Color.prototype = {
	constructor: BLOK.Color,
	
	r: 0, g: 0, b: 0,
	
	setRGB: function (r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	},
	
	setHex: function (hex) {
		hex = Math.floor(hex);
		
		this.r = hex >> 16 & 255;
		this.g = hex >> 8 & 255;
		this.b = hex & 255;
	}
};
