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

	//--------Users and Appointments routing-----
    $scope.goUsers = function() {
		$location.path('/users');
	}
	
	$scope.goAppointments = function() {
		$location.path('/appointments');
	}
	
	//--------Set up Firebase ref-----------------
	var ref = new Firebase("https://secret-key-app.firebaseio.com/photos");

	
    //--------Grab photos from Facebook-------
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

			//push photos to Firebase
			ref.once('value', function(snapshot) {
				for(var i = 0; i < photos.data.length; i++){
					photoUrl = photos.data[i].source;
					photoId = photos.data[i].id;
					if (!snapshot.hasChild(photoId)) {
						ref.child(photoId).set(photoUrl);
					}
				}
			});
		});
	};
	
	//load FB SDK
    (function(d){
      var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
      js = d.createElement('script'); js.id = id; js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      d.getElementsByTagName('head')[0].appendChild(js);
    }(document));

	
		
	
	
});

