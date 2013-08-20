'use strict';

describe('Directive', function() {
	
	beforeEach(module('JesusEspejoACVDirectives'));

	// load the templates
	beforeEach(module('app/views/templates/navmenu.html'));
	
	var scope, element, template;

	beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {
		
		template = $templateCache.get('app/views/templates/navmenu.html');
		$templateCache.put('views/templates/navmenu.html', template);
		var elem = angular.element('<navmenu></navmenu>');

		scope = _$rootScope_;
		element = _$compile_(elem)(scope);
		scope.$digest();
	}));

	describe('navmenu', function() {
		it('should set the language image to spanish by default', function() {
			expect($('#ul-lang > li > img', element).attr('src')).toBe('img/lang_spanish.png');
			expect(true).toBe(true);
		});
	});
});