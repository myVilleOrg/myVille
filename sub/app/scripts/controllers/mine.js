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

	$scope.features1 = $rootScope.cachedMarkers.features;

	$scope.centerOnMap = function(coordinates){
		$scope.$emit('centerOnMap', coordinates); // we do an event to tell to map controller to do the center on these coordinates
	};
	$scope.editUA = function(ua){
		ngDialog.open({data: ua, template: 'views/edit_ua.html', appendClassName: 'modal-edit-ua', controller: 'EdituaCtrl'});
	};
	$scope.deleteUA = function(ua){
		var isConfirmed = $window.confirm('\u00cates-vous s\u00fbr de vouloir supprimer ?');
		if (isConfirmed) {
			myVilleAPI.UAS.delete(ua._id).then(function(){
				$scope.$emit('leafletDirectiveMap.map.dragend')
			});
		}
	};

	$scope.searchMine = function (searchK) {
		var table= [];
		var i = 0;
		if(typeof searchK !== 'undefined'){
			var searchKey = searchK;
			$sessionStorage.searchKey = searchK;
		}else {
			var searchKey = $scope.searchKey;
		}
		for (var feature in $rootScope.cachedMarkers.features){
			if(($rootScope.cachedMarkers.features[feature].properties._doc.title).indexOf(searchKey)!==-1 || ($rootScope.cachedMarkers.features[feature].properties._doc.description).indexOf(searchKey)!==-1){
				table[i]=($rootScope.cachedMarkers.features[feature]);
				i+=1;
			}
		}
		$scope.features1 = table;

	};
	$scope.ajoutCetteProjet = function(projet){//@LIUYan
		$rootScope.ajoutDeGroup = false;
		localStorageService.set('ajoutDeGroup',false);
		myVilleAPI.Group.addProjet($rootScope.groupCurrent._id,projet).then(function(message){
			$rootScope.$broadcast('ajouterLeProjet');
		})
	}
});
