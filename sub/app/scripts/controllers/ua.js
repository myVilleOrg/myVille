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
	
	if(localStorageService.get('ua.location')!=null){
		$scope.ua.location = [localStorageService.get('ua.location').lng,localStorageService.get('ua.location').lat];
	}	
	
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
          		console.log(data);

        	}, function(error){
          		$scope.message = error.data.message;
          		console.log(error.data);
        	});
    	}

    	localStorageService.set('ua.location', null);

	};


  });