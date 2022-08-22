/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

(function () {
  'use strict';
  document.addEventListener("DOMContentLoaded", function(event) {
	// Unit testing
    console.log('openmrs-owa-breastcancerpredict OpenMRS Open Web App Started.');
  });
}());

/* Testing manifest file load */
function loadManifest() {
    jQuery.getJSON('manifest.webapp').done(function (data) {
        sessionStorage.setItem("serverUrl", data.activities.openmrs.href);
    }).fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("reading manifest file request Failed: " + err);
    });
}


/* ********************** Load data to table **********************  */
function loadTableDate(json) {
	
	//Get search table body
	const searchBody = document.querySelector('#searchTable > tbody');
	
	// clear table
	while(searchBody.firstChild){
		searchBody.removeChild(searchBody.firstChild);	
	}
	
	// populate table 	
	json.forEach((row)=>{
		
		const tr = document.createElement("tr");		
		row.forEach((item)=>{
			//Unit testing
			//console.log(item);
			const td = document.createElement("td");
			td.textContent = item;
			tr.appendChild(td);
			
		});
		
		searchBody.appendChild(tr);
	});
    
}

function populateTable(data){
	
	 //Unit Testing
 	//console.log("populate table")
 	
	// POPULATE PATIENT INFO
	var table = "" ;
 	table += "<tr>";
	table += "<td>" + data['id'] +"</td>" + "<td>" + data['name'] +"</td>" + "<td>" + data['age'] +"</td>" + "<td>" + data['birthday'] +"</td>";
	table += "</tr>";
 	
	document.getElementById("tableBody").innerHTML = table;
 
}

/* ********************** API Call function ********************** */
function apiCall(url, reqOpt){
	
	// Call to person table
  					fetch(url, reqOpt)
  						.then(response => response.text())
  						.then((data) => {
						
						// parse response as json
						let jsonObj = JSON.parse(data);
						console.log('Json Obj:' + jsonObj);
						return(jsonObj);
   	 					
   	 					} )          	     /* Promise successful*/
  					.catch(error => console.log('error', error)); 
	
}

/* ********************** Open Next Page funtion **********************  */
function url(){
	location.href = 'patientInfo.html';
}



/* ********************** Load when document ready **********************  */
$(document).ready(function($) {
	
	// Search-Table click hover changes row color
	$('#searchTable').on('hover', 'tr', function(){
		$(this).css('background-color', '#eee');
    });
    
	// Search-Table click event opens patient information page
	$('#searchTable').on('click', 'tr', function(){
		
		// Unit Testing
		//console.log('You clicked row '+ ($(this).index()));
		
		url();
    });	
    
    /* Input search name */
    var searchName = $('#search-input');
    	
	// Search button click
	$('#buttonsearch').click(function(){
		
		if (searchName == ''){
			alert("Please select a name!");
		}else{

			const url = "http://localhost:8080/openmrs/ws/rest/v1/patient?q="+searchName.val()+"&limit=10"
		
			// Unit Testing
			//console.log("Patient Onject URL: "+url);			
		
		/* Using Fetch API() to make AJAX calls in jQuery*/	
			
			// Initiallising Header and options for call
			var requestHeaders = new Headers();
			requestHeaders.append("Authorization", "Basic YWRtaW46QWRtaW4xMjM=");
			requestHeaders.append("Cookie", "JSESSIONID=24D0761924138ED7E55C2CB6806B0633");

			var requestOptions = {
  				method: 'GET',
  				headers: requestHeaders,
  				redirect: 'follow'
			};	
				
  			let uuid=''; 
  			
  			// Call to Patients Object	
  			fetch(url, requestOptions)
  				.then(response => response.text())
  				.then((data) => {
					// parse response as json
					let jsonObj = JSON.parse(data)
					uuid = jsonObj.results[0].uuid;
					
					// URL for Person object call
					let url = "http://localhost:8080/openmrs/ws/rest/v1/person/"+uuid;
					
					// Unit testing
					//console.log('person object URL:'+ url);
					
					// Call to Person Object
					fetch(url, requestOptions)
  						.then(response => response.text())
  						.then((data) => {
						
						// parse response as json
						let jsonObj = JSON.parse(data);
						
						// Unit testing
						//console.log('Json Obj:' + jsonObj);
						//console.log(jsonObj.age);
						
						//Getting info as object ('key', value)
   	 					let obj ={};
   	 					obj["id"]= jsonObj.uuid;
   	 					obj['name']=jsonObj.display;
   	 					obj['age']=jsonObj.age;
   	 					obj['birthday']= jsonObj.birthdate.slice(0,10);
   	 					
   	 					// save session data 
   	 					sessionStorage.setItem("uuid", jsonObj.uuid);
   	 					sessionStorage.setItem("name", jsonObj.display);
   	 					sessionStorage.setItem("age", jsonObj.age);
   	 					sessionStorage.setItem("birthday", jsonObj.birthdate.slice(0,10));
   	 					 	 					
						populateTable(obj);
   	 					
   	 					} )          	     /* Promise successful*/
  					.catch(error => console.log('error', error)); 

   	 				
   	 				} )          	     /* Promise successful*/
  				.catch(error => console.log('error', error)); 		 /* Promise unsuccessful*/
  			
  			
  		}
  			
        
	})
});


/* API Syntex From REST website (https://rest.openmrs.org/#list-patient-by-uuid)
var requestHeaders = new Headers();
		requestHeaders.append("Authorization", "Basic YWRtaW46QWRtaW4xMjM=");
		requestHeaders.append("Cookie", "JSESSIONID=24D0761924138ED7E55C2CB6806B0633");

		var requestOptions = {
  			method: 'GET',
  			headers: requestHeaders,
  			redirect: 'follow'
		};

		fetch("https://dev3.openmrs.org/openmrs/ws/rest/v1/patient?q=John&v=default=&limit=1", requestOptions)
  			.then(response => response.text())
  			.then(result => console.log(result))
  			.catch(error => console.log('error', error));
		
 */
