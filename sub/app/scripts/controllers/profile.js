'use strict';

/**
 * @name ProfileCtrl
 * @description
 * # myVille
 * Controller of profile view which permits to edit and see info on user
 */
angular.module('appApp')
.controller('ProfileCtrl',['$scope', '$rootScope', 'myVilleAPI','AuthentificationService', '$routeParams', function ($scope, $rootScope, myVilleAPI, AuthentificationService, $routeParams) {

	$scope.editUser = Object.assign({}, $scope.user); // copy a local version of our user

  $scope.editBox = function(){ //switch mode
    if($scope.editMode) $scope.editMode = false;
    else $scope.editMode = true;
  };

  $scope.editClick = function(){
  	if(!$scope.editUser.username){
  		$window.alert('Le champ pseudonyme ne peut pas être vide.');
  		return;
  	}
  	if(!$scope.editUser.Opassword && $scope.editUser.Npassword1 && $scope.editUser.Npassword2) {
  		$window.alert('Nous avons besoin de votre ancien mot de passe.');
  		return;
  	}
		if($scope.editUser.Npassword1 !== $scope.editUser.Npassword2){
			$window.alert('Vérifiaction mot de passe non valide.');
  		return;
		}

  	var data = {
  		username: $scope.editUser.username,
  		password: $scope.editUser.Npassword1,
  		oldPassword: $scope.editUser.Opassword,
			passwordVarify:  $scope.editUser.Npassword2
  	};
  	myVilleAPI.User.update(data).then(function(user){
  		$rootScope.user.username = $scope.editUser.username;
  		$scope.editMode = false;
  	}, function(err){
  			$window.alert(err.data.message);
  	});
		$scope.editUser.Opassword='';
		$scope.editUser.Npassword1='';
		$scope.editUser.Npassword2='';
  };

  $scope.editAvatarClick = function(element){ // click on avatar

    var files = element.files;
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = function (e) {
      var formData = new FormData();
      formData.append('avatar',files[0]);

      myVilleAPI.User.updateAvatar(formData).then(function(user){
        AuthentificationService.updateAvatar(user);
      }, function(err){
    	 		$window.alert(err.data.message);
    	  });
    }
  };

	$scope.editMode = false; // back to see mode
  if($routeParams.userId){
  	myVilleAPI.User.get($routeParams.userId).then(function(data){
  		$scope.userWanted = {
  			avatar: data.data.avatar,
  			username: data.data.username
  		};
  	});
  }
}]);
