'use strict';

/**
 * @name EdituaCtrl
 * @description
 * # myVille
 * Controller of edit ua modal box
 */
angular.module('appApp')
	.controller('EdituaCtrl', ['$scope', 'myVilleAPI', function($scope, myVilleAPI) {
		$scope.tinymceOptions = {
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
