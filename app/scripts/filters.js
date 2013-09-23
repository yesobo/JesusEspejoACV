'use strict';

angular.module('JesusEspejoACVApp')
.filter('myDate', function($filter) {
    var angularDateFilter = $filter('date');
    return function(dateString) {
			var d = new Date(dateString);
			if(dateString === '') {
				d = new Date();
			}
			return angularDateFilter(d.getTime(), 'MM-yyyy');
    };
	})
.filter('datesDiff', function($filter, $translate) {

	return function(datesObj) {
		var dStart = new Date(datesObj[0]);
		var dEnd = new Date(datesObj[1]);
		var monthDiff = (dEnd.getFullYear() -
			dStart.getFullYear()) * 12 + dEnd.getMonth() - dStart.getMonth();
		var years = Math.floor(monthDiff / 12);
		var months = monthDiff % 12;
		var result = '';
		if ( years > 0 ) {
			result += years + ' ';
			if ( years > 1) {
				result += $translate('YEARS');
			} else {
				result += $translate('YEAR');
			}
			if ( months > 0) {
				result += ' ';
			}
		}
		if ( months > 0 ) {
			result += months + ' ';
			if (months > 1) {
				result += $translate('MONTHS');
			} else {
				result += $translate('MONTH');
			}
		}
		return result;
	};
});
