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
		'ngHello',
		'ui.tinymce'
	])
	.config(function(helloProvider) {
		helloProvider.init({
			facebook: '269509866781876',
			google: '49433176261-hjeueecpafioh56r67fik9nqkum5np0g.apps.googleusercontent.com'
		});
	})
	.config(function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('myVille');
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push(['localStorageService', function(localStorageService){
			return {
				request: function(config) {
					var token = localStorageService.get('token');
					config.headers = config.headers || {};
					if (token != null) {
						config.headers['x-access-token'] = token;
					}
					return config || Promise.resolve(config);
				},
				requestError: function(rejection){
					return Promise.reject(rejection);
				},
				response: function(response){
					var currentToken = localStorageService.get('token');
					var receivedToken = response.headers('x-access-token');
					if(receivedToken != null && currentToken != receivedToken) {
						localStorageService.set('token', receivedToken);
					}
					return response || Promise.resolve(response);
				},
				responseError: function(rejection){
					return Promise.reject(rejection);
				}
			};
		}]);
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
			.when('/user/:userId', {
				controller: 'ProfileCtrl',
				controllerAs: 'profile',
				templateUrl: 'views/profile.html',
			})
			.when('/profile/update', {
				controller: 'ProfileCtrl',
				controllerAs: 'profile',
				templateUrl: 'views/profile_update.html',
				resolve: {
					auth: function(AuthentificationService){
						return AuthentificationService.routeGuardian();
					}
				}
			})
			.when('/createUA', {
				controller: 'UACtrl',
				controllerAs: 'ua',
				templateUrl: 'views/ua.html',
				resolve: {
					auth: function(AuthentificationService){
						return AuthentificationService.routeGuardian();
					}
				}
			})
			.when('/profile/mine', {
				controller: 'MineCtrl',
				controllerAs: 'mine',
				templateUrl: 'views/mine.html',
				resolve: {
					auth: function(AuthentificationService){
						return AuthentificationService.routeGuardian();
					}
				}
			})
			.when('/favorite', {
				controller: 'FavoriteCtrl',
				controllerAs: 'favorite',
				templateUrl: 'views/favorite.html',
			})
			.when('/ua/:uaId',{
				controller: 'MainCtrl',
				controllerAs: 'main',
				template: ' '
			})
			.when('/reset/:tokenReset',{
				controller: 'MainCtrl',
				controllerAs: 'main',
				template: ' '
			})
			.otherwise({
				redirectTo: '/'
			});
	});
