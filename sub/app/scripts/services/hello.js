'use strict';

/**
 * @ngdoc service
 * @name appApp.hello
 * @description
 * # hello
 * Provider in the appApp.
 */
angular.module('appApp')
.provider('hello', function () {
  this.$get = function () {
    return hello;
  };

  this.init = function (services, options) {
    hello.init(services, options);
  };
});
