/* global describe, beforeEach, browser, it, expect, element: true */
'use strict';
describe('Navmenu', function() {
	
	beforeEach(function() {
		browser().navigateTo('/');
	});

	it('should change the language icon as user clicks on it', function() {
		element('#ul-lang img').click();
		expect(element('#ul-lang img').attr('src')).toBe('images/lang_english.png');
	});
});