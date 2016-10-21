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
					localStorageService.set('expiryToken', Date.now());
          localStorageService.set('token', token);
          localStorageService.set('user', user);
  			}
  		};
}]);
