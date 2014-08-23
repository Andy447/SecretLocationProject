/* $(document).ready(function() {

    var remember = $.cookie('remember');
    if (remember == 'true') {
        var name = $.cookie('nameInput');
        var phone = $.cookie('phoneInput');

        // autofill the fields
        $('#nameInput').val(name);
        $('#phoneInput').val(phone);
    }


	$("#user").submit(function() {
	    if ($('#remember').is(':checked')) {
	        var name = $('#nameInput').val();
	        var phone = $('#phoneInput').val();
			//set cookies
			$.cookie('name', name);
			$.cookie('phone', phone);
			$.cookie('remember', true);             
	   	} else {
	        // reset cookies
	        $.cookie('name', null);
	        $.cookie('phone', null);
	        $.cookie('remember', null);
	    }
  });
}); */



angular.module("loginapp", ["firebase"])
	.factory("Users", ["$firebase", function($firebase) {
		var ref = new Firebase("https://secret-key-app.firebaseio.com/login");
		return $firebase(ref).$asArray();
	}])

	//---controller---
	function userController($scope, Users) {
		Users.$loaded(function(data) {
			$scope.users = data;
		});
		
	/*	$scope.login = function () {
			console.log($scope.phoneInput);
			ref.child($scope.phoneInput).update({name: $scope.nameInput});
			$scope.nameInput = $scope.phoneInput = "";
		}		
	*/
		$scope.login = function () {
			var data = {name: $scope.nameInput,
						phone: $scope.phoneInput};
			$scope.users.$add(data);
			$scope.nameInput = $scope.phoneInput = "";
		} 
	}


