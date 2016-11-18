'use strict';

angular.module('appApp')
 .filter('formatDate', function ($filter) {
		return function (date) {
				if (date) {
						return moment(new Date(date)).locale('fr').fromNow();
				}
				else return "";
		};
});
