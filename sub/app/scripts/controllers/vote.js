'use strict';
angular.module('appApp')
.controller('VoteCtrl', function ($rootScope, $scope, myVilleAPI) {
	$scope.vote = [
		{
			smiley: '😃',
			isVote: false,
			text: "wouah"
		},
		{
			smiley: '😣',
			isVote: false,
			text: "j'aime pas"
		},
		{
			smiley: '😍',
			isVote: false,
			text: "j'aime"
		},
		{
			smiley: '😴',
			isVote: false,
			text: "sans intérêt"
		},
		{
			smiley: '🤔',
			isVote: false,
			text: "bien pensé"
		}
	];

	myVilleAPI.Vote.getVote($scope.ngDialogData._id).then(function(vote){
		console.log($scope.ngDialogData._id);
		console.log("lololo");
		if(vote){
			console.log(vote.data.vote[0]);
			$scope.vote[vote.data.vote[0]].isVote = true;
		}
	})

	$scope.doVote = function(id){
		var data = {
			vote: id
		}
		myVilleAPI.UAS.vote($scope.ngDialogData._id, data).then(function(){
			for(var i = 0; i<$scope.vote.length; i++){
				if(i == id){
					$scope.vote[i].isVote = true;
				}else{
					$scope.vote[i].isVote = false;
				}
			}
		});
	};
});