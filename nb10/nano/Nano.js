// Create our global namespace.
var NANO = NANO || {};

var app;

// Initialize Nanoblok.
function INIT () {
	app = new NANO.App();
	app.events = new NANO.Events();
	app.panels = new NANO.Panels(new BLOK.Element("div", "container").put(document.body));
	app.events.set('resize', app.panels.setPanels);
	app.events.trigger('resize');
	
//	var resolution = new BLOK.Vector2();
//	var panels = new NANO.Panels(resolution);
}
