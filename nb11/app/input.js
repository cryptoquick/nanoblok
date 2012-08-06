define([
	'app/render',
],
function (render) {
	var input = {};
	
	input.events = {};
	input.events.keydown = {};

	input.addKeydown = function (target, keyCode, callback, method) {
		var args = Array.prototype.slice.call(arguments).slice(4);

		input.events.keydown[keyCode] = {
			method: method,
			callback: callback,
			args: args
		};

		target.addEventListener('keydown', input.runEvent, false);
	};

	input.runEvent = function (evt) {
		if (evt.keyCode) {
			var run = input.events[evt.type][evt.keyCode];

			if (run) {
				evt.preventDefault();
				run['method'].apply(this, run['args']);
				run['callback']();
				return false;
			}
		}
	};

	input.addToTransform = function (addend, axis, rotAxis) {
		if (rotAxis)
			render.addRotAxis(addend, axis);
		else
			render.axes[axis] += addend;
	};

	return input;
});