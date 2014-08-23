angular.module("loginapp", ["firebase"])

	//---controller---
	function userController($scope, $firebaseSimpleLogin) {
		var ref = new Firebase("https://secret-key-app.firebaseio.com/login");
		$scope.loginObj = $firebaseSimpleLogin(ref);
	}



	/*function userController($scope, Users) {
		Users.$loaded(function(data) {
			$scope.users = data;
		});	
	
		$scope.login = function () {
			var data = {name: $scope.nameInput,
						phone: $scope.phoneInput};
			$scope.users.$add(data);
			$scope.nameInput = $scope.phoneInput = "";
		} 
	}
	*/


