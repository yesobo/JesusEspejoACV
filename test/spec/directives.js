/* global describe, ddescribe, beforeEach, inject, it, expect, $: true */
'use strict';

describe('Directive', function() {
	
	beforeEach(module('JesusEspejoACVDirectives'));

	describe('navMenuDirective', function() {
		// load the templates
		beforeEach(module('app/views/templates/navmenu.html'));
		// tip: could load the template in a module declared at karma.conf with ngHtml2JsPreprocessor
		
		var element;

		beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {
			
			var template = $templateCache.get('app/views/templates/navmenu.html');
			$templateCache.put('views/templates/navmenu.html', template);
			var elem = angular.element('<nav-menu></nav-menu>');

			var scope = _$rootScope_;
			element = _$compile_(elem)(scope);
			scope.$digest();
		}));

		describe('navmenu', function() {
			it('should set the language image to spanish by default', function() {
				// .find() is limited to tag name 
				expect($(element.find('ul')[1]).find('li>img').attr('src'))
					.toBe('images/lang_spanish.png');
			});
		});
	});

	describe('seachButtonDirective', function() {

		//load the templates
		beforeEach(module('app/views/templates/search-button.html'));

		var element;

		beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {

			var template = $templateCache.get('app/views/templates/search-button.html');
			$templateCache.put('views/templates/search-button.html', template);
			var elem = angular.element('<search-button></search-button>');

			var scope = _$rootScope_;
			element = _$compile_(elem)(scope);
			scope.$digest();
		}));

		describe('searchButton', function() {
			it('should compile to a div with searchButtonContainer class', function() {
				expect(element.hasClass('searchButtonContainer')).toBe(true);
			});

			it('should compile to a div > span + input + button', function() {
				expect(element.children().length).toBe(3);
				expect(element.children()[0].tagName).toBe('SPAN');
				expect(element.children()[1].tagName).toBe('INPUT');
				expect(element.children()[2].tagName).toBe('BUTTON');
			});
		});
	});
});