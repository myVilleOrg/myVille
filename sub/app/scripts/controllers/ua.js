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

	/*Change the style*/
	angular.element(document.getElementById('map'))[0].style.flex = 0;
	angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.flex = 1;

	$scope.ua = {};
	$scope.tinymceOptions = {
		onChange: function(e) {
			// put logic here for keypress and cut/paste changes
		},
		inline: false,
		plugins : 'advlist autolink link image lists charmap preview textcolor',
		skin: 'lightgray',
		theme : 'modern',
		height: '20em'
	};

	$scope.okClick = function() {
		$scope.closeThisDialog();
	}

	$scope.$on('ngDialog.closing', function(){
		$scope.$emit('leafletDirectiveMap.map.zoomend');
		$window.location = '#/';
	});

	$scope.$on('drawingData', function(event, drawing){
		$scope.ua.drawing = drawing;
	});

	$scope.$on('submitUA', function(e, d){
		angular.element(document.getElementById('map'))[0].style.flex = 0;
		angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'none';
		angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'flex';
		if(!$scope.ua.desc || !$scope.ua.title){
			$scope.message = 'Un ou des champs sont manquants.';
			return;
		}
		if(!$scope.ua.drawing){
			$scope.message = 'Vous devez dessiner sur la carte !'
			return;
		}

		var data = {
			title: $scope.ua.title,
			description: $scope.ua.desc,
			geojson: JSON.stringify($scope.ua.drawing)
		};

		myVilleAPI.UAS.create(data).then(function(user){
			ngDialog.open({controller: 'UACtrl', template: 'views/modalUaCreated.html'});
			$scope.ua.title = null;
			$scope.ua.desc = null;
			$scope.ua.drawing = null;
		}, function(error){
			$scope.message = error.data.message;
			console.log(error.data);
		});
	});
	$scope.$on("$destroy", function(){
			$scope.$emit('normalMode');
			angular.element(document.getElementById('map'))[0].style.flex = 1;
			angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'none';
			angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'flex';
  });
	$scope.showEditMap = function(){
		angular.element(document.getElementById('map'))[0].style.flex = 1;
		angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'block';
		angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'none';
	};
});
