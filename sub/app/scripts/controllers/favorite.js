'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:FavoriteCtrl
 * @description
 * # UACtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('FavoriteCtrl', function ($scope, myVilleAPI) {

	$scope.favorites=[];

  	myVilleAPI.User.favoris().then(function(datas){
  		for(var i=0;i<datas.length;i++){
  			myVilleAPI.UAS.getOne(datas[i]).then(function(ua){
  				$scope.favorites.push(ua.title);
  			});
  		}
  	});

 });