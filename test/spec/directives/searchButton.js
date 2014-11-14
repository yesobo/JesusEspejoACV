/* global describe, beforeEach, inject, it, expect, $: true */
'use strict';

describe('seachButtonDirective', function() {

  beforeEach(module('SearchButtonDirective'));

  //load the templates
  beforeEach(module('app/views/templates/search-button.html'));

  var element, scope;

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {

    var template = $templateCache.get('app/views/templates/search-button.html');
    $templateCache.put('views/templates/search-button.html', template);
    var elem = angular.element('<search-button search-query="hola" custom-placeholder="hola"></search-button>');

    scope = _$rootScope_;
    element = _$compile_(elem)(scope);
    scope.$digest();
  }));

  describe('searchButton', function() {

    it('should has a searchButtonConainer class', function() {
      expect(element.hasClass("searchButtonContainer")).toBe(true);
    });

    it('should initialize its state to collapsed', function() {
      expect(element.scope().isCollapsed).toBe(true);
    });
  });
});
