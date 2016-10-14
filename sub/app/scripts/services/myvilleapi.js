'use strict';

/**
 * @ngdoc service
 * @name appApp.myVilleAPI
 * @description
 * # myVilleAPI
 * Factory in the appApp.
 */
angular.module('appApp')
  .factory('myVilleAPI', ['$http', '$rootScope', function ($http, $rootScope) {

      var baseUrl = 'http://localhost:3000';
      var dataFactory = {
        User: {
          login: function(data){
            return $http.post(baseUrl + '/user/login', data);
          },
          loginFacebook: function(data) {
            return $http.post(baseUrl + '/user/login/facebook', data);
          },
          create: function(data){
            return $http.post(baseUrl + '/user/create', data);
          },
          update: function(data) {
          	return $http.put(baseUrl + '/user/update', data);
          }
        },
        UAS: {
        	get: function(data){
						return $http.get(baseUrl + '/ua/get/geo', {params: data});
        	}
        }
      };
      return dataFactory;
    }]);
