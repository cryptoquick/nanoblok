function makeXHR (type, operation, data, callback) {
	var newData;
	var status = -1;
	var request = new XMLHttpRequest();
	if (!request) {
		loggit("Unable to connect.");
	}
	
	request.open(type, operation, true);
	request.setRequestHeader("Content-type", "application/json");
	// console.log(type + ", directory: /" + operation + ", data: " + data);
	
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			newData = request.responseText;
			callback(newData);
		}
	}
	
	try {
		request.send(data);
	} catch (e) {
		console.log(e);
	}
}

// Serialization.
function saveField () {
	// var fieldString = JSON.stringify(Field);
	var title = document.getElementById('saveTitle').value
	
	if (title == '') {
		Dialog.alert('No title entered.');
	}
	else if (Field.length == 0) {
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
		
		loggit("Blocks saved.");
	}
}

function listFields () {
	makeXHR("GET", "list", null, populateList);
}

function populateList (listData) {
	if (listData != undefined) {
		console.log(listData + ', adding json.');
		Dialog.json = listData;
		Dialog.show('dialog');
	}
	else {
		console.log(listData);
		loggit('There was an error listing.');
	}
}

// Deserialization.
function loadModel (url) {
	var fieldString = makeXHR("GET", url, null, loadField);
	// Field = JSON.parse(fieldString);
}

function loadField (loadData) {
	var loadString = JSON.parse(loadData);
	document.getElementById('saveTitle').value = loadString.title;
	Field = loadString.Field;
	Dialog.hide();
	rebuild();
}

// Temporary solution.
function imageCanvas () {
	var dataURL = document.getElementById('display').toDataURL(); // Will need to change to renderer once finished.
	
	return dataURL;
}

