'use strict';

angular.module('appApp')
.controller('AccountCtrl', ['$scope', 'myVilleAPI', 'ngDialog', function($scope, myVilleAPI, ngDialog) {
	$scope.user = {};

	$scope.createClick = function(){
		console.log($scope.user);
		if(!$scope.user.nickname || !$scope.user.password || !$scope.user.email || !$scope.user.phonenumber){
			return $scope.message = 'Un ou des champs sont manquant.';

		} else {
			var data = {
			username: $scope.user.nickname,
			password: $scope.user.password,
			email: $scope.user.email,
			phonenumber: $scope.user.phonenumber
			};

			myVilleAPI.User.create(data).then(function(user){
  				console.log(data);
  			});
		} 
		ngDialog.close();	
		$location.path('/');
	};

}]);