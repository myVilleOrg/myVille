'use strict';
/**
 * @name SearchCtrl
 * @description
 * # myVille
 * Controller of search page
 */
angular.module('appApp')
  .controller('SearchCtrl', function ($rootScope, $scope, myVilleAPI) {
  $scope.$emit('filterForce', 4);
  var getSearchUA = function(){
		$scope.tabSearch = $rootScope.searchUAS.features;
	};

	$scope.$on('updateSearch', function(){
		getSearchUA();
	});

	$scope.centerOnMap = function(coordinates){
		$scope.$emit('centerOnMap', coordinates); // we do an event to tell to map controller to do the center on these coordinates
	};
  });
