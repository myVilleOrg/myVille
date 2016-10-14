'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('LoginCtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, hello) {
	$scope.user = {};
	function authUser(user){
		$rootScope.token = user.token;
		$rootScope.user = user.user;
		localStorageService.set('token', user.token);
		var expiryToken = Date.now();
		localStorageService.set('expiryToken', expiryToken + 86400000);
		localStorageService.set('user', user.user);
	}
	$scope.loginClick = function() {
		if($scope.user.username || $scope.user.password){
				myVilleAPI.User.login($scope.user).then(function(user){
					if(!user.data.user) return $scope.message = 'Mauvaise combinaison';
					authUser(user.data);
					$scope.message = '';
					$scope.closeThisDialog();
				}, function(error){
					$scope.message = error.data.message;
					console.log(error.data);
				});
		} else {
			$scope.message = 'Error, fiels needed.';
		}
	};
	$scope.loginFB = function(){
		hello('facebook').login({scope: 'basic,email'}).then(function(auth){
			if(auth.network === 'facebook') {
				myVilleAPI.User.loginFacebook({accessToken: auth.authResponse.access_token}).then(function(user){
					authUser(user.data);
					$scope.closeThisDialog();
				});
			}
		});
	};
	$scope.loginTwitter = function(){
		hello('twitter').login();
	};

});
