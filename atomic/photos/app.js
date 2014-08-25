var secretLocApp = angular.module('secretlocationapp', [
	'ngRoute',
	'firebase'
	]);

secretLocApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'home.html',
			controller: 'homeController'
		})
		.when('/users', {
			templateUrl: 'users.html',
			controller: 'usersController'
		})
		.when('/calendar', {
			templateUrl: 'appointments.html',
			controller: 'appointmentsController'
		})	
});


secretLocApp.controller('homeController', function($scope, $firebase, $location) {
	//var ref = new Firebase("https://secret-key-app.firebaseio.com");
	
	$scope.goUsers = function() {
		$location.path('/users');
	}
	
	$scope.goAppointments = function() {
		$location.path('/appointments');
	}

});

secretLocApp.controller('usersController', function($scope) {});

secretLocApp.controller('appointmentsController', function($scope) {});




/*
secretLocApp.controller('homeController', function ($scope, $http) {
    $scope.hashTags = [];


//------Initialize Facebook SDK------
    //App ID
    var fbID = 675427939218868;

    window.fbAsyncInit = function() {
      FB.init({
        appId      : fbID,
        xfbml      : true,
        version    : 'v2.0'
      });

	// Load the SDK Asynchronously
    (function(d){
      var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
      js = d.createElement('script'); js.id = id; js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      d.getElementsByTagName('head')[0].appendChild(js);
    }(document));

	 FB.login(function(){
         FB.api(
          "/501129938",
          function (response) {
            if (response && !response.error) {
              console.log('success!');
              getAlbum();
            }
            else{
              console.log('error', response);
            }
          }
      );
    	}, {scope: 'publish_actions,user_photos'}); 
    
	};

    var getAlbum = function(){
      //Flag for when we add new pic
      var addedNew = false;

      console.log('getting Album');
		FB.api(
			"/10152433094869939/photos",
			function (photos) {
			  
			  	//FB api returns JSON array of photos. 
				//Loop through array, adding new photos to DB. 
				//Compares picture URL's to avoid duplicates.
			 
			  for(var photo in photos["data"]){
				  var found = false;
				  for(var f in $scope.slides){
				    if($scope.slides[f].picURL === photos["data"][photo].source){
				      found = true;
				    }
				  }
				if(!found){
				  addedNew = true;
				}
			  }
			}
		);
    };
});
*/
