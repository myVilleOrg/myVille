'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('MainCtrl', ['$scope', '$location', 'localStorageService', '$window', '$rootScope', function ($scope, $location, localStorageService, $window, $rootScope) {
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
      var token = localStorageService.get('token');
      if(token) {
        $rootScope.token = token;
        var user = localStorageService.get('user');
        if(user) $rootScope.user = user;
      }
}]);
