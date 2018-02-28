'use strict';

/**
 * @name CGroupCtrl
 * @description
 * # myVille
 * Controller which permits to create a group
 */
angular.module('appApp')
	.controller('CGroupCtrl', function ($rootScope, $scope, $window, myVilleAPI, localStorageService, $location, ngDialog, $sessionStorage) {

		//Prendre la liste des groupes
		var getGroups = function(){
				myVilleAPI.Group.getGroup().then(function(group){
					$scope.myGroups = group.data.groupes;
					$scope.membreProp = new Array();
					$scope.membreTitle = new Array();
					for(var i=0;i<$scope.myGroups.length;i++){
							if($scope.myGroups[i].admins.indexOf($rootScope.user._id)!=-1){
								var groupNom=$scope.myGroups[i].name;
								$scope.membreProp.push("admin");
								$scope.membreTitle.push("admin");
							}
							else if($scope.myGroups[i].ecrivains.indexOf($rootScope.user._id)!=-1){
								var groupNom=$scope.myGroups[i].name;
								$scope.membreProp.push("ecrivain");
								$scope.membreTitle.push("ecrivain");
							}
							else if($scope.myGroups[i].lecteurs.indexOf($rootScope.user._id)!=-1){
								var groupNom=$scope.myGroups[i].name;
								$scope.membreProp.push("lecteur");
								$scope.membreTitle.push("lecteur");
							}
					}
				}, function(error){
					$scope.message = error.data.message;
					return;
				});
		};
		getGroups();

		$scope.$on('getGroup' , function(){
					getGroups();
		});

		//create un groupe
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

		//justifier le type de membre d'un groupe et retourner une couleur particulière
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

		//justifier le type de membre d'un groupe et retourner un nom particulière
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

		//justifier le type de membre d'un groupe et retourner une couleur particulière
		$scope.roleInGroup = function(){
			if($scope.membreProp.length!==0){
				var thisRole=$scope.membreProp.shift();
				if(thisRole==="admin"){
					return {"color":"#EE2C2C"};
				}
				else if(thisRole==="ecrivain"){
					return {"color":"#FF8C00"};
				}
				else if(thisRole==="lecteur"){
					return {"color":"#8B8989"};
				}
			}
			else {
				return {"color":"#98F5FF"};
			}
		};

		//justifier le type de membre d'un groupe et retourner un nom particulière
		// $scope.roleTitle = function(){
		// 	if($scope.membreTitle.length!==0){
		// 		var thisRole=$scope.membreTitle.shift();
		// 		console.log(thisRole);
		// 		return thisRole;
		// 	}
		// };


		//prendre les projets d'un groupe
		var getProjets = function(group){
			myVilleAPI.Group.groupInfo(group).then(function(group){
				$rootScope.groupProjets = group.data.uas;
				$rootScope.groupMembres = group.data.admins.concat(group.data.ecrivains.concat(group.data.lecteurs));
				$rootScope.membreType = new Array(group.data.admins,group.data.ecrivains,group.data.lecteurs);
				},function(error){
				$scope.message = error.data.message;
				return;
			});
		};

		//récupérer les informations d'un groupe pour afficher dans le page de edit_group
    $scope.editGroup = function(group){
				$rootScope.groupCurrent = group;
				localStorageService.set('groupCurrent',group);
				getProjets(group);
		};

		//quitter d'un groupe
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

		//module de la recherche
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

		//participer dans un groupe par recherche
		$scope.GetInGroup = function(group){
			myVilleAPI.Group.getInGroup(group._id).then(function(){
				console.log("il faut seulement changer le icone");
			});
		};

		$scope.userGroupe = function(group){
			var users=group.admins.concat(group.ecrivains.concat(group.lecteurs));
			for (var i=0;i<users.length;i++){
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


		$rootScope.$on('ajouterLeProjet',function(e,projet){
			getProjets($rootScope.groupCurrent);
			console.log("pass2");
			window.location.href='/#/profile/edit_group';
		});
});
