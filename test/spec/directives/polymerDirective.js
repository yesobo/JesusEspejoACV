/*eslint-env jquery */
/*global inject, angular, module*/

describe("directive: collapse", function () {
  "use strict";
  var scope, document, element, timeout;

  beforeEach(function(){
     module("jea.directives.polymerDirective");
  });

  beforeEach(inject(function($compile, $rootScope, $document, $timeout) {

    scope = $rootScope;
    document = $document;
    element = $compile(angular.element("<polymer-element polymer-directive></polymer-element>"))(scope);

    document.find('body').append(element);
    scope.$digest();

    timeout = $timeout;
  }));

  it("waits for the WebComponentsReady event to be launched", function() {
    expect(element.data().$scope.ctrl.waiting).toBeTruthy();
  });

  describe("if WebComponentsReady is handled", function() {
    beforeEach(function() {
      document[0].dispatchEvent(new Event('WebComponentsReady'));
    });

    it("captures document's WebComponentsReady so stops waiting for it", function() {
      expect(element.data().$scope.ctrl.waiting).toBeFalsy();
    });
  });

  describe("if WebComponentsReady is'nt handled", function() {
    it('after 1s stops waiting', function() {
      timeout(function() {
        expect(element.data().$scope.ctrl.waiting).toBeFalsy();
      }, 1000);
    });
  });
});
