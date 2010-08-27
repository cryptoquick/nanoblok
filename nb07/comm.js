function makeXHR (operation, data) {
	var newData;
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
				newData = request.responseText;
			}
		}
	}
	
	request.open("POST", "/" + operation, true);
	console.log("POST, directory: /" + operation + ", data: " + data);
	
	request.setRequestHeader("Content-type", "application/json");
	
	try {
		request.send(data);
	} catch (e) {
		changeStatus(e);
	}
	
	console.log(newData);
	return newData;
}

// Serialization.
function saveField () {
	// var fieldString = JSON.stringify(Field);
	var title = document.getElementById('saveTitle').value
	
	if (title == '') {
		Dialog.alert('No title entered.');
	}
	else if (Field == []) {
		Dialog.alert('No blocks to save.');
	}
	else {
		var dbData = {
			title: title,
			Field: Field
		//	imageCanvas()
		};
	
		data = JSON.stringify(dbData);
	
		makeXHR("save", data);
	}
}

// Deserialization.
function loadField () {
	var fieldString = makeXHR("load", fieldString);
	Field = JSON.parse(fieldString);
}

// Temporary solution.
function imageCanvas () {
	var dataURL = document.getElementById('display').toDataURL(); // Will need to change to renderer once finished.
	
	return dataURL;
}
