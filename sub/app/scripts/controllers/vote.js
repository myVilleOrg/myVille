'use strict';
/**
 * @name VoteCtrl
 * @description
 * # myVille
 * Controller which permits user to vote for a ua
 */
angular.module('appApp')
.controller('VoteCtrl', function ($rootScope, $scope,$http, myVilleAPI, AuthentificationService) {  //temp json
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

				//***TEMPORARY CHANGE QU'IL FAUT ÊTRE SUPPRIMÉ APRES~~~~~~~~~~~~~~~~~~~~~~~
				console.log("---------------------------------");
				console.log($scope.ngDialogData);
				console.log(vote);
				console.log("---------------------------------");
				//***
			}
		});
	}
console.log("ngD",$scope.ngDialogData);
	myVilleAPI.Criteria.get_criteria().then(function(criteriaMap){
		$scope.criteriaMap = criteriaMap
		console.log("---------------------------------");
		console.log($scope.criteriaMap.data )
		console.log("---------------------------------");
	});

	$scope.voteCount = $scope.ngDialogData.vote.length;
	console.log("button",$scope.button); //console log TEMP (affiche résultat envoyer par boutton)

	// call for a vote-----
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
		//var myJSON = JSON.stringify(vote);
	};


	//Fonction de vote pour les critères
	$scope.doVoteCriteria = function(id_criteria,value){
		var vote = {};

		if($scope.ngDialogData.vote.length<1){
			for(var cri in $scope.criteriaMap.data){
				if($scope.criteriaMap.data[cri]._id == id_criteria){
					vote[cri] = {'_id':$scope.criteriaMap.data[cri]._id,'value' : value};
				} else {
					vote[cri] = {'_id':$scope.criteriaMap.data[cri]._id,'value' : 0};
				}
			}
		} else {
			for(var cri in $scope.criteriaMap.data){
				if($scope.criteriaMap.data[cri]._id == id_criteria){
					vote[cri] = {'_id':$scope.criteriaMap.data[cri]._id,'value' : value};
				}
			}
		}
		console.log(vote);
		myVilleAPI.UAS.vote($scope.ngDialogData._id, vote).then(function(){
				console.log('ok');
		});
	};




	//count the vote number of each
	/*$scope.countVoteNb = function(){
		myVilleAPI.Vote.countVote($scope.ngDialogData._id).then(function(message){
			if(message){
				//***TEMPORARY CHANGE QU'IL FAUT ÊTRE SUPPRIMÉ APRES~~~~~~~~~~~~~~~~~~~~~~~
				console.log("---------------------------------");
				console.log(message);
				console.log("---------------------------------");
				//***
			}
		});
	};*/
});
