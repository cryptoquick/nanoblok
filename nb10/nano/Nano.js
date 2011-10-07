// Create our global namespace.
var NANO = NANO || {};
var app;

// Initialize Nanoblok.
function INIT () {
	app = new NANO.App();
	app.events = new BLOK.Events();
	app.panels = new NANO.Panels(document.getElementById("container"));
	app.events.set('resize', app.panels.setPanels);
	app.events.trigger('resize');
	
//	var resolution = new BLOK.Vector2();
//	var panels = new NANO.Panels(resolution);
}

// Run the initialize function using onload event.
window.onload = INIT;
