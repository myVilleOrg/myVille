'use strict';

/**
 * @name appApp
 * @description
 * # myVille
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
		'ui.tinymce',
		'angular-intro',
		'ngStorage'
	])
	.config(function(helloProvider) {
		// Setting for Hello to manage login with social network
		helloProvider.init({
			facebook: '269509866781876',
			google: '49433176261-hjeueecpafioh56r67fik9nqkum5np0g.apps.googleusercontent.com'
		});
	})
	.config(function($logProvider){
		$logProvider.debugEnabled(false);
	})
	.config(function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('myVille');
	})
	.config(function($httpProvider) {
		// add token when logged to HTTP requests
		$httpProvider.interceptors.push(['localStorageService', function(localStorageService){
			return {
				request: function(config) {
					var token = localStorageService.get('token');
					config.headers = config.headers || {};
					if (token !== null) {
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
					if(receivedToken !== null && currentToken !== receivedToken) {
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
	.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.when('/login', {
				controller: 'LoginCtrl',
				controllerAs: 'login',
				templateUrl: 'views/login.html'
			})
			.when('/user/:userId', {
				controller: 'ProfileCtrl',
				controllerAs: 'profile',
				templateUrl: 'views/profile.html'
			})
			.when('/search', {
				controller: 'SearchCtrl',
				controllerAs: 'search',
				templateUrl: 'views/search.html'
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
			.when('/profile/favorite', {
				controller: 'FavoriteCtrl',
				controllerAs: 'favorite',
				templateUrl: 'views/favorite.html',
				resolve: {
					auth: function(AuthentificationService){
						return AuthentificationService.routeGuardian();
					}
				}
			})
			.when('/profile/group', {
				controller: 'CGroupCtrl',
				controllerAs: 'group',
				templateUrl: 'views/group.html',
				resolve: {
					auth: function(AuthentificationService){
						return AuthentificationService.routeGuardian();
					}
				}
			})
			.when('/profile/create_group', {
				controller: 'CGroupCtrl',
				controllerAs: 'group',
				templateUrl: 'views/create_group.html',
				resolve: {
					auth: function(AuthentificationService){
						return AuthentificationService.routeGuardian();
					}
				}
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
			$locationProvider.html5Mode(false).hashPrefix('');
	});
