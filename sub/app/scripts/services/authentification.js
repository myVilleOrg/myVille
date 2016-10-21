'use strict';

/**
 * @ngdoc service
 * @name appApp.Authentification
 * @description
 * # Authentification
 * Factory in the appApp.
 */
angular.module('appApp')
.factory('AuthentificationService', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {
  		return {
  			routeGuardian: function(){
  				if($rootScope.user) {
  					return true;
  				} else {
  					Promise.reject('Authentification needed.')
  				}
  			},
  			login: function(token, user){
					$rootScope.token = token;
          $rootScope.user = user;
					localStorageService.set('expiryToken', Date.now() + 24*60*60*1000);
          localStorageService.set('token', token);
          localStorageService.set('user', user);
  			},
  			logout: function(){
					delete $rootScope.token;
					delete $rootScope.user;
					localStorageService.remove('token');
					localStorageService.remove('user');
					localStorageService.remove('expiryToken');
  			}
  		};
}]);
