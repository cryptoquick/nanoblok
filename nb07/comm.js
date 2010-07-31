function makeXHR (type, operation, data, callback) {
	var status = -1;
	var request = new XMLHttpRequest();
	if (!request) {
		loggit("Unable to connect.");
	}
	
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			try {
				status = request.status;
			}
			catch (e) {};
			
			if (status == 200) {
				callback(request.response.responseText);
				request.onreadystatechage = function () {};
			}
		}
	}
	
	request.open(type, "/" + operation, true);
	
	if (type == "POST") {
		request.setRequestHeader("Content-type", "application/json");
		request.setRequestHeader("Content-length", data.length);
		request.setRequestHeader("Connection", "close");
	}
	
	try {
		request.send(data);
	} catch (e) {
		changeStatus(e);
	}
}

// Serialization.
function saveField () {
	var fieldString = JSON.stringify(Field);
	makeXHR("POST", "save", fieldString, successfulDelivery);
}

// Deserialization.
function loadField () {
	var fieldString = makeXHR("POST", "load", fieldString, successfulDelivery);
	Field = JSON.parse(fieldString);
}

function successfulDelivery (message) {
	loggit(message);
}