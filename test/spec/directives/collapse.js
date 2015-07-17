/*eslint-env jasmine */
/*global inject, angular, module, $*/

describe("directive: collapse", function () {
  "use strict";
  var scope, div, sibling, parent, jStickyHeader, element;

  beforeEach(function(){
     module("jea.directives.stickCollapseHeader");
  });

  beforeEach(inject(function($compile, $rootScope) {

    div = angular.element("<tested jea-stick-collapse-header>test</tested>");
    sibling = angular.element("<fake-sibling></fake-sibling>");
    parent = angular.element("<fake-parent></fake-parent>");
    parent.append(sibling);
    parent.append(div);

    scope = $rootScope;

    element = $compile(parent)(scope);
    scope.$digest();

    jStickyHeader = $(sibling);
  }));

  describe("div is opened (not collapse)", function() {
      beforeEach(function() {
        div[0].opened = true;
      });

      it('activates sticky_kit on the header on transitionend event', function(){
        div[0].opened = true;
        element.find("tested").triggerHandler("transitionend");
        expect(jStickyHeader.data().sticky_kit).toBeTruthy();
      });
  });

  describe("div is collapsed", function() {
      it('does not activate sticky_kit on the header on transitionend event', function(){
        element.find("tested").triggerHandler("transitionend");
        expect(jStickyHeader.data().sticky_kit).not.toBeDefined();
      });
  });
});
