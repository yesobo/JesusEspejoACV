/* global describe, ddescribe, beforeEach, inject, it, expect: true */
'use strict';

describe('directive: main-left', function() {

  beforeEach(module('MainLeftDirective'));

  // load the templates
  beforeEach(module('app/views/templates/main-left.html'));
  // tip: could load the template in a module declared at karma.conf with ngHtml2JsPreprocessor

  var scope, element, childElement;

  beforeEach(inject(function($templateCache, $compile, $rootScope) {

    var template = $templateCache.get('app/views/templates/main-left.html');
    $templateCache.put('views/templates/main-left.html', template);

    var htmlString =
      '<main-left custom-query="myQuery" custom-title="myTitle" custom-subtitle="mySubtitle"><span>test</span></main-left>';

    scope = $rootScope.$new();

    scope.myTitle = 'title';
    scope.mySubtitle = 'subtitle';
    scope.myQuery = 'query';

    var elem = angular.element(htmlString);
    element = $compile(elem)(scope);
    scope.$digest();

    childElement = element.scope();
  }));

  describe('should display', function() {

    it('h2 with title and h5 with the subtitle ', function() {
      var isolated = element.isolateScope();
      expect(element.find('h2').text()).toBe(isolated.customTitle);
      expect(element.find('h5').text()).toBe(isolated.customSubtitle);
    });

    it('search-button directive', function() {
      expect(element.find('search-button').length).toBe(1);
    });
  });

  describe('should not transclude content', function() {
    it('the <span>test</span> tag', function() {
      expect(element.find('span').length).toBe(0);
    });
  });

  describe('with the first given values', function() {
    it('should match the attributes with isolated scope', function() {
      var isolated = element.isolateScope();
      expect(isolated.customQuery).toBe('query');
      expect(isolated.customTitle).toBe('title');
      expect(isolated.customSubtitle).toBe('subtitle');
    });
  });

  describe('MainLeftController', function() {
    beforeEach(inject(function($controller, $window) {
      window = $window;
      $controller('MainLeftController',
        {$scope: scope, $window: window});

      scope.$digest();
    }));

    it('sets the scope variable to hide sectionTitleWrapper', function() {
      expect(scope.sectionTitleWrapperVisible).toBe(true);
    });

    describe('on mobile', function() {
      beforeEach(function() {
        window.innerWidth = 479;
      });
      it('function showTitle shows sectionTitleWrapper', function() {
        scope.showTitle();
        expect(scope.sectionTitleWrapperVisible).toBe(true);
      });
      it('function hideTitle hides sectionTitleWrapper', function() {
        scope.hideTitle();
        expect(scope.sectionTitleWrapperVisible).toBe(false);
      });
      it('function exitSearchMode() shows sectionTitlWrapper', function() {
        scope.sectionTitleWrapperVisible = false;
        scope.exitSearchMode('');
        expect(scope.sectionTitleWrapperVisible).toBe(true);
      });
      it('function exitSearchMode(\'query\') does not shows sectionTitleWrapperVisibel', function() {
        scope.sectionTitleWrapperVisible = false;
        scope.exitSearchMode('query');
        expect(scope.sectionTitleWrapperVisible).toBe(false);
      });
    });
  });
});
