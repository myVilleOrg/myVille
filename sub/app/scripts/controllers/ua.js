'use strict';

/**
 * @name UACtrl
 * @description
 * # myVille
 * Controller which permits to create a ua
 */
angular.module('appApp')
	.controller('UACtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, $location, ngDialog, $sessionStorage) {

	// Boolean to set the display mode
	$scope.full_page=false;
	$scope.$emit('editMode'); // Prevents to switch another page

	if (typeof $scope.ngDialogData === 'undefined'){
		if (typeof $sessionStorage.ngDialogData === 'undefined'){
			$scope.ngDialogData = {private:true};
		} else {
			$scope.ngDialogData = $sessionStorage.ngDialogData;
			$scope.ngDialogData.drawing = null;
		}
	}
	$scope.$watch('[ngDialogData]', function(){
			$sessionStorage.ngDialogData = $scope.ngDialogData;
	});
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
		$scope.ngDialogData.drawing = drawing;
	});

	$scope.$on('submitUA', function(e, d){
		// submit our ua
		// back to default page for creating

		// If the display mode of the side-sidebar was initially fullpage
		// The function showEditMap is triggered and then this function is triggered
		// We need to restore the initial setting
		if ($scope.full_page==true) {
			$scope.full_sidebar();

			// showEditMap disable the display of side-sidebar. We need to restore it.
			angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'flex';
		}

		if(!$scope.ngDialogData.desc || !$scope.ngDialogData.title){
			$window.alert('Un ou des champs sont manquants.');
		}else	if(!$scope.ngDialogData.drawing || $scope.ngDialogData.drawing.features.length === 0){
			$window.alert('Vous devez dessiner sur la carte !');
		}

		var data = {
			title: $scope.ngDialogData.title,
			description: $scope.ngDialogData.desc,
			geojson: JSON.stringify($scope.ngDialogData.drawing),
			private: $scope.ngDialogData.private
		};
		myVilleAPI.UAS.create(data).then(function(user){
			ngDialog.open({controller: 'UACtrl', template: 'views/modalUaCreated.html', appendClassName: 'popup-auto-height'});
			$scope.ngDialogData = {private: true};
			$sessionStorage.ngDialogData = $scope.ngDialogData;
		}, function(error){
			//$window.alert(error.data.message);
			return;
		});
	});
	$scope.$on("$destroy", function(){
			// on leave page back to no edit mode map and default style (or changing menue)

			$scope.$emit('normalMode');

			angular.element(document.getElementById('map'))[0].style.flex = 1;
			angular.element(document.getElementById('map'))[0].style.display = 'flex';  //the map is displayed in full page
			angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'none';
			angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'flex';

  });
	$scope.showEditMap = function(){
		// we show the map to draw
			angular.element(document.getElementById('map'))[0].style.flex = 1;
			angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'block';
			angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.display = 'none';
	};


	// Display mode which hide the map and show the side-sidebar on fullscreen
	$scope.full_sidebar= function () {
		angular.element(document.getElementById('map'))[0].style.flex = 0;
		angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.flex = 1;
		angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'none';
	};

	// Display mode which display the side-sidebar with a small size
	$scope.small_sidebar= function () {
		angular.element(document.getElementById('map'))[0].style.flex = 1;
		angular.element(document.getElementsByClassName('side-sidebar')[0])[0].style.flex = 0.4;
		angular.element(document.getElementsByClassName('create-ua-button')[0])[0].style.display = 'none';

	};

	// Change the display mode of the sidebar
	$scope.display_mode= function () {
		if ($scope.full_page==false) {
			$scope.full_sidebar();
			$scope.full_page=true;
		} else {
			$scope.small_sidebar();
			$scope.full_page=false;
		}
	};

});
