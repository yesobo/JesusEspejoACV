/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('JeaCollapseButtonDirective', [])
    .directive('jeaCollapseButton', [function() {

      return {
          restrict: 'A',
          link: function(scope, elem) {
            scope.collapsePanel = function(panelId) {
              $(elem).toggleClass('collapsed').promise().done(function() {
                document.querySelector('#' + panelId).toggle();
              });
            };
          }
        };
    }]);
