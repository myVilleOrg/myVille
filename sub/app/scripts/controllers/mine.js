'use strict';

/**
* @ngdoc function
* @name appApp.controller:MineCtrl
* @description
* # MineCtrl
* Controller of the appApp
*/
angular.module('appApp')
.controller('MineCtrl', function ($scope, ngDialog) {

	$scope.$on('$locationChangeStart', function (event, next, current) {
		$scope.$emit('filtersReset', true);
	});
	$scope.centerOnMap = function(coordinates){
		$scope.$emit('centerOnMap', coordinates); // we do an event to tell to map controller to do the center on these coordinates
	}
	$scope.editUA = function(ua){
		ngDialog.open({data: ua, template: 'views/edit_ua.html', appendClassName: 'modal-edit-ua', controller: 'EdituaCtrl'});
	}

});
