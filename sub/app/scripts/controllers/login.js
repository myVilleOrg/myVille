'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('LoginCtrl', ['$rootScope', '$scope', '$window', 'myVilleAPI', 'localStorageService', function ($rootScope, $scope, $window, myVilleAPI, localStorageService) {
  $scope.user = {};

  $scope.loginClick = function() {

    if($scope.user.username || $scope.user.password){
        myVilleAPI.User.login($scope.user).then(function(user){
          $rootScope.token = user.data.token;
          $rootScope.user = user.data.user;
          localStorageService.set('token', user.data.token);
          localStorageService.set('user', user.data.user);
          $scope.message = '';
          $window.location.href = '#/';
        }, function(error){
          $scope.message = error.data.message;
          console.log(error.data);
        });
    } else {
      $scope.message = 'Error, fiels needed.';
    }
  };
}]);
