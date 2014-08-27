var secretApp = angular.module('secretkeyapp', [
	'ngRoute',
	'firebase'
	]);

//--------routing------------------
secretApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'user.html',
			controller: 'loginController'
		})
		.when('/view', {
			templateUrl: 'view.html',
			controller: 'viewController'
		})
});


//------------loginController------------

secretApp.controller('loginController', function($scope, $firebaseSimpleLogin, $location) {
	var ref = new Firebase("https://secret-key-app.firebaseio.com/login");
	var authClient = new FirebaseSimpleLogin(ref, function(error, user) {
		$scope.$apply(function() {
			console.log(arguments);
			if (error !== null) {
				console.log("Login error:", error);
			} else if (user !== null) {
				console.log("User authenticated with Firebase:", user);
				$location.path('/view');
			} else {
				console.log("User is logged out");
			}
		});
	});

	$scope.login = function() {
		authClient.createUser($scope.emailInput, $scope.emailInput, function(error) {

			if (error !== null) {
				console.log(error);
				if (error.code === "EMAIL_TAKEN") { //login
					authClient
						.login("password", {email: $scope.emailInput, password: $scope.emailInput})
						.then(function(user) {
								$scope.$apply(function() {
									$location.path('/view');
								});
							} 
						)
				}
			} else { //registration
				$scope.$apply(function() {
					authClient
						.login("password", {email: $scope.emailInput, password: $scope.emailInput})
						.then(function(user) {
							ref.child(user.id).set({email: $scope.emailInput, index: 0});
						})
					$location.path('/view');
				});
			}
		});
	}

});


//--------view Controller---------------
secretApp.controller('viewController', function($scope, $firebase, $firebaseSimpleLogin, $location) {	
	$scope.show = function(shown, hidden1, hidden2) {
		document.getElementById(shown).style.display='block';
		document.getElementById(hidden1).style.display='none';
		document.getElementById(hidden2).style.display='none';
		return false;
	}

	var photoRef = new Firebase("https://secret-key-app.firebaseio.com/photos");
	var photoArray = $firebase(photoRef).$asArray();

	var ref = new Firebase("https://secret-key-app.firebaseio.com/login");
	var authClient = new FirebaseSimpleLogin(ref, function(error, user) {
	
		if (error !== null) {
			console.log("Login error:", error);
		} else if (user !== null) {
			console.log("User authenticated with Firebase:", user);
			initUser(user);
		} else {
			console.log("User is logged out");
		}
	});
	
	var initUser = function(user) {
		console.log(user);
		var userIndexObj = $firebase(ref.child(user.id).child('index')).$asObject();
		userIndexObj.$loaded().then(function() {
			var userIndex = userIndexObj.$value;
			console.log(userIndex);
			console.log("photoArray:", photoArray);
			console.log("length:", photoArray.length);

			if (userIndex < photoArray.length) {
				var photo = photoArray[userIndex];

				$scope.currentPhoto = photo.$value;
				console.log("current photo: ", $scope.currentPhoto);

				$scope.like = function() {
					ref.child(user.id).child('favourites').child(photo.$id).set(photo.$value);
					ref.child(user.id).child('index').set(userIndex + 1);
					initUser(user);
				}

				$scope.dislike = function() {
					ref.child(user.id).child('index').set(userIndex + 1);
					initUser(user);
				}
			} else {
				$scope.currentPhoto = "css/2.png";
			}
		
		});
		
		$scope.deletePhoto = function(photo) {
			ref.child(user.id).child('favourites').child(photo.$id).set(null);
		}

		var userFavourites = $firebase(ref.child(user.id).child('favourites')).$asArray();
		userFavourites.$loaded().then(function() {
			$scope.userFavourites = userFavourites;
		});

		userBookingsRef = ref.child(user.id).child('bookings');
		var userBookings = $firebase(userBookingsRef).$asArray();
		userBookings.$loaded().then(function() {
			$scope.userBookings = userBookings;

			var bookingsRef = new Firebase("https://secret-key-app.firebaseio.com/allBookings");
			var appointments = $firebase(bookingsRef).$asArray();
			appointments.$loaded().then(function() {
				$scope.appointments = appointments;
				$scope.times = ["10am (Tasting Room only)", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm (Tasting Room only)", "9pm (Tasting Room only)", "10pm (Tasting Room only)", "11pm (Tasting Room only)", "12am (Tasting Room only)"];
				$scope.book = function() {
					var appointment = {
						name: $scope.newName,
						phone: $scope.newPhone,
						partySize: $scope.newPartySize,
						email: user.email,
						userId: user.id,
						date: $scope.newDate,
						time: $scope.newTime
					};


					bookingsRef.once('value', function(snapshot) {
						//check for appointment conflict in between hours
						if(!snapshot.hasChild($scope.newDate) || !snapshot.child($scope.newDate).hasChild($scope.newTime)) {
							userBookingsRef.child($scope.newDate).child($scope.newTime).set(appointment);
							bookingsRef.child($scope.newDate).child($scope.newTime).set(appointment);
							$scope.newPartySize = $scope.newDate = $scope.newTime = "";
						} else {
							alert("Booking time conflict!");
							$scope.newPartySize = $scope.newDate = $scope.newTime = "";
						}
					});
				}

				
				$scope.remove = function(time) {
					var firebaseUrl = "https://secret-key-app.firebaseio.com/login/".concat(time.userId,"/bookings");
					var userRef = new Firebase(firebaseUrl);
					userRef.child(time.date).child(time.time).set(null);
					bookingsRef.child(time.date).child(time.time).set(null);
				}
			});
		});
	}

	$scope.logout = function () {
		authClient.logout();
		console.log("User is logged out");
		$location.path('/');
	}
});




