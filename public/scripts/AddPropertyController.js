var app = angular.module('Airbnb');


function AddPropertyControllerFn($state,$stateParams,$http) {
	
	var vm = this;
	vm.property = {
		address:{
			"street":"",
		"city":"",
		"state":"",
		"zipcode":"",
		"country":"",
		"formatted":""},
		location:[],
		propertyPictures:[],
		propertyVideos:[],
		ListingType:""
	};
	vm.location=[];
	vm.showPricingCatalog=true;
	vm.showBaseNote=false;
	//vm.ListingType = "";
	
	vm.UploadProperty = function(){

		if(angular.isUndefined(vm.travelLocation) || vm.travelLocation== null){
			return;
		}
		//vm.property = property;
		console.log(vm.property);

		$http.post('/CreateProperty',{"property":vm.property}).then(function(response){


			console.log(response);

		})
	}
	vm.uploadPhotos = function() {

		filepicker.pickMultiple(
			  {
			    mimetype: 'image/*',
			    container: 'modal',
			    services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX']
			  },
			  function(Blob){
			    console.log(JSON.stringify(Blob));
			    for(i=0;i<Blob.length;i++){

			    	vm.property.propertyPictures[i] = Blob[i].url;
			    }
			  },
			  function(FPError){
			    console.log(FPError.toString());
			  });


	}

	vm.uploadVideos = function() {

		filepicker.pickMultiple(
			{mimetype: 'video/*',
			container: 'modal',
			services: ['COMPUTER']},
			
			  function(Blob){
			    console.log(JSON.stringify(Blob));
			    for(i=0;i<Blob.length;i++){

			    	vm.property.propertyVideos[i] = Blob[i].url;
			    }
			  },
			  function(FPError){
			    console.log(FPError.toString());
			  });

	}

	vm.PopulateAddressFields = function(){

		console.log("populating fields");
		console.log(vm.travelLocation);

		vm.property.address={
			"street":"",
		"city":"",
		"state":"",
		"zipcode":"",
		"country":"",
		"formatted":""};

		for(var i=0;i<vm.travelLocation.address_components.length;i++)
		{
			switch(vm.travelLocation.address_components[i].types[0])
			{
				case "street_number":
				vm.property.address.street+=vm.travelLocation.address_components[i].long_name;

				break;
				case "route":
				vm.property.address.street+=", "+vm.travelLocation.address_components[i].long_name;
				break;
				case "locality":
				vm.property.address.city+=vm.travelLocation.address_components[i].long_name;
				break;
				case "administrative_area_level_1":
				vm.property.address.state+=vm.travelLocation.address_components[i].long_name;
				break;
				case "postal_code":
				vm.property.address.zipcode+=vm.travelLocation.address_components[i].long_name;
				break;
				case "country":
				vm.property.address.country+=vm.travelLocation.address_components[i].short_name;
				break;

			}
		}

		vm.property.address.formatted = vm.travelLocation.formatted_address;
		vm.property.location= [vm.travelLocation.geometry.location.lng(),vm.travelLocation.geometry.location.lat()];

		console.log(vm.property.location[0]);
	}

	vm.UpdateListingType = function () {

		console.log(vm.property.ListingType);

		if(vm.property.ListingType=="auction")
		{
			vm.showPricingCatalog=false;
			vm.showBaseNote = true;
		}



	}


	// vm.uploadFile = uploadFile;
}



app.controller('AddPropertyController',AddPropertyControllerFn);

function uploadFile(){

 		response = event.fpfile.url;
 		console.log(response); //Example Response = https://cdn.filestackcontent.com/tgs6q0d2Qy4Hm35WcYqA

       //Set the respone as Scope.URL and call the POST method using Angular
       	


 	//alert(response);
};