'use strict';

describe('filter', function() {
	beforeEach(module('JesusEspejoACVApp'));

	describe('myDate', function() {
		it('should convert dates to MM-yyyy format',
			inject(function($filter) {
				expect($filter('myDate')('2010-04-01 00:00:00 UTC'))
				.toBe('04-2010');
			}));
	});
});