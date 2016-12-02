'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:UACtrl
 * @description
 * # UACtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('UACtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, $location, ngDialog) {
	$scope.ua = {};

	$scope.$on('UAlocationClic', function(event, data) {
		$scope.ua.location = data;
	});

	$scope.submit = function(){

    	if(!$scope.ua.desc || !$scope.ua.title || !$scope.ua.location){
      		return $scope.message = 'Un ou des champs sont manquant.';
    	} else {
    		var data = {
		    title: $scope.ua.title,
		    description: $scope.ua.desc,
		    geojson: JSON.stringify({"type": "Point", "coordinates": $scope.ua.location})
		    };

		    myVilleAPI.UAS.create(data).then(function(user){
          		ngDialog.open({controller: 'CreateUACtrl', template: 'views/create_ua.html'});
          		$scope.ua.title = null;
          		$scope.ua.desc = null;
          		$scope.ua.location = null;

        	}, function(error){
          		$scope.message = error.data.message;
          		console.log(error.data);
        	});
    	}
	};
});