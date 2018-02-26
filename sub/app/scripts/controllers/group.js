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

		$scope.role = function(member){
			if($rootScope.membreType[0].indexOf(member)!=-1){
				return {"color":"#EE2C2C"};
			}
			else if($rootScope.membreType[1].indexOf(member)!=-1){
				return {"color":"#FF8C00"};
			}
			else if($rootScope.membreType[2].indexOf(member)!=-1){
				return {"color":"#8B8989"};
			}
		};
		$scope.title = function(member){
			if($rootScope.membreType[0].indexOf(member)!=-1){
				return "admin";
			}
			else if($rootScope.membreType[1].indexOf(member)!=-1){
				return "écrivain";
			}
			else if($rootScope.membreType[2].indexOf(member)!=-1){
				return "lecteur";
			}
		};

		var getProjets = function(group){
			myVilleAPI.Group.groupInfo(group).then(function(group){
				$rootScope.groupProjets = group.data.uas;
				$rootScope.groupMembres = group.data.admins.concat(group.data.ecrivains.concat(group.data.lecteurs));
				$rootScope.membreType = new Array(group.data.admins,group.data.ecrivains,group.data.lecteurs);
				for (var i=0;i<$rootScope.groupMembres.length;i++)
				{
					console.log($rootScope.groupMembres[0]);
					$scope.role=role($rootScope.groupMembres[0]);
				}
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


		$scope.GetInGroup = function(group){
			myVilleAPI.Group.getInGroup(group._id).then(function(){
				console.log("il faut seulement changer le icone");
			});
		};

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


		//inscrir deux fois !!!!!!!!!!!!!!!!!!!!!!!!!!!!
		$rootScope.$on('ajouterLeProjet',function(e,projet){
			getProjets($rootScope.groupCurrent);
			console.log("pass2");
			window.location.href='/#/profile/edit_group';
		});
});
