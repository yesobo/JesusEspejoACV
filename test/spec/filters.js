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
});
