var Dialog = {
	dialogEl: {},
	showing: false,
	
	text: [
		'Test object',
		'Second test object',
		'Third test object!',
		'Fourth',
		'Fifth'
	],
	
	data: [
		
	],
	
	init: function () {
		this.dialogEl = document.getElementById('dialog');
		
		this.verts(10, 'dialogOuter');
		this.verts(20, 'dialogInner');
		
		this.hide();
		this.print();
	},
	
	verts: function (inset, elementID) {
		var vertices = [
			{x: $C.gridSize.x / 2, y: inset},
			{x: $C.gridSize.x - inset, y: $C.gridSize.fullY / 4 + inset / 2},
			{x: $C.gridSize.x - inset, y: $C.gridSize.fullY / 4 + $C.gridSize.fullY / 2 - inset / 2},
			{x: $C.gridSize.x / 2, y: $C.gridSize.fullY - inset},
			{x: inset, y: $C.gridSize.fullY / 4 + $C.gridSize.fullY / 2 - inset / 2},
			{x: inset, y: $C.gridSize.fullY / 4 + inset / 2}
		];
		
		var element = document.getElementById(elementID);
		
		this.draw(vertices, element);
	},
	
	draw: function (vertices, element) {
		var hex = [];
		var path = '';
		
		// Offset each coordinate.
		for (var i = 0; i < 6; i++) {
			hex[i] = {x: vertices[i].x + $C.edges.left, y: vertices[i].y + $C.edges.fullTop - 33};
		}
		
		for (var corner = 0; corner < 6; corner++) {
			if (corner == 0) {
				path += 'M ' + hex[corner].x + ' ' + hex[corner].y;
			}
			else if (corner == 5) {
				path += ' ' + hex[corner].x + ' ' + hex[corner].y + ' Z';
			}
			else {
				path += ' L ' + hex[corner].x + ' ' + hex[corner].y;
			}
		}
		
		element.setAttributeNS(null, 'd', path);
		element.setAttributeNS(null, 'stroke', 'none');
	},
	
	show: function () {
		this.dialogEl.style.display = 'inline';
		this.showing = true;
	},
	
	hide: function () {
		this.dialogEl.style.display = 'none';
		this.showing = false;
	},
	
	print: function () {
		var headerText = 'Choose a model:';
		var dialogLeft = document.getElementById('dialogLeft');
		
		maketext(dialogLeft, headerText);
		
		for (var i = 0, ii = this.text.length; i < ii; i++) {
			var textElement = maketext(dialogLeft, '- ' + this.text[i]);
			textElement.setAttributeNS(null, 'id', 'leftList');
		}
	},
	
	lastHighlight: false,
	
	highlight: function (target) {
		if (this.lastHighlight) {
			this.lastHighlight.setAttributeNS(null, 'fill', '#666');
		}
		
		target.setAttributeNS(null, 'fill', 'orange');
		
		this.lastHighlight = target;
	}
};

