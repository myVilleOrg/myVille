'use strict';
/**
 * @ngdoc function
 * @name appApp.controller:CreateUACtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('CreateUACtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, hello, ngDialog) {
	$scope.ua = {};

	$scope.submit = function(){
		console.log($scope.ua);
    	if(!$scope.ua.author || !$scope.ua.desc){
      		return $scope.message = 'Un ou des champs sont manquant.';
    	} else {
    		var data = {
		    owner: $scope.ua.author,
		    private: $scope.ua.mode,
		    description: $scope.ua.desc
		    };

		    myVilleAPI.Ua.create(data).then(function(user){
          		console.log(data);

        	}, function(error){
          		$scope.message = error.data.message;
          		console.log(error.data);
        	});

          	$scope.closeThisDialog();
    	}

	};


});