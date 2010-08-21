function makeXHR (type, operation, data) {
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
				loggit(request.response.responseText);
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
	// var fieldString = JSON.stringify(Field);
	
	var dbData = [
		document.getElementById('saveAuthor').value,
		document.getElementById('saveTitle').value,
		Field,
		0.01,
		"public",
		imageCanvas()
	];
	
	data = JSON.stringify(dbData);
	
	makeXHR("POST", "save", data);
}

// Deserialization.
function loadField () {
	var fieldString = makeXHR("POST", "load", fieldString);
	Field = JSON.parse(fieldString);
}

// Temporary solution.
function imageCanvas () {
	var dataURL = document.getElementById('display').toDataURL(); // Will need to change to renderer once finished.
	
	return dataURL;
}