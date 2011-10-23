NANO.Panels = function (container) {
	// Position panels.
	this.container = container;
	
	return this;
};

NANO.Panels.prototype = {
	constructor: NANO.Panels,
	
	container: {}, panels: {},
	
	setPanels: function (resolution) {
		var panels = new NANO.PanelData(resolution);
		
		for (p in panels) {
			var panel = panels[p];
			this.setPanel(panel);
		}
	},
	
	setPanel: function (panel) {
		if (!panel.parent) {
			var el = new BLOK.Element(panel.id);
			
			el.set("id", panel.id);
			el.style("position", "absolute");
			el.style("left", panel.position.x);
			el.style("top", panel.position.y);
			el.style("width", panel.dimensions.x);
			el.style("height", panel.dimensions.y);
			el.style("backgroundColor", "red");
			
			this.panels[panel.id] = el;
		}
	}
};
