var secretApp = angular.module('secretkeyapp', [
	'ngRoute',
	'firebase'
	]);

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


//------------controllers------------

secretApp.controller('loginController', function($scope, $firebaseSimpleLogin, $location) {
	var ref = new Firebase("https://secret-key-app.firebaseio.com/login");
	var authClient = new FirebaseSimpleLogin(ref, function(error, user) {
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

	$scope.login = function () {
		authClient.createUser($scope.emailInput, $scope.pwInput, function(error) {

			if (error !== null) {
				console.log(error);
				if (error.code === "EMAIL_TAKEN") { //login
					authClient
						.login("password", {email: $scope.emailInput, password: $scope.pwInput})
						.then(function(user) { $location.path('/view'); }, 
							function(error) {
								if (error.code === "INVALID_PASSWORD") {
									console.log("This was an invalid password");
									alert("Invalid password!");
									$scope.emailInput = $scope.pwInput = "";
								}
							}
						)
				} else if (error.code === "INVALID_PASSWORD") {
					console.log("This was an invalid password");
					alert("Invalid password!");
					$scope.emailInput = $scope.pwInput = "";
				}
			} else { //registration
				authClient
					.login("password", {email: $scope.emailInput, password: $scope.pwInput})
					.then(function(user) {
						ref.child(user.id).set({});
					})
				$location.path('/view');
			}
		});
	}


/*	$scope.on("authClient:login", function(user) {
		$location.path('/view');
	}

	$scope.on("authClient:error", function(error) {
		if (error.code === 'INVALID_PASSWORD') {
			console.log("This was an invalid password");
			alert("Invalid password!");
			$scope.emailInput = $scope.pwInput = "";
		}
	} 
*/

});

secretApp.controller('viewController', function($scope, $firebaseSimpleLogin, $location) {
	console.log("I'm on the view page");
	var ref = new Firebase("https://secret-key-app.firebaseio.com/login");
	var authClient = new FirebaseSimpleLogin(ref, function(error, user) {
		console.log(arguments);
		if (error !== null) {
			console.log("Login error:", error);
		} else if (user !== null) {
			console.log("User authenticated with Firebase:", user);
		} else {
			console.log("User is logged out");
		}
	});

	$scope.logout = function () {
		authClient.logout();
		console.log("User is logged out");
		$location.path('/');
	}

});





