'use strict';

/**
 * @ngdoc service
 * @name appApp.myVilleAPI
 * @description
 * # myVilleAPI
 * Factory in the appApp.
 */
angular.module('appApp')
  .factory('myVilleAPI', ['$http', function ($http) {
      // Service logic
      // ...
      var baseUrl = 'http://localhost:3000';
      var dataFactory = {};
      dataFactory.login = function(data){
        return $http.post(baseUrl + '/user/login', data);
      };
      dataFactory.create = function(crus){
        return $http.post(baseUrl + '/user/create', data);
      };
      return dataFactory;
    }]);
