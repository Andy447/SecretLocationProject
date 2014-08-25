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

secretLocApp.controller('usersController', function($scope) {});

secretLocApp.controller('appointmentsController', function($scope) {});

secretLocApp.controller('homeController', function ($scope, $http, $location) {
    $scope.goUsers = function() {
		$location.path('/users');
	}
	
	$scope.goAppointments = function() {
		$location.path('/appointments');
	}

    //App ID
    var fbID = 675427939218868;

	window.fbAsyncInit = function() {
		FB.init({
			appId      : fbID,
			xfbml      : true,
			version    : 'v2.0'
		});

		console.log('getting Album');
		FB.api("/530901206937986/photos", function (photos) {
			console.log(photos);
			//FB api returns JSON array of photos. 
			//Loop through array, adding new photos to DB. 
			//Compares picture URL's to avoid duplicates.

			for(var i = 0; i < photos.data.length; i++){
				console.log(photos.data[i].source);
			}
		});
	};
	
	// Load the SDK Asynchronously
    (function(d){
      var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
      js = d.createElement('script'); js.id = id; js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      d.getElementsByTagName('head')[0].appendChild(js);
    }(document));
});

