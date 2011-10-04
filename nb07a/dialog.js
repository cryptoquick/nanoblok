var Dialog = {
	dialogEl: {},
	alertEl: {},
	showing: false,
	active: 'none',
	json: '[]',
	testString: '[{"title":"","url":"/load/ag9uYW5vYmxvay1lZGl0b3JyDQsSBlNwcml0ZRiVTgw"},{"title":"","url":"/load/ag9uYW5vYmxvay1lZGl0b3JyDgsSBlNwcml0ZRjK3AMM"},{"title":"","url":"/load/ag9uYW5vYmxvay1lZGl0b3JyDgsSBlNwcml0ZRjxogQM"}]',
	
	data: [],
	
	init: function () {
		this.dialogEl = document.getElementById('dialog');
		this.alertEl = document.getElementById('alert');
		
		// Load Dialog
		this.verts(10, 'dialogOuter');
		this.verts(20, 'dialogInner');
		
		// Alert Window
		this.verts(200, 'alertOuter');
		this.verts(210, 'alertInner');
		
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
	
	show: function (type) {
		if (type == 'dialog' && !this.showing) {
			this.print();
			this.dialogEl.style.display = 'inline';
			this.showing = true;
		}
		if (type == 'alert' && !this.showing) {
			this.alertEl.style.display = 'inline';
			this.showing = true;
		}
	},
	
	hide: function () {
		this.dialogEl.style.display = 'none';
		this.alertEl.style.display = 'none';
		
		this.showing = false;
	},
	
	print: function () {
		var headerText = 'Choose a model:';
		var dialogLeft = document.getElementById('dialogLeft');
		
		removetext(dialogLeft);
		addtext(dialogLeft, headerText);
		
		this.data = JSON.parse(this.json);
		
		for (var i = 0, ii = this.data.length; i < ii; i++) {
			var textElement = addtext(dialogLeft, '- ' + this.data[i].title);
			textElement.setAttributeNS(null, 'id', 'leftList');
			console.log(this.data[i].url);
			textElement.setAttributeNS(null, 'url', this.data[i].url);
		}
	},
	
	lastHighlight: false,
	
	highlight: function (target) {
		if (this.lastHighlight) {
			this.lastHighlight.setAttributeNS(null, 'fill', '#666');
		}
		
		target.setAttributeNS(null, 'fill', 'orange');
		
		this.lastHighlight = target;
	},
	
	alert: function (msg) {
		this.show('alert');
		var alertText = document.getElementById('alertText');
		removetext(alertText);
		addtext(alertText, msg);
	},
	
	alertHighlight: false,
	
	alertButton: function (highlight) {
		var alertButton = document.getElementById('alertButton');
		
		if (highlight) {
			alertButton.setAttributeNS(null, 'fill', '#eee');
		}
		else {
			alertButton.setAttributeNS(null, 'fill', '#ddd');
		}
	}
};

