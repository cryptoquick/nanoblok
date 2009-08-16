/* SVG Effects */

var hoverlist = new Object();

function tileHover (target, inout) {
	var tile = document.getElementById(target.id);
	loggit(target.id + ': ' + target.getAttribute('c') + ', ' + target.getAttribute('r'));
	
	if (inout == 'in') {
		tile.setAttributeNS(null, 'fill', 'orange');
	//	tile.setAttributeNS(null, 'stroke', '#aaa');
	}
	if (inout == 'out') {
		tile.setAttributeNS(null, 'fill', '#ddd');
	//	tile.setAttributeNS(null, 'stroke', '#aaa');
	}
}