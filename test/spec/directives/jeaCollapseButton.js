/* global describe, beforeEach, inject, it, expect, $: true */
'use strict';

describe('directive: jea-collapse-button', function() {

  beforeEach(module('JeaCollapseButtonDirective'));

  var element, scope, isolated;

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {

    var elem = angular.element('<jea-collapse-button panelid="testPanel"><span id="testSpan">test</span></jea-collapse-button>');

    scope = _$rootScope_;

    element = _$compile_(elem)(scope);
    scope.$digest();
  }));

  describe('should display', function() {
    it('an anchor with collapsed class', function() {
      expect($(element.find('a')[0]).hasClass('collapsed')).toBe(true);
    });
  });

  describe('should transclude content', function() {
    it('<span> tag should be found', function() {
      expect($(element).find('#testSpan').length).toBe(1);
    });
  });
});
