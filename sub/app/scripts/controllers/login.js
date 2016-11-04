'use strict';
/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */

angular.module('appApp').controller('LoginCtrl', function ($rootScope, $scope, $window, myVilleAPI, AuthentificationService, hello, ngDialog, $location) {

  $scope.user = {};
  $scope.signupUser = {};
  $scope.log = true;

  $scope.loginClick = function() {

    if($scope.user.username || $scope.user.password){
        myVilleAPI.User.login($scope.user).then(function(user){
          if(!user.data.user) return $scope.message = 'Mauvaise combinaison';

  				AuthentificationService.login(user.data.token, user.data.user);
          $scope.message = '';
          $scope.closeThisDialog();
        }, function(error){
          $scope.message = error.data.message;
        });
    } else {
      $scope.message = 'Error, fiels needed.';
    }
  };

  $scope.switchMode = function (){
  	if($scope.log) $scope.log = false
  	else $scope.log = true;
  }

  $scope.createClick = function(){
    if(!$scope.signupUser.nickname || !$scope.signupUser.password || !$scope.signupUser.email || !$scope.signupUser.phonenumber){
      return $scope.message = 'Un ou des champs sont manquant.';
    }
		var data = {
		  username: $scope.signupUser.nickname,
		  password: $scope.signupUser.password,
		  email: $scope.signupUser.email,
		  phonenumber: $scope.signupUser.phonenumber
		};

		myVilleAPI.User.create(data).then(function(user){
			AuthentificationService.login(user.data.token, user.data.user);
	  });

    ngDialog.close();
    $location.path('/');
  };

  $scope.loginFB = function(){
    hello('facebook').login({scope: 'basic,email'}).then(function(auth){
    	if(auth.network === 'facebook') {
	      myVilleAPI.User.loginFacebook({accessToken: auth.authResponse.access_token}).then(function(user){
  				AuthentificationService.login(user.data.token, user.data.user);
	        $scope.closeThisDialog();
	      });
    	}
    });
  };
  $scope.loginGoogle = function(){
    hello('google').login({scope: 'basic,email'}).then(function(auth){
      if(auth.network === 'google'){
        myVilleAPI.User.loginGoogle({accessToken: auth.authResponse.access_token}).then(function(user){
  				AuthentificationService.login(user.data.token, user.data.user);
          $scope.closeThisDialog();
        });
      }
    });
  };
  $scope.loginTwitter = function(){
    hello('twitter').login();
  };

});
