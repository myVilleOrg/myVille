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
          loginGoogle: function(data) {
            return $http.post(baseUrl + '/user/login/google', data);
          },
          create: function(data){
            return $http.post(baseUrl + '/user/create', data);
          },
          update: function(data) {
            return $http.put(baseUrl + '/user/update', data);
          },
          updateAvatar: function(data) {
            return $http.post(baseUrl + '/user/update/avatar', data, {transformRequest: angular.identify, headers: {'Content-Type': undefined, enctype:'multipart/form-data'}});
          },
          get: function(data){
          	return $http.get(baseUrl + '/user/' + data);
          }

        },

        UAS: {
        	get: function(data){
						return $http.get(baseUrl + '/ua/get/geo', {params: data});
        	},
          create: function(data){
            return $http.post(baseUrl + '/ua/create', data);
          },
        	getPopular: function(data){
						return $http.get(baseUrl + '/ua/get/geo', {params: data});
        	},
        	getMine: function(){
        		return $http.get(baseUrl + '/ua/get/mine');
        	},
        	getOne: function(id){
        		return $http.get(baseUrl + '/ua/' + id);
        	},
        	update: function(id, data){
							return $http.put(baseUrl + '/ua/' + id, data);
        	}

        }

      };
      return dataFactory;
    }]);
