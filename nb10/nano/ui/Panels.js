NANO.Panels = function () {
	// Position panels.
	this.setPanels(this.getPanels());
	
	return this;
};

NANO.Panels.prototype = {
	constructor: NANO.Panels,
	
	panels: [
		{
			name: "Left Panel",
			parent: undefined,
			contents: [],
			position: BLOK.Vector2(0, 0),
			dimensions: BLOK.Vector2(200, HEIGHT)
		}
	],
	
	getPanels: function () {
		var panels = {};
		panels.left = document.getElementById("nbSideLeft");
		panels.right = document.getElementById("nbSideRight");
		
		return panels;
	},
	
	setPanels: function (panels) {
		
	},
	
	setPanel: function (position, dimensions) {
		
	}
};
