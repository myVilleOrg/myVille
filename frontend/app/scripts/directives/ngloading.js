'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:ngLoading
 * @description
 * # ngLoading
 */
angular.module('appApp')
  .directive('ngLoading',['$http', function ($http) {
      return {
        restrict: 'A',
        link: function(scope, elem) {
          scope.isLoading = isLoading;
          scope.$watch(scope.isLoading, toggleElement);
          function toggleElement(loading) {
            if (loading) elem.show();
            else elem.hide();
          }

          function isLoading() {
            return $http.pendingRequests.length > 0;
          }
        }
      };
    }]);
