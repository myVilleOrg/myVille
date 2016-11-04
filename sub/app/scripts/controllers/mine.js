'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MineCtrl
 * @description
 * # MineCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('MineCtrl', function ($rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    console.log($rootScope.cachedMarkers.features[0])
  });
