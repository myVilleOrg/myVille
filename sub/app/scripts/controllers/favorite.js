'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:FavoriteCtrl
 * @description
 * # UACtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('FavoriteCtrl', function ($scope) {

  	$scope.openUA = function(coordinates){
  		$scope.$emit('centerOnMap', coordinates);
  	}

 });