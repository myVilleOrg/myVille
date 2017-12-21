'use strict';

/**
 * @name CGroupCtrl
 * @description
 * # myVille
 * Controller which permits to create a group
 */
angular.module('appApp')
	.controller('CGroupCtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, $location, ngDialog) {

		var getGroups = function(){
				myVilleAPI.Group.getGroup().then(function(group){
					$scope.myGroups=group.data.groupes;
					console.log($scope.myGroups);
				}, function(error){
					$scope.message = error.data.message;
					return;
			});
		};
		getGroups();

		$scope.$on('getGroup' , function(){
					getGroups();
		});
		$scope.$on('submitGroup',function(e,d){
			if(!$scope.group.name || !$scope.group.desc){
				$scope.message = 'Un ou des champs sont manquants.';
				return;
			}

		  var data={
				name : $scope.group.name,
				description: $scope.group.desc,
			};


			myVilleAPI.Group.createGroup(data).then(function(user){
				ngDialog.open({controller: 'UACtrl', template: 'views/modalGroupCreated.html', appendClassName: 'popup-auto-height'});
				$scope.group.name = null;
				$scope.group.desc = null;
			}, function(error){
				$scope.message = error.data.message;
				return;
			});
		});

		$scope.quitGroup = function(group){
			myVilleAPI.Group.quitGroup(group._id).then(function(){
				getGroups();
			});
		}
});
