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

		var getMonthsLabel = function(months) {
			var deferred = $q.defer();

			var result = '';
			if ( months > 0 ) {
				result += months + ' ';
				if (months > 1) {
					$translate('MONTHS').then(function(monthsTranslated) {
						result += monthsTranslated;
						deferred.resolve(result);
					});
				} else {
					$translate('MONTH').then(function(monthTranslated) {
						result += monthTranslated;
						deferred.resolve(result);
					});
				}
			} else {
				deferred.resolve('');
			}

			return deferred.promise;
		};

		var getYearsLabel = function(years, months) {
			var deferred = $q.defer();

			var result = '';
			if ( years > 0 ) {
				result += years + ' ';
				if ( years > 1) {
					$translate('YEARS').then(function(yearsTranslated) {
						result += yearsTranslated;
						deferred.resolve(result);
					});
				} else {
					$translate('YEAR').then(function(yearTranslated) {
						result += yearTranslated;
						deferred.resolve(result);
					});
				}
				if ( months > 0) {
					result += ' ';
					deferred.resolve(result);
				}
			} else {
				deferred.resolve('');
			}

			return deferred.promise;
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

			getYearsLabel(years, months).then(function(yearsLabel) {
				getMonthsLabel(months).then(function(monthsLabel) {
					return yearsLabel + monthsLabel;
				});
			});
		};
	}]);
