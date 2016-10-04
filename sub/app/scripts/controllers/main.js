'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('MainCtrl', ['$scope', '$location', 'localStorageService', '$window', '$rootScope', 'ngDialog', function ($scope, $location, localStorageService, $window, $rootScope, ngDialog) {
      $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $location.path());
        return active;
      };
      angular.extend($scope, {
          center: {
              lat: 51.505,
              lng: -0.09,
              zoom: 14,
              autoDiscover: true
          }
      });
      $scope.disconnect = function(){
        delete $rootScope.token;
        delete $rootScope.user;
        localStorageService.remove('token');
        localStorageService.remove('user');
        $window.location.href = '#/';
      }
      $scope.login = function(){
        ngDialog.open({controller: 'LoginCtrl', template: 'views/login.html'});
      }
      var token = localStorageService.get('token');
      if(token) {
        $rootScope.token = token;
        var user = localStorageService.get('user');
        if(user) $rootScope.user = user;
      }
}]);
