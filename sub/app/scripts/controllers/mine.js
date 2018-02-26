'use strict';

/**
* @name MineCtrl
* @description
* # MineCtrl
* Controller of the appApp
*/
angular.module('appApp')
.controller('MineCtrl', function ($rootScope,$scope, ngDialog, myVilleAPI, localStorageService, $sessionStorage, $window) {
	$scope.$emit('filterForce', 2);
	$scope.centerOnMap = function(coordinates){
		$scope.$emit('centerOnMap', coordinates); // we do an event to tell to map controller to do the center on these coordinates
	}
	$scope.editUA = function(ua){
		ngDialog.open({data: ua, template: 'views/edit_ua.html', appendClassName: 'modal-edit-ua', controller: 'EdituaCtrl'});
	}
	$scope.deleteUA = function(ua){
		var isConfirmed = $window.confirm('\u00cates-vous s\u00fbr de vouloir supprimer ?');
		if (isConfirmed) {
			myVilleAPI.UAS.delete(ua._id).then(function(){
				$scope.$emit('leafletDirectiveMap.map.dragend')
			});
		}
	}
	// $scope.search = function (searchK) {
	// 	if(typeof searchK !== 'undefined'){
	// 		var searchKey = searchK;
	// 		$sessionStorage.searchKey = searchK;
	// 	}else {
	// 		var searchKey = $scope.searchKey;
	// 	}
	// 	var searchOption = "Nom Projet";
	//
	// 	myVilleAPI.UAS.search({search : searchKey, searchOption : searchOption, map: JSON.stringify(mapBounds)}).then(function(geocodes){
	// 			$rootScope.searchUAS = geocodes.data;
	// 			$scope.geoJL(geocodes.data,"search");
	// 			$scope.selectFilter(4);
	// 			$rootScope.$broadcast('updateSearch');
	// 	});
	// };
	$scope.ajoutCetteProjet = function(projet){//@LIUYan
		$rootScope.ajoutDeGroup = false;
		localStorageService.set('ajoutDeGroup',false);
		myVilleAPI.Group.addProjet($rootScope.groupCurrent._id,projet).then(function(message){
			console.log("pass1");
			$rootScope.$broadcast('ajouterLeProjet');
		})
	}
});
