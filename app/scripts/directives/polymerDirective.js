/*global angular: true */
/*jshint camelcase: false */

/**
 * @name polymerDirective
 * @description
 * The 'polymerDirective' directive is used to wait for
 * polymer components to be available for compilation
 * by AngularJS.
*/
angular.module('jea.directives.polymerDirective', [])
  .directive('polymerDirective', ['$timeout', '$window', '$compile', '$animate',
    polymerDirective]);

function polymerDirective ($timeout, $window, $compile) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true,
    controller: function () {
      this.waiting = false;
    },
    controllerAs: 'ctrl',
    compile: compile
  };

  function compile() {
    return {
      pre: preLink
    };
  }

  function recompile(scope, element) {
    $compile(element.contents())(scope);
  }

  function preLink(scope, element, attr, ctrl) {
    ctrl.waiting = true;
    document.addEventListener('WebComponentsReady', function() {
      recompile(scope, element);
      ctrl.waiting = false;
    });

    $timeout(function() {
      if(ctrl.waiting) {
        ctrl.waiting = false;
        recompile(scope, element);
      }
    }, 1000); // enough time for the WebComponentsReady event to be launched
  }
}
