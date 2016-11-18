'use strict';
/**
 * @ngdoc function
 * @name appApp.controller:CreateUACtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('CreateUACtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, $location, ngDialog) {
	$scope.ua = {};
	
	if(localStorageService.get('ua.title')!=null || localStorageService.get('ua.desc')!=null || localStorageService.get('ua.location')!=null){
		$scope.ua.title=localStorageService.get('ua.title'),
		$scope.ua.desc=localStorageService.get('ua.desc'),
		$scope.ua.location=[localStorageService.get('ua.location').lng,localStorageService.get('ua.location').lat]
	};

	$scope.getGeo = function(){
		localStorageService.set('ua.title', $scope.ua.title);
		localStorageService.set('ua.desc', $scope.ua.desc);
		$scope.closeThisDialog();
	};

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
		    localStorageService.set('ua.title', null);
			localStorageService.set('ua.desc', null);
			localStorageService.set('ua.location', null);
          	$scope.closeThisDialog();
    	}
	};
});