'use strict';

describe('filter', function() {
	beforeEach(module('JesusEspejoACVApp'));

	describe('myDate', function() {
		it('should convert dates to MM-yyyy format',
			inject(function($filter) {
				expect($filter('myDate')('2010-04-01T00:00:00'))
				.toBe('04-2010');
			}));
	});

	describe('datesDiff', function($filter) {
		it('should return dates difference in years and months',
			inject(function($filter) {
				expect($filter('datesDiff')(['2010-04-01T00:00:00', '2011-05-01T00:00:00']))
				.toBe('1 year 1 month');
			}));
	});
});