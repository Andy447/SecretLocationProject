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
		.when('/appointments', {
			templateUrl: 'appointments.html',
			controller: 'appointmentsController'
		})	
});

secretLocApp.controller('usersController', function($scope, $firebase, $location) {

	var ref = new Firebase("https://secret-key-app.firebaseio.com/login");
	var userArray = $firebase(ref).$asArray();
	userArray.$loaded().then(function() {
		$scope.userArray = userArray;
	});

	$scope.back = function() {
		$location.path('/');
	}

	$scope.goAppointments = function() {
		$location.path('/appointments');
	}
});

secretLocApp.controller('appointmentsController', function($scope, $firebase, $location) {

	var ref = new Firebase("https://secret-key-app.firebaseio.com/allBookings");
	var apptArray = $firebase(ref).$asArray();
	apptArray.$loaded().then(function() {
		$scope.apptArray = apptArray;

		$scope.remove = function(time) {
			var firebaseUrl = "https://secret-key-app.firebaseio.com/login/".concat(time.userId,"/bookings");
			var userRef = new Firebase(firebaseUrl);
			userRef.child(time.date).child(time.time).set(null);
			ref.child(time.date).child(time.time).set(null);
		}
	});

	$scope.back = function() {
		$location.path('/');
	}

	$scope.goUsers = function() {
		$location.path('/users');
	}
});

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

