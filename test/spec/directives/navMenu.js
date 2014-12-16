/* global describe, spyOn, beforeEach, inject, it, expect, $: true */
describe('navMenuDirective', function() {
  'use strict';

  beforeEach(module('NavMenuDirective'));

  // load the templates
  beforeEach(module('app/views/templates/navmenu.html'));
  // tip: could load the template in a module declared at karma.conf with ngHtml2JsPreprocessor

  var element, scope, internalScope;

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {

    var template = $templateCache.get('app/views/templates/navmenu.html');
    $templateCache.put('views/templates/navmenu.html', template);
    var elem = angular.element('<nav-menu click-menu-item="clickMenu" nav-menu-items="menuItems"></nav-menu>');

    scope = _$rootScope_;
    element = _$compile_(elem)(scope);
    scope.$digest();
    internalScope = element.isolateScope();
  }));

  describe('navmenu', function() {
    it('should set the language image to spanish by default', function() {
      // .find() is limited to tag name
      expect(internalScope.langSwitchImg)
        .toBe('images/lang_spanish.png');
    });

    it('should expose a clickMenuItem funtion', function() {
      expect(scope.clickMenu).toBeDefined();
    });

    describe('clickMenuItem function', function() {
      it('should change the clicked menu item active class', function() {
        var requestedMenu = 'PROJECTS';
        var firstActiveElement = element.find('li')[0];
        expect(element.find('li')[0].className).toContain('active');
        scope.clickMenu(requestedMenu);
        expect(element.find('li')[2].className).toContain('active');
        expect(element.find('li')[0].className).not.toContain('active');
      });
    });
  });
});
