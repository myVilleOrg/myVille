'use strict';
/**
 * @name VoteCtrl
 * @description
 * # myVille
 * Controller which permits user to vote for a ua
 */
angular.module('appApp')
.controller('VoteCtrl', function ($rootScope, $scope, myVilleAPI, AuthentificationService) {
	twemoji.size = 72;
	$scope.twemoji = twemoji;
	$scope.vote = [
		{
			smiley: '😍',
			isVote: false,
			text: "J'aime"
		},
		{
			smiley: '😃',
			isVote: false,
			text: "Wouah"
		},
		{
			smiley: '🤔',
			isVote: false,
			text: "Bien pensé"
		},
		{
			smiley: '😴',
			isVote: false,
			text: "Sans intérêt"
		},
		{
			smiley: '😣',
			isVote: false,
			text: "J'aime pas"
		},
	];
	// If logged which search if user has voted
	if(AuthentificationService.routeGuardian()){
		myVilleAPI.Vote.getVote($scope.ngDialogData._id).then(function(vote){
			if(vote){
				$scope.vote[vote.data.vote[0]].isVote = true;
			}
		})
	}
	$scope.voteCount = $scope.ngDialogData.vote.length;

	// call for a vote
	$scope.doVote = function(id){
		if(!$scope.vote[id].isVote){ // Not voted we add a vote
			myVilleAPI.UAS.vote($scope.ngDialogData._id, {vote: id}).then(function(){
				var alreadyVoted = false;
				for(var i = 0; i < $scope.vote.length; i++){
					if($scope.vote[i].isVote) {
						alreadyVoted = true;
					}
					if(i == id){
						$scope.vote[i].isVote = true;
					}else{
						$scope.vote[i].isVote = false;
					}
				}
				if(!alreadyVoted) $scope.voteCount++;
			});
		} else { // Already voted we remove the vote
			myVilleAPI.UAS.deleteVote($scope.ngDialogData._id).then(function(){
				for(var i = 0; i < $scope.vote.length; i++){
					if($scope.vote[i].isVote) {
						$scope.vote[i].isVote = false;
						$scope.voteCount--;
					}
				}
			});
		}
	};
});
