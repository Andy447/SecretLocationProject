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
		authClient.createUser($scope.emailInput, $scope.passwordInput, function(error) {

			if (error !== null) {
				console.log(error);
				if (error.code === "EMAIL_TAKEN") { //login
					authClient
						.login("password", {email: $scope.emailInput, password: $scope.passwordInput})
						.then(function(user) {
								$scope.$apply(function() {
									$location.path('/view');
								});
							}, 
							function(error) {
								$scope.$apply(function() {
									if (error.code === "INVALID_PASSWORD") {
										console.log("This was an invalid password");
										alert("Invalid password!");
										$scope.passwordInput = "";
									}
								});
							}
						)
				} else if (error.code === "INVALID_PASSWORD") {
					$scope.$apply(function() {
						console.log("This was an invalid password");
						alert("Invalid password!");
						$scope.passwordInput = "";
					});
				}
			} else { //registration
				$scope.$apply(function() {
					authClient
						.login("password", {email: $scope.emailInput, password: $scope.passwordInput})
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
	console.log("I'm on the view page");
	
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
		var userIndexObj = $firebase(ref.child(user.id).child('index')).$asObject();
		userIndexObj.$loaded().then(function() {
			var userIndex = userIndexObj.$value;
			console.log(userIndex);
			var photo = photoArray[userIndex];

			$scope.currentPhoto = photo.$value;
			console.log($scope.currentPhoto);

			$scope.like = function() {
				ref.child(user.id).child('favourites').child(photo.$id).set(photo.$value);
				ref.child(user.id).child('index').set(userIndex + 1);
				initUser(user);
			}

			$scope.dislike = function() {
				ref.child(user.id).child('index').set(userIndex + 1);
				initUser(user);
			}
		});
	}


	$scope.logout = function () {
		authClient.logout();
		console.log("User is logged out");
		$location.path('/');
	}

});





