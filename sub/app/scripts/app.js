'use strict';

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
  .module('appApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive',
    'LocalStorageModule',
    'ngDialog',
    'ngHello'
  ])
  .config(function(helloProvider) {
    helloProvider.init({
      facebook: '269509866781876'
    }, {redirect_uri: '/#/'});
  })
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('myVille');
  })
  .config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        controllerAs: 'login',
        templateUrl: 'views/login.html',
      })
      .when('/profile/update', {
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
        templateUrl: 'views/profile_update.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
