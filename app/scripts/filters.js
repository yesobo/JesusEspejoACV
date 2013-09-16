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
.filter('datesDiff', function($filter) {

	return function(datesObj) {
		var dStart = new Date(datesObj[0]);
		var dEnd = new Date(datesObj[1]);
		var month_diff = (dEnd.getFullYear() - 
			dStart.getFullYear()) * 12 + dEnd.getMonth() - dStart.getMonth();
		var years = Math.floor(month_diff / 12);
		var months = month_diff % 12;
		var result = "";
		if ( years > 0 ) {
			result += years + ' year';
			if ( years > 1) {
				result += 's';
			}
			if ( months > 0) {
				result += ' ';
			}
		}
		if ( months > 0 ) {
			result += months + ' month';
			if (months > 1) {
				result += 's';
			}
		}
		return result;
	};
});
