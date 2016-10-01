'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('MainCtrl', ['$scope', '$location', 'localStorageService', '$rootScope', function ($scope, $location, localStorageService, $rootScope) {
      $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $location.path());
        return active;
      };
      angular.extend($scope, {
          center: {
              lat: 51.505,
              lng: -0.09,
              zoom: 8
          }
      });
      var token = localStorageService.get('token');
      if(token) {
        $rootScope.token = token;
        var user = localStorageService.get('user');
        if(user) $rootScope.user = user;
      }
}]);
