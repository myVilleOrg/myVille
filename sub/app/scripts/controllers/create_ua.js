'use strict';
/**
 * @ngdoc function
 * @name appApp.controller:CreateUACtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('CreateUACtrl', function ($scope, ngDialog) {
	
	$scope.okClick = function() {
		$scope.closeThisDialog();
	}

});