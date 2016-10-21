'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:UACtrl
 * @description
 * # UACtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('UACtrl', function ($scope, myVilleAPI, ngDialog) {
    $scope.user = {};
    
   /* $scope.uas = myVilleAPI.Ua.get_ua($scope.user);*/

    $scope.createClick = function() {
    	ngDialog.open({controller: 'CreateUACtrl', template: 'views/create_ua.html'});
    }


  });