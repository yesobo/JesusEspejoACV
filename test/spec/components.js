/* global describe, beforeEach, inject, it, expect, $: true */
'use strict';

describe('Directive', function() {
	
	beforeEach(module('JesusEspejoACVDirectives'));

	// load the templates
	beforeEach(module('app/views/templates/navmenu.html'));
	
	var scope, element, template;

	beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {
		
		template = $templateCache.get('app/views/templates/navmenu.html');
		$templateCache.put('views/templates/navmenu.html', template);
		var elem = angular.element('<nav-menu></nav-menu>');

		scope = _$rootScope_;
		element = _$compile_(elem)(scope);
		scope.$digest();
	}));

	describe('navmenu', function() {
		it('should set the language image to spanish by default', function() {
			// .find() is limited to tag name 
			expect($(element.find('ul')[1]).find('li>img').attr('src'))
				.toBe('images/lang_spanish.png');
			expect(true).toBe(true);
		});
	});
});