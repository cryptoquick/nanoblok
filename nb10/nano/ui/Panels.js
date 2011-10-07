NANO.Panels = function (container) {
	// Position panels.
	this.container = container;
	
	return this;
};

NANO.Panels.prototype = {
	constructor: NANO.Panels,
	
	container, panels,
	
	setPanels: function (resolution) {
		var panels = new NANO.PanelData(resolution);
		
		for (p in panels) {
			var panel = panels[p];
			this.setPanel(panel);
		}
	},
	
	setPanel: function (panel) {
		
	}
};
