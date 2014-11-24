/* global describe, beforeEach, inject, it, expect, $: true */
'use strict';

describe('directive: search-button', function() {

  beforeEach(module('SearchButtonDirective'));

  //load the templates
  beforeEach(module('app/views/templates/search-button.html'));
  // tip: could load the template in a module declared at karma.conf with ngHtml2JsPreprocessor

  var element, scope, isolated;

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {

    var template = $templateCache.get('app/views/templates/search-button.html');
    $templateCache.put('views/templates/search-button.html', template);
    var elem = angular.element('<search-button search-query="hola" custom-placeholder="holder" on-expand="expand()" on-collapse="collapse()" custom-blur="blur()"><span id="test">text</span></search-button>');

    scope = _$rootScope_;

    scope.hola = 'hola';
    scope.holder = 'holder';
    scope.expand = function(){return 1;};
    scope.collapse = function(){return 2;};
    scope.blur = function(){return 3;};

    element = _$compile_(elem)(scope);
    scope.$digest();

    isolated = element.isolateScope();
  }));

  describe('should display', function() {

    it('the glyphicon, input and cancel button', function() {
      expect($(element.find('span')[0]).hasClass('glyphicon-search')).toBe(true);
      expect($(element.find('form')[0]).attr('handle-phone-submit')).toBeDefined();
      expect($(element.find('input')[0]).attr('id')).toBe('searchInput');
      expect($(element.find('button')[0]).hasClass('close')).toBe(true);
    });

  });

  describe('should not transclude content', function() {
    it('<span> tag should not be found', function() {
      expect($(element).find('#test').length).toBe(0);
    });
  });

  describe('with the first given values', function() {
    it('should match the attributes with isolated scope', function() {
      expect(isolated.searchQuery).toBe('hola');
      expect(isolated.customPlaceholder).toBe('holder');
      expect(isolated.expandHandler()).toBe(1);
      expect(isolated.collapseHandler()).toBe(2);
      expect(isolated.blurHandler()).toBe(3);
    });
  });

  ddescribe('SearchButtonController', function() {
    beforeEach(inject(function($controller, $window) {
      $controller('SearchButtonController', {$scope: scope});

      scope.$digest();
    }));

    it('clear function resets the query', function() {
      scope.clear();
      expect(scope.searchQuery).toBe('');
    });

    describe('on desktop', function() {
      beforeEach(function() {
        window.innerWidth = 480;
      });
    });

    describe('on mobile', function() {
      beforeEach(function() {
        window.innerWidth = 479;
      });
      it('clear function without query hides the input', function() {
        isolated.searchQuery = '';
        scope.clear();
        expect($(element).find('.searchButtonContainer').hasClass('mobSearchMode')).toBe(true);
      });
      it('on click shows the input', function() {
        isCollapsed = false;
      });
    });
  })
});
