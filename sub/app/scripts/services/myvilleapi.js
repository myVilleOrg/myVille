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
          	return $http.put(baseUrl + '/user/update', data, {headers: {'x-access-token': $rootScope.token}});
          }
          
        },

        Ua: {
          get_ua: function(data){
            return $http.get(baseUrl + '/ua/get/mine', data, {headers: {'x-access-token': $rootScope.token}});
          },
          create: function(data){
            return $http.post(baseUrl + '/ua/create', data, {headers: {'x-access-token': $rootScope.token}});
          }
        }

      };
      return dataFactory;
    }]);
