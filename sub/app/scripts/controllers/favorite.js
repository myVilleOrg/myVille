'use strict';
/**
 * @name MainCtrl
 * @description
 * # myVille
 * Controller of favorite page
 */
angular.module('appApp')
  .controller('FavoriteCtrl', function ($rootScope, $scope, myVilleAPI) {
	$scope.$emit('filterForce', 3);
	var getFavorites = function(){
		$scope.favorites = $rootScope.user.favoris;
		$scope.tabFavorite = [];
		//TODO Recode this function with favorite route
	  	if($scope.favorites !== null){
	  		for(var i=0;i < $scope.favorites.length;i++){
	  			myVilleAPI.UAS.getOne($scope.favorites[i]).then(function(ua){
						myVilleAPI.User.get(ua.data.owner).then(function(user){
							var data = {
								ua: ua,
								owner: user.data.username
							};
							$scope.tabFavorite.push(data);
						});
	  			});
	  		}
	  	}
	};

	getFavorites();

	$scope.$on('updateFavorite', function(){
		getFavorites();
	});

	$scope.centerOnMap = function(coordinates){
		$scope.$emit('centerOnMap', coordinates); // we do an event to tell to map controller to do the center on these coordinates
	};
 });
