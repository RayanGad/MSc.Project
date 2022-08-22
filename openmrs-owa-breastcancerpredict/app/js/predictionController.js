/* ********************** Using AI Model API (Attempt) **********************  */

/* ********************** Load when document ready **********************  */
$(document).ready(function($) {
	$('.predictButton').click(function(){
		
		
		const formData = new FormData();
		const fileField = document.querySelector('input[type="file"]');
		url= "http://127.0.0.1:3002/predict/";
		formData.append('image', fileField.files[0]);
	
	// Initiallising options
	
		let data = new URLSearchParams();
		data.append(`key`, `value`);

		var requestOptions = {
  			method: 'POST',
  			body: formData
		};
	
	// Call to AI Model Flask API 	
	  	fetch(url, requestOptions)
  			.then(response => response.JSON())
  			.then((data) => {
			// parse response as json
				let jsonObj = JSON.parse(data)
			
				// Unit testing
				console.log(data.Normal);
			
				}).catch(function(err){
					console.log("error")
					return err;
				});		
		
		});		
	
	});