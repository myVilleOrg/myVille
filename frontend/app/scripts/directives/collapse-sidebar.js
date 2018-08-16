'use strict';

/**
 * @name Sidebar
 * @description
 * # myVille
 * Directive for left sidebar
 */
angular.module('appApp')
	.directive('collapseSidebar', function($timeout) {
		return {
			restrict: 'AE',
			replace: true,
			transclude: true,
			require: '?headingTitle',
			template: '<div class="wrapper-side-sidebar">' +
									'<div class="heading-side">' +
										'<a ng-click="back()"><i class="fa fa-chevron-left back"></i></a>' +
										'<a ng-click="forward()"><i class="fa fa-chevron-right back"></i></a>' +
										'<div class="heading-title">' +
											'{{headingtitle}}' +
										'</div>' +
										'<a href="/#/" ng-click="emitFilter()"><i class="fa fa-times back"></i></a>' +
									'</div>' +
									'<div class="content-side" ng-transclude>' +
									'</div>' +
								'</div>',
			scope: {
 					back: '@back',
					forward: '@forward',
 			},
			link: function (scope, element, attrs) {
				attrs.$observe('headingTitle', function(val){
					scope.headingtitle = val;
				});
				scope.back = function() {
						history.back();
				};
				scope.emitFilter = function() {
						  scope.$emit('filterForce', 0);
				};
				scope.forward = function() {
            history.forward();
        };
			}
		};
	});
