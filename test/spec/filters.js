/* global describe, beforeEach, it, expect, inject: false */
'use strict';

describe('filter', function() {
	beforeEach(module('JesusEspejoACVFilters'));

	// define mock $translate service
	beforeEach(module(function($provide) {
		$provide.factory('$translate', function() {
			var resultFunction = function(word)  {
				if(word === 'YEARS') {
					return 'years';
				} else if (word === 'YEAR') {
					return 'year';
				} else if (word === 'MONTHS') {
					return 'months';
				} else if (word === 'MONTH') {
					return 'month';
				}
			};
			return resultFunction;
		});
	}));

	describe('myDate', function() {

		var myDateFilter;

		beforeEach(inject(function($filter) {
			myDateFilter = $filter('myDate');
		}));
		
		it('exists', function() {
			expect(myDateFilter).not.toBeNull();
		});
		it('should convert dates to MM-yyyy format', function() {
			expect(myDateFilter('2010-04-01T00:00:00')).toBe('04-2010');
		});
	});


	describe('datesDiff', function() {

		it('should return dates difference in years and months',
			function() {
				inject(function($filter) {
					expect($filter('datesDiff')(
						['2010-04-01T00:00:00', '2011-05-01T00:00:00'])).toBe('1 year 1 month');
				});
			}
		);
	});
});