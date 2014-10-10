/* global describe, beforeEach, browser, it, expect, element: true */
describe('Directives', function() {
	'use strict';
	describe('navmenu', function() {

		beforeEach(function() {
			browser().navigateTo('/');
		});

		it('should change the language icon as user clicks on it', function() {
			element('#divLangDesk img').click();
			expect(element('#divLangDesk img').attr('src'))
				.toBe('images/lang_english.png');
		});
	});

	describe('seachButton', function() {

		beforeEach(function() {
			browser().navigateTo('/#/experience');
		});

		describe('allows user to search responsively', function() {

			var isMobile = false;

			var setMobile = function(value) {
				isMobile = value;
			};

			beforeEach(function() {
				element(':first').query(function(first, done) {
					if(first.outerWidth(true) + 15 > 480) {
						setMobile(false);
						done();
					} else {
						setMobile(true);
						done();
					}
				});
			});

			it('search button works responsively', function() {
				element(':first').query(function(first, done) {
					if(isMobile) {
						var searchInput = element('.searchButtonContainer > input', 'MOBILE TESTING');
						expect(searchInput.css('display')).toBe('none');
						// deletes the input value on close button click
						input('searchQuery').enter('at sistemas');
						element('.searchButtonContainer > button', 'HOLA QUE TAL').click();
						expect(input('searchQuery').val()).toBe("");
						// hides the input on blur CANNOT BE TESTED WITH KARMA E2E
						done();
					} else {
						expect(element('.searchButtonContainer > input', 'TABLET/DESKTOP TESTING')
							.css('display')).toBe('block');
						done();
					}
				});
			});
		});
	});
});
