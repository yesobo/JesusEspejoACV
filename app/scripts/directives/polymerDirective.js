/* global $ */
/*jshint camelcase: false */
'use strict';

/**
 * @name polymerDirective
 * @description
 * The 'polymerDirective' directive is used to wait for
 * polymer components to be available for compilation
 * by AngularJS.
*/
angular.module('PolymerDirectiveDirective', [])
  .directive('polymerDirective', ['$timeout', '$window', '$compile', '$animate', '$interval',
    function($timeout, $window, $compile, $animate, $interval) {

      return {
          restrict: 'A',
          terminal: true,
          controller: function () {
            this.waiting = false;
          },
          controllerAs: 'ctrl',
          compile: _compile
      };

      function _compile(tElem, tAttr) {
        return {
          pre: _preLink,
          post: _postLink
        }
      }

      function _recompile(scope, element) {
        $compile(element.contents())(scope);
      }

      function _preLink(scope, element, attr, ctrl) {
        ctrl.waiting = true;
        document.addEventListener('WebComponentsReady', function(e) {
          _recompile(scope, element);
          ctrl.waiting = false;
        });

        $timeout(function() {
          if(ctrl.waiting) {
            ctrl.waiting = false;
            _recompile(scope, element);
          }
        }, 1000); // enough time for the WebComponentsReady event to be launched

      }

      function _postLink(scope, element, attr, ctrl, transclude) {
        var block, childScope, previousElements;

        if(ctrl.waiting) {
          if (previousElements) {
            previousElements.remove();
            previousElements = null;
          }
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }
          if (block) {
            previousElements = getBlockNodes(block.clone);
            $animate.leave(previousElements).then(function() {
              previousElements = null;
            });
            block = null;
          }
        } else {
          if (!childScope) {
            transclude(function(clone, newScope) {
              childScope = newScope;
              clone[clone.length++] = document.createComment(' end defer-compile: ');
              block = {
                clone: clone
              };
              $animate.enter(clone, element.parent(), element);
            });
          }
        }
      }

      function _not_compile(tElem, tAttr) {
        return;
      }

    }]);
