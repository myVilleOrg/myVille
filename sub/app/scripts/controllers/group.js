'use strict';

/**
 * @name CGroupCtrl
 * @description
 * # myVille
 * Controller which permits to create a group
 */
angular.module('appApp')
	.controller('CGroupCtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, $location, ngDialog, $sessionStorage) {

		var getGroups = function(){
				myVilleAPI.Group.getGroup().then(function(group){
					$scope.myGroups=group.data.groupes;
					//console.log($scope.myGroups);
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
		};

		// Persistance des données
		$scope.searchKeyG = $sessionStorage.searchKeyG;
		$scope.groupSearch = $sessionStorage.groupSearch;
		$scope.activeT = $sessionStorage.activeT;
		if($location.url().substring(15) !==''){
			$scope.activeT=$location.url().substring(15);
		}

		$scope.searchGroup = function(searchKeyG){
			$scope.searchKeyG = searchKeyG;
			$sessionStorage.searchKeyG=$scope.searchKeyG;
			myVilleAPI.Group.searchGroup({search : searchKeyG}).then(function(group){
				$scope.groupSearch = group.data;
				$sessionStorage.groupSearch =$scope.groupSearch;
			});
		};

		$scope.changeTab = function(id){
			$scope.activeT = id;
			$sessionStorage.activeT = $scope.activeT;
		}
		$scope.activeTab = function(id,c){
			if (typeof $scope.activeT === 'undefined' || $scope.activeT === ''){
				var currentRoute = 'mygroups';
			}else{
				var currentRoute =  $scope.activeT;
			}
			if (c === 'head'){
				return id === currentRoute ? 'active' : '';
			}else{
				return id === currentRoute ? 'tab-pane fade in active' : 'tab-pane fade';
			}

		};

		$scope.userGroupe = function(users){
			for (var i=0;i<users.length;i++){
				console.log("user ", $rootScope.user._id);
				if($rootScope.user._id === users[i]){
					return true;
				}
			}
			return false;
		};
});
