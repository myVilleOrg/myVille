'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('ProfileCtrl',['$scope', 'ngDialog', function ($scope, ngDialog) {
  $scope.editBox = function(){
    ngDialog.open({ template: 'views/login.html', className: 'ngdialog-theme-default' });
  };
}]);
