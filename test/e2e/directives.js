/* global describe, beforeEach, browser, it, expect, element: true */
'use strict';
describe('Directives', function() {
	describe('navmenu', function() {
		
		beforeEach(function() {
			browser().navigateTo('/');
		});

		it('should change the language icon as user clicks on it', function() {
			element('#ul-lang img').click();
			expect(element('#ul-lang img').attr('src')).toBe('images/lang_english.png');
		});
	});

	ddescribe('seachButton', function() {
		
		beforeEach(function() {
			browser().navigateTo('/#/experience');
		});
		
		it('allows user to search responsively', function() {
			element(':first').query(function(first, done) {
				// adding 15 px for the scrollbar
				if(first.outerWidth(true) + 15 > 480) {
					expect(element('.searchButtonContainer > input').css('display')).toBe('block');
					done();
				} else {
					var searchInput = element('.searchButtonContainer > input');
					expect(searchInput.css('display')).toBe('none');
					searchInput.click();
					expect(searchInput.css('display')).toBe('block');
					// deletes the input value on close button click
					input('searchQuery').enter('at sistemas');
					element('.searchButtonContainer > button').click();
					expect(input('searchQuery').val()).toBe("");
					// hides the input on blur
					element('.employerNameWrapper').click();
					//pause();
					done();
				}
			});
		});
	})	
})

