/* global describe, ddescribe, spyOn, beforeEach, inject, it, expect, $: true */

describe('navMenuDirective', function() {
  'use strict';

  beforeEach(module('NavMenuDirective'));

  // load the templates
  beforeEach(module('app/views/templates/navmenu.html'));
  // tip: could load the template in a module declared at karma.conf with ngHtml2JsPreprocessor

  var element, scope;

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {

    var template = $templateCache.get('app/views/templates/navmenu.html');
    $templateCache.put('views/templates/navmenu.html', template);
    var elem = angular.element('<nav-menu click-menu-item="clickMenu"></nav-menu>');

    scope = _$rootScope_;
    element = _$compile_(elem)(scope);
    scope.$digest();
  }));

  ddescribe('navmenu', function() {
    it('should set the language image to spanish by default', function() {
      // .find() is limited to tag name
      expect($(element.find('div')[4])
        .find('img').attr('src'))
        .toBe('images/lang_spanish.png');
    });

    describe('selectMenuItem function', function() {
      it('should change the selected menu item', function() {
        var menuItemNumber = 2;
        debugger;
        console.log(element.find('li')[menuItemNumber].children[0]);
        var liAnchor = element.find('li')[menuItemNumber].children[0];
        console.log(spyOn);
        spyOn(liAnchor, 'click');
        scope.clickMenu(2);
        expect(liAnchor.click).toHaveBeenCalled();
      });
    });
  });
});
