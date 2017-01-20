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

	$scope.doVote = function(id){
		var data = {
			vote: id
		}
		console.log($scope.ngDialogData._id);
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