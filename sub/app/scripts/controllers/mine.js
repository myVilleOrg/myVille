'use strict';

/**
* @ngdoc function
* @name appApp.controller:MineCtrl
* @description
* # MineCtrl
* Controller of the appApp
*/
angular.module('appApp')
.controller('MineCtrl', function ($scope, ngDialog, myVilleAPI) {
	$scope.$emit('filterForce', 1);
	$scope.centerOnMap = function(coordinates){
		$scope.$emit('centerOnMap', coordinates); // we do an event to tell to map controller to do the center on these coordinates
	}
	$scope.editUA = function(ua){
		ngDialog.open({data: ua, template: 'views/edit_ua.html', appendClassName: 'modal-edit-ua', controller: 'EdituaCtrl'});
	}
	$scope.deleteUA = function(ua){
		myVilleAPI.UAS.delete(ua._id).then(function(){
			$scope.$emit('leafletDirectiveMap.map.dragend')
		});
	}
});
