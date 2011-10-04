// Create our global namespace.
var NANO = NANO || {};

// Initialize Nanoblok.
function INIT () {
	var panels = BLOK.Events.resize(NANO.Panels);
	panels.render(document.getElementById("container");
	
//	var resolution = new BLOK.Vector2();
//	var panels = new NANO.Panels(resolution);
}

// Run the initialize function using onload event.
window.onload = INIT;
