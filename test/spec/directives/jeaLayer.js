/* global describe, beforeEach, inject, it, expect, $: true */
describe('directive: jeaLayer', function() {
  'use strict';

  beforeEach(module('JeaLayerDirective'));

  var element, scope;

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {

    var elem = angular.element('<body><div jea-layer></div></body>');

    scope = _$rootScope_;
    element = _$compile_(elem)(scope);
    scope.$digest();
  }));

  describe('applied to elements with the "opened" property', function() {
    describe('on element core-overlay-open', function() {

      it('adds hideScroll class to body if element opened', function() {
        element[0].opened = true;
        element.triggerHandler('core-overlay-open');
        expect($('body').hasClass('hideScroll')).toBe(true);
      });
      it('removes hideScroll class to body if element is closed', function() {
        element[0].opened = false;
        element.triggerHandler('core-overlay-open');
        expect($('body').hasClass('hideScroll')).toBe(false);
      });
    });
  });
});
