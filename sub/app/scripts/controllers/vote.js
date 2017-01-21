'use strict';
angular.module('appApp')
.controller('VoteCtrl', function ($rootScope, $scope, myVilleAPI) {
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

	myVilleAPI.Vote.getVote($scope.ngDialogData._id).then(function(vote){
		if(vote){
			$scope.vote[vote.data.vote[0]].isVote = true;
		}
		$scope.voteCount = vote.data.count;
	}).catch(function(count){
		$scope.voteCount = count.data.count;
	});

	$scope.doVote = function(id){
		myVilleAPI.UAS.vote($scope.ngDialogData._id, {vote: id}).then(function(){
			var alreadyVoted = false;
			for(var i = 0; i<$scope.vote.length; i++){
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
	};
});
