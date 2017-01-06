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
	$scope.$emit('editMode')
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
	$scope.$on('drawingData', function(event, drawing){
		$scope.ua.drawing = drawing;
		console.log(drawing)
	});
	$scope.submit = function(){
		if(!$scope.ua.desc || !$scope.ua.title){
				return $scope.message = 'Un ou des champs sont manquant.';
		}
		if(!$scope.ua.drawing) return $scope.message = 'Vous devez dessiner sur la carte !'
		var data = {
			title: $scope.ua.title,
			description: $scope.ua.desc,
			geojson: JSON.stringify($scope.ua.drawing)
		};

		myVilleAPI.UAS.create(data).then(function(user){
			ngDialog.open({controller: 'CreateUACtrl', template: 'views/create_ua.html'});
			$scope.ua.title = null;
			$scope.ua.desc = null;
		}, function(error){
			$scope.message = error.data.message;
			console.log(error.data);
		});

		$scope.$emit('leafletDirectiveMap.map.zoomend');
	};
});
