'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:FavoriteCtrl
 * @description
 * # UACtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('FavoriteCtrl', function ($rootScope, $scope, myVilleAPI) {

	var favorite = function(){
		$scope.favorites=$rootScope.user.favoris;
		$scope.tabFavorite = [];
	  	if($scope.favorites!=null){
	  		for(var i=0;i<$scope.favorites.length;i++){
	  			myVilleAPI.UAS.getOne($scope.favorites[i]).then(function(ua){
	  				myVilleAPI.User.get(ua.data.owner).then(function(user){
	  					var data = {
	  						ua: ua,
	  						owner: user.data.username
	  					};
	  					$scope.tabFavorite.push(data);
	  				});
	  			});

	  		};
	  	};
	};

	favorite();

	$scope.$on('updateFavorite', function(){
		favorite();
	});

  	$scope.centerOnMap = function(coordinates){
		$scope.$emit('centerOnMap', coordinates); // we do an event to tell to map controller to do the center on these coordinates
	};
 });