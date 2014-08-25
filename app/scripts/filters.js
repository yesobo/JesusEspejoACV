'use strict';

angular.module('JesusEspejoACVFilters', [])
.filter('myDate', ['$filter',
	function($filter) {
	    var angularDateFilter = $filter('date');
			return function(dateString) {
				var d = new Date(dateString);
				if(dateString === '') {
					d = new Date();
				}
				return angularDateFilter(d.getTime(), 'MM-yyyy');
			};
		}])
.filter('datesDiff', ['$translate',
	function(translator) {

		return function(datesObj) {
			var dStart = new Date(datesObj[0]);
			var dEnd;
			console.log(datesObj[1]);
			if(datesObj[1] === "") {
				dEnd = new Date();
			} else {
				dEnd = new Date(datesObj[1]);
			}
			var monthDiff = (dEnd.getFullYear() -
				dStart.getFullYear()) * 12 + dEnd.getMonth() - dStart.getMonth();
			var years = Math.floor(monthDiff / 12);
			var months = monthDiff % 12;
			var result = '';
			if ( years > 0 ) {
				result += years + ' ';
				if ( years > 1) {
					result += translator('YEARS');
				} else {
					result += translator('YEAR');
				}
				if ( months > 0) {
					result += ' ';
				}
			}
			if ( months > 0 ) {
				result += months + ' ';
				if (months > 1) {
					result += translator('MONTHS');
				} else {
					result += translator('MONTH');
				}
			}
			return result;
		};
	}]);
