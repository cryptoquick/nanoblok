//	Copyright 2009 Alex Trujillo
//	Full source available here under the MIT License: http://code.google.com/p/nanoblok/

//	SUMMARY
//	loggit.js takes a message and outputs it to a debug box on the screen.
//	Because the box does not have a scroll bar, I had to write scrolling code.
//	Not much has changed here since vektornye. Soon to be made into a full-fledged text.js.

var svgNS = 'http://www.w3.org/2000/svg';

function loggit(str) {
	var log = document.getElementById("debugText");
	
	var childCount = log.getElementsByTagName('tspan').length;

	if(childCount >= 3){
		log.removeChild(log.firstChild);
		log.firstChild.setAttributeNS(null, 'dy', 5);
	}
	
	var textElement = document.createElementNS(svgNS, 'tspan');
	textElement.setAttributeNS(null, 'x', '20');
	textElement.setAttributeNS(null, 'dy', '18');

	textElement.textContent = str;
	
	log.appendChild(textElement);
}