window.addEventListener('load', function () {
	Initialize();
}, false);

function Initialize () {
	var date0 = new Date();
	window.$C = new Common();
	swatchInit();
	overhead(example1);
	var date1 = new Date();
	console.log("Took " + (date1 - date0) + "ms to render.");
}
