'use strict';
/**
 * @name VoteCtrl
 * @description
 * # myVille
 * Controller which permits user to vote for a ua
 */
angular.module('appApp')
.controller('VoteCtrl', function ($rootScope, $scope,$http, myVilleAPI, AuthentificationService) {  //temp json

	// If logged which search if user has voted
	if(AuthentificationService.routeGuardian()){
		myVilleAPI.Vote.getVote($scope.ngDialogData._id).then(function(vote){
			if(vote){
				$scope.vote[vote.data.vote[0]].isVote = true;
			}
		});
	}

	myVilleAPI.Criteria.get_criteria().then(function(criteriaMap){
		$scope.criteriaMap = criteriaMap
	});

	$scope.voteCount = $scope.ngDialogData.vote.length;



	/// call for a vote.
	$scope.doVoteCriteria = function(id_criteria,value){
		var voteF = {};
		if($scope.ngDialogData.vote.length<1){

			console.log("creation vote",$scope.ngDialogData.vote.length);
			for(var cri in $scope.criteriaMap.data){
				if($scope.criteriaMap.data[cri]._id == id_criteria){
					voteF[cri] = {'_id':$scope.criteriaMap.data[cri]._id,'value' : value};
				} else {
					voteF[cri] = {'_id':$scope.criteriaMap.data[cri]._id,'value' : 0};
				}
			}
			myVilleAPI.UAS.vote($scope.ngDialogData._id, voteF).then(function(){
					$scope.closeThisDialog();
			});
		} else {
			console.log("update vote");
			myVilleAPI.Vote.getVote($scope.ngDialogData._id).then(function (vote) {
				console.log('rep', vote.data.vote[0]);
				voteF = vote.data.vote[0];

			}).then(function (){
				console.log('for',voteF);
				for(var cri in $scope.criteriaMap.data){
					if($scope.criteriaMap.data[cri]._id == id_criteria){
						if($scope.criteriaMap.data[cri].value == value){
							voteF[cri] = {'_id':$scope.criteriaMap.data[cri]._id,'value' : 0};
						} else{
							voteF[cri] = {'_id':$scope.criteriaMap.data[cri]._id,'value' : value};
						}
					}
				}
				myVilleAPI.UAS.vote($scope.ngDialogData._id, voteF).then(function(){
						$scope.closeThisDialog();
				});
			});

		}


	};

});
