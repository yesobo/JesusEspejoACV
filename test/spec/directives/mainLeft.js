/* global describe, ddescribe, beforeEach, inject, it, expect: true */
'use strict';

describe('experienceDetailsDirective', function() {

  var scope, element;

  beforeEach(module('MainLeftDirective'));

  // load the templates
  beforeEach(module('app/views/templates/main-left.html'));
  // tip: could load the template in a module declared at karma.conf with ngHtml2JsPreprocessor

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {

    var template = $templateCache.get('app/views/templates/main-left.html');
    $templateCache.put('views/templates/main-left.html', template);

    scope = _$rootScope_;

    var htmlString = '<main-left></main-left>';
    var elem = angular.element(htmlString);
    element = _$compile_(elem)(scope);
    scope.$digest();
  }));

  it('should provide activateSearchButton set to true in its isolated scope', function() {
    expect(element.scope().activateSearchButton).toBeDefined();
    expect(element.scope().activateSearchButton).toBe(true);
  });

  it('should provide hideAndExpand function', function() {
    expect(element.scope().hideAndExpand).toBeDefined();
  })

  it('should provide exitSearchMode function', function() {
    expect(element.scope().exitSearchMode).toBeDefined();
  })
});
