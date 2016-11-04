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
	
	if(localStorageService.get('ua.title')!=null || localStorageService.get('ua.author')!=null || localStorageService.get('ua.desc')!=null){
		$scope.ua.title=localStorageService.get('ua.title'),
		$scope.ua.author=localStorageService.get('ua.author'),
		$scope.ua.desc=localStorageService.get('ua.desc')
	};

	$scope.getGeo = function(){
		localStorageService.set('ua.title', $scope.ua.title);
		localStorageService.set('ua.author', $scope.ua.author);
		localStorageService.set('ua.desc', $scope.ua.desc);
		$location.path( '/index.html' );
		$scope.closeThisDialog();
	}

	$scope.submit = function(){
		console.log($scope.ua);
    	if(!$scope.ua.author || !$scope.ua.desc){
      		return $scope.message = 'Un ou des champs sont manquant.';
    	} else {
    		var data = {
		    owner: $scope.ua.author,
		    private: $scope.ua.mode,
		    description: $scope.ua.desc,
		    location: localStorageService.get('location')
		    };

		    myVilleAPI.UAS.create(data).then(function(user){
          		console.log(data);

        	}, function(error){
          		$scope.message = error.data.message;
          		console.log(error.data);
        	});
		    localStorageService.set('ua.title', null);
			localStorageService.set('ua.author', null);
			localStorageService.set('ua.desc', null);
			localStorageService.set('location', null);
          	$scope.closeThisDialog();
    	}

	};


});