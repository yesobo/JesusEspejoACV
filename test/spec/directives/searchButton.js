/* global describe, ddescribe, beforeEach, inject, it, expect, $: true */
'use strict';

describe('seachButtonDirective', function() {

  beforeEach(module('SearchButtonDirective'));

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