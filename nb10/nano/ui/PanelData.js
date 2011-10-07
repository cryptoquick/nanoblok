NANO.PanelData = function (resolution) {
	this.WIDTH = resolution.x;
	this.HEIGHT = resolution.y;
	
	return this;
}

NANO.PanelData.prototype = {
	constructor: NANO.PanelData,
	
	WIDTH = 0, HEIGHT = 0,
	
	panels: [
		{
			id: "nbSideLeft",
			parent: undefined,
			contents: [],
			position: BLOK.Vector2(0, 0),
			dimensions: BLOK.Vector2(200, this.HEIGHT)
		}
	],
}
