NANO.PanelData = function (resolution) {
	this.WIDTH = resolution.x;
	this.HEIGHT = resolution.y;
	
	return this;
}

NANO.PanelData.prototype = {
	constructor: NANO.PanelData,
	
	WIDTH: 0, HEIGHT: 0,
	
	panels: [
		{
			id: "nbSideLeft",
			parent: undefined,
			position: new BLOK.Vector2(0, 0),
			dimensions: new BLOK.Vector2(200, this.HEIGHT),
			contents: []
		}
	],
}
