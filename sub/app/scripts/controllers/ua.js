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
	$scope.tinymceOptions = {
    onChange: function(e) {
      // put logic here for keypress and cut/paste changes
    },
    inline: false,
    plugins : 'advlist autolink link image lists charmap preview textcolor',
    skin: 'lightgray',
    theme : 'modern'
	};
	$scope.$on('UAlocationClic', function(event, data) {
		$scope.ua.location_name = data[0];
		$scope.ua.location_coord = data[1];
	});

	$scope.submit = function(){

    	if(!$scope.ua.desc || !$scope.ua.title || !$scope.ua.location_coord){
      		return $scope.message = 'Un ou des champs sont manquant.';
    	}
  		var data = {
				title: $scope.ua.title,
				description: $scope.ua.desc,
				geojson: JSON.stringify({"type": "Point", "coordinates": $scope.ua.location_coord})
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

    	$scope.$emit('leafletDirectiveMap.map.zoomend');
	};
});
