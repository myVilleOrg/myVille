'use strict';

/**
 * @name Hello
 * @description
 * # myVille
 * Wrapper for Hello.js
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
