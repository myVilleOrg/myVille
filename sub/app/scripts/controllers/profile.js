'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('ProfileCtrl',['$scope', 'myVilleAPI', function ($scope, myVilleAPI) {
	$scope.editUser = Object.assign({}, $scope.user);
  $scope.editBox = function(){
    if($scope.editMode) $scope.editMode = false;
    else $scope.editMode = true;
  };
  $scope.editClick = function(){
  	console.log($scope.editUser);
  	if(!$scope.editUser.nickname) return $scope.message = 'Le champ pseudonyme ne peut pas être vide.';
  	if(!$scope.editUser.Opassword && $scope.editUser.Npassword) return $scope.message = 'Nous avons besoin de votre ancien mot de passe.';
  	var data = {
  		username: $scope.editUser.nickname,
  		password: $scope.editUser.Npassword,
  		oldPassword: $scope.editUser.Opassword
  	};
  	myVilleAPI.User.update(data).then(function(user){
  		$rootScope.user.username = $scope.editUser.username;
  	});
  };
  $scope.editMode = false;

}]);
