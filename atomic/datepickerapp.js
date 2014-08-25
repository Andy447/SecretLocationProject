angular.module("datepicker", ["firebase"])
	.factory("Appointments", ["$firebase", function($firebase) {
		var ref = new Firebase("https://secret-key-app.firebaseio.com/photos");
		return $firebase(ref).$asArray();
	}])

	//---controller implementation 1---
	function dateController($scope, Appointments) {
		Appointments.$loaded(function(data) {
			$scope.appointments = data;
		});
		
		$scope.addAppt = function () {
			/*if ($scope.appointments.$indexFor("2014-08-27") != -1) {
				alert("Duplicate!");
			} else {*/
				var data = {date: $scope.newDate};
				$scope.appointments.$add(data);
			//}
		}
		$scope.remove = function (appt) {
			$scope.appointments.$remove(appt);
		}
	}


		//---controller implementation 2---
/*		.controller('dateController', ['$scope', 'Appointments', 
			function($scope, allappts) {
			  	$scope.appointments = allappts;
			  	$scope.addAppt = function() {
				  	var data = {date: $scope.newDate};
				  	$scope.appointments.$add(data);
				};
			}
		]);
*/

	//---module & controller implementation 3---
/*	var app = angular.module("datalogic", ["firebase"]);
	app.controller("dateController", function($scope, $firebase) {
		var ref = new Firebase("https://secret-key-app.firebaseio.com/date");
		var sync = $firebase(ref);
		$scope.appointments = sync;
		$scope.addAppt = function () {
			var data = {date: $scope.newDate};
			$scope.appointments.$add(data);
		}
	});
*/

	//---Firebase without Angular---
/*	var ref = new Firebase("https://secret-key-app.firebaseio.com/date");
	$('#dateform').submit(function() {
		var newDate = $('#myDate').val();
		ref.push({date: newDate});
	});
*/
