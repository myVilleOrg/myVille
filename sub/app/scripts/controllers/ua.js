'use strict';

/**
 * @name UACtrl
 * @description
 * # myVille
 * Controller which permits to create a ua
 */
angular.module('appApp')
	.controller('UACtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, $location, ngDialog) {

	$scope.$emit('editMode'); // Prevents to switch another page

	/*Change the style to get a full page and hide map*/
	angular.element(document.getElementById('map'))[0].style.flex = 0;
	angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.flex = 1;

	$scope.ua = {};
	$scope.tinymceOptions = {
		inline: false,
		plugins : 'advlist autolink link image lists charmap preview textcolor',
		skin: 'lightgray',
		theme : 'modern',
		height: '250px'
	};

	$scope.okClick = function() {
		$scope.closeThisDialog();
	}

	$scope.$on('ngDialog.closing', function(){ // when we finished we update the map and redirect user on home
		$scope.$emit('leafletDirectiveMap.map.zoomend');
		$window.location = '#/';
	});

	$scope.$on('drawingData', function(event, drawing){ // when we finish to draw on the map, we retrieve geojson from drawing
		$scope.ua.drawing = drawing;
	});

	$scope.$on('submitUA', function(e, d){
		// submit our ua
		// back to default page for creating
		angular.element(document.getElementById('map'))[0].style.flex = 0;
		angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'none';
		angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'flex';
		if(!$scope.ua.desc || !$scope.ua.title){
			$scope.message = 'Un ou des champs sont manquants.';
			return;
		}

		if(!$scope.ua.drawing || $scope.ua.drawing.features.length === 0){
			$scope.message = 'Vous devez dessiner sur la carte !'
			return;
		}

		var data = {
			title: $scope.ua.title,
			description: $scope.ua.desc,
			geojson: JSON.stringify($scope.ua.drawing)
		};

		myVilleAPI.UAS.create(data).then(function(user){
			ngDialog.open({controller: 'UACtrl', template: 'views/modalUaCreated.html', appendClassName: 'popup-auto-height'});
			$scope.ua.title = null;
			$scope.ua.desc = null;
			$scope.ua.drawing = null;
		}, function(error){
			$scope.message = error.data.message;
			return;
		});
	});
	$scope.$on("$destroy", function(){
			//on leave page back to no edit mode map and default style
			$scope.$emit('normalMode');
			angular.element(document.getElementById('map'))[0].style.flex = 1;
			angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'none';
			angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'flex';
  });
	$scope.showEditMap = function(){
		// we show the map to draw
		angular.element(document.getElementById('map'))[0].style.flex = 1;
		angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'block';
		angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'none';
	};
});
