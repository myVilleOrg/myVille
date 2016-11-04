'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:collapseSidebar
 * @description
 * # collapseSidebar
 */
angular.module('appApp')
	.directive('collapseSidebar', function($timeout) {
		return {
			restrict: 'AE',
			replace: true,
			transclude: true,
			template: '<div class="wrapper-side-sidebar">' +
									'<div class="heading-side">' +
										'<a href="/#/"><i class="fa fa-chevron-left back"></i></a>' +
										'<div class="heading-title">' +
											'{{headingtitle}}' +
										'</div>' +
									'</div>' +
									'<div class="content-side" ng-transclude>' +
									'</div>' +
								'</div>',
			link: function postLink(scope, element, attrs) {
				$timeout(function(){
					scope.headingtitle = attrs.headingTitle;
				});
			}
		};
	});
