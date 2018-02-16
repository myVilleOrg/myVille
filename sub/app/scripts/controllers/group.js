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

		var getProjets = function(group){
			myVilleAPI.Group.groupInfo(group).then(function(group){
				$rootScope.groupProjets = group.data.uas;
				$rootScope.groupMembres = group.data.admins.concat(group.data.ecrivains.concat(group.data.lecteurs));
				},function(error){
				$scope.message = error.data.message;
				return;
			});
		}
    $scope.editGroup = function(group){
			$rootScope.groupCurrent = group;
			localStorageService.set('groupCurrent',group);
			getProjets(group);
		};

		$scope.quitGroup = function(group){
			myVilleAPI.Group.quitGroup(group._id).then(function(){
				getGroups();
			});
		};

		$scope.searchGroup = function(searchKey){
			myVilleAPI.Group.searchGroup({search : searchKey}).then(function(group){
				$scope.groupSearch = group.data;
			});
		};

		$scope.GetInGroup = function(group){
			myVilleAPI.Group.getInGroup(group._id).then(function(){
				console.log("il faut seulement changer le icone");
			});
		}

		$scope.userGroupe = function(group){
			var users=group.admins.concat(group.ecrivains.concat(group.lecteurs));
			for (var i=0;i<users.length;i++){
				console.log("user ", $rootScope.user._id);
				if($rootScope.user._id === users[i]){
					return true;
				}
			}
			return false;
		};

		$scope.ajoutProjet = function(group){
			$rootScope.ajoutDeGroup=true;
			localStorageService.set('ajoutDeGroup',true);
		};

		//$scope.role = function(member){
			//if($scope.roles)
		//}

		//inscrir deux fois !!!!!!!!!!!!!!!!!!!!!!!!!!!!
		$rootScope.$on('ajouterLeProjet',function(e,projet){
			getProjets($rootScope.groupCurrent);
			console.log("pass2");
			window.location.href='/#/profile/edit_group';
		});
});
