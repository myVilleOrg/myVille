'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:EdituaCtrl
 * @description
 * # EdituaCtrl
 * Controller of the appApp
 */
angular.module('appApp')
	.controller('EdituaCtrl', ['$scope', 'myVilleAPI', function($scope, myVilleAPI) {
		$scope.tinymceOptions = {
			onChange: function(e) {
				// put logic here for keypress and cut/paste changes
			},
			inline: false,
			plugins : 'advlist autolink link image lists charmap preview',
			skin: 'lightgray',
			theme : 'modern'
		};
		$scope.editUa = function(){
			myVilleAPI.UAS.update($scope.ngDialogData._id, {title: $scope.ngDialogData.title, description: $scope.ngDialogData.description, publish: $scope.ngDialogData.private.toString()}).then(function(ua){
				$scope.closeThisDialog();
			});
		};

	}]);
