'use strict';
/**
 * @name SearchCtrl
 * @description
 * # myVille
 * Controller of search page
 */
angular.module('appApp')
  .controller('SearchCtrl', function ($rootScope, $scope, myVilleAPI, $sessionStorage) {
  $scope.$emit('filterForce', 4);
  $scope.tabSearch = $sessionStorage.tabSearch;
  var getSearchUA = function(){
    //console.log($rootScope.searchUAS);
		$scope.tabSearch = $rootScope.searchUAS.features;
    $sessionStorage.tabSearch = $scope.tabSearch;
	};

	$scope.$on('updateSearch', function(){
		getSearchUA();
	});

	$scope.centerOnMap = function(coordinates){
		$scope.$emit('centerOnMap', coordinates); // we do an event to tell to map controller to do the center on these coordinates
	};
  });
