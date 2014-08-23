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

secretApp.controller('loginController', function($scope, Users) {
	Users.$loaded(function(data) {
		$scope.users = data;
	});

	$scope.login = function () {
		var data = {name: $scope.nameInput,
					phone: $scope.phoneInput};
		$scope.users.$add(data);
		$scope.nameInput = $scope.phoneInput = "";
		window.location.href = '/#/view';
	}
});

secretApp.controller('viewController', function($scope) {
	//do something
});


//--------push to database----------

secretApp.factory("Users", ["$firebase", function($firebase) {
	var ref = new Firebase("https://secret-key-app.firebaseio.com/login");
	return $firebase(ref).$asArray();
}]);






