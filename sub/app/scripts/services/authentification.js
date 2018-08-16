'use strict';

/**
 * @name Authentification
 * @description
 * # myVille
 * Service that delivers basic functions to logout, login ...
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
					$rootScope.ajoutDeGroup = false;
					localStorageService.set('expiryToken', Date.now() + 24*60*60*1000);
					localStorageService.set('token', token);
					localStorageService.set('ajoutDeGroup', false);
					localStorageService.set('user', user);
					$rootScope.$broadcast('firstLoginTutorial');
					$rootScope.$broadcast('leafletDirectiveMap.map.dragend'); // update map
				},
				logout: function(){
					delete $rootScope.token;
					delete $rootScope.user;
					localStorageService.remove('token');
					localStorageService.remove('user');
					localStorageService.remove('expiryToken');
					$rootScope.$broadcast('filterForce', 0);
					$rootScope.$broadcast('leafletDirectiveMap.map.dragend');
  			},
        updateAvatar: function(user){
          $rootScope.user = user.data;
          localStorageService.set('user', user.data);
        }
			};
}]);
