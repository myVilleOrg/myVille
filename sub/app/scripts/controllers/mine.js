'use strict';

/**
* @name MineCtrl
* @description
* # MineCtrl
* Controller of the appApp
*/
angular.module('appApp')
.controller('MineCtrl', function ($rootScope,$scope, ngDialog, myVilleAPI, localStorageService) {
	$scope.$emit('filterForce', 2);
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
	$scope.ajoutCetteProjet = function(projet){//@LIUYan
		$rootScope.ajoutDeGroup = false;
		localStorageService.set('ajoutDeGroup',false);
		myVilleAPI.Group.addProjet($rootScope.groupCurrent._id,projet).then(function(message){
			console.log("pass1");
			$rootScope.$broadcast('ajouterLeProjet');
		})
	}
});
