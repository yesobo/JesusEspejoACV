/* global $q: false */
'use strict';

angular.module('JesusEspejoACVFilters', ['pascalprecht.translate'])
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
.filter('datesDiff', ['$translate', '$q',
	function($translate, $q) {

		var datesTranslation = {};

		$translate('MONTHS').then(function(monthsTranslated) {
			datesTranslation.MONTHS = monthsTranslated;
		});

		$translate('MONTH').then(function(monthTranslated) {
			datesTranslation.MONTH = monthTranslated;
		});

		$translate('YEARS').then(function(yearsTranslated) {
			datesTranslation.YEARS = yearsTranslated;
		});

		$translate('YEAR').then(function(yearTranslated) {
			datesTranslation.YEAR = yearTranslated;
		});

		var getMonthsLabel = function(months) {

			var result = '';
			if ( months > 0 ) {
				result += months + ' ';
				if (months > 1) {
					result += datesTranslation.MONTHS;
				} else {
					result += datesTranslation.MONTH;
				}
			}

			return result;
		};

		var getYearsLabel = function(years, months) {

			var result = '';
			if ( years > 0 ) {
				result += years + ' ';
				if ( years > 1) {
					result += datesTranslation.YEARS;
				} else {
					result += datesTranslation.YEAR;
				}
				if ( months > 0) {
					result += ' ';
				}
			}

			return result;
		};

		return function(datesObj) {
			var dStart = new Date(datesObj[0]);
			var dEnd;
			if(datesObj[1] === '') {
				dEnd = new Date();
			} else {
				dEnd = new Date(datesObj[1]);
			}
			var monthDiff = (dEnd.getFullYear() -
				dStart.getFullYear()) * 12 + dEnd.getMonth() - dStart.getMonth();
			var years = Math.floor(monthDiff / 12);
			var months = monthDiff % 12;

			return getYearsLabel(years, months) + getMonthsLabel(months);
		};
	}]);
