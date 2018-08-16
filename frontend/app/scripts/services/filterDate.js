'use strict';
/**
 * @name FilterDate
 * @description
 * # myVille
 * Permits to format date in a string like few moments ago
 */
angular.module('appApp')
 .filter('formatDate', function ($filter) {
		return function (date) {
				if (date) {
						return moment(new Date(date)).locale('fr').fromNow();
				}
				else return "";
		};
});
