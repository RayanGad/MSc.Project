
/* ********************** Load when document ready **********************  */
$(document).ready(function($) {
	
	/* Retrieve patient information from session storage */
	var patientName = sessionStorage.getItem("name");
	
	//Unit test
	//console.log("Patient name from session storage:" + patientName);
	
	var patientAge = sessionStorage.getItem("age");
	var patientBd = sessionStorage.getItem("birthday");
	var patientUUID = sessionStorage.getItem("uuid");
	
	/* Set patient information to display */
	document.getElementById("name").innerHTML = patientName;
	var basicInfo = patientAge + " year(s) old, Birthdate: "+ patientBd;
	document.getElementById("info2").innerHTML = basicInfo;
	var uuid = "ID: " + patientUUID;
	document.getElementById("uuid").innerHTML = uuid;
	
	
	/* ***** Set medical information ******	*/
	
	/* Get alergy informtion by making AJAX call to REST API */
	let url="http://localhost:8080/openmrs/ws/rest/v1/patient/"+ patientUUID+"/allergy"; // Use Patient UUID retrived from Session Storage
	
	// Unit test
	// console.log("Alergy url:"+url);
	
	// Initiallising Header and options
	var requestHeaders = new Headers();
	requestHeaders.append("Authorization", "Basic YWRtaW46QWRtaW4xMjM=");
	requestHeaders.append("Cookie", "JSESSIONID=24D0761924138ED7E55C2CB6806B0633");

	var requestOptions = {
  		method: 'GET',
  		headers: requestHeaders,
  		redirect: 'follow'
	};
	
	let allergen='';
	
	// Call to Patients Object	
  	fetch(url, requestOptions)
  		.then(response => response.text())
  		.then((data) => {
	
			// parse response as json
			let jsonObj = JSON.parse(data)
			
			allergenType = jsonObj.results[0].allergen.allergenType;
			// Unit testing
			//console.log("Alergen type: "+allergenType);
			allergen = jsonObj.results[0].allergen.codedAllergen.display;
			// Unit testing
			//console.log("Alergen : "+allergen);
			severity = jsonObj.results[0].severity.display;
			// Unit testing
			//console.log("severity: "+severity);
			reaction = jsonObj.results[0].reactions[0].reaction.display;
			// Unit testing
			//console.log("reaction: "+reaction);
			
			document.getElementById("allergy").innerHTML = "Allergic to: "+allergen;
			document.getElementById("allergyType").innerHTML = "Allergen Type: "+allergenType;
			document.getElementById("allergySeverity").innerHTML = "Severity: "+severity;
			document.getElementById("allergyReact").innerHTML = "Reactions: "+reaction;
						
			});
});







