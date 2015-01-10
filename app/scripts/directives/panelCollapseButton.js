/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('JeaCollapseButtonDirective', [])
    .directive('jeaCollapseButton', [function() {

      return {
          restrict: 'E',
          transclude: true,
          template: '<a class="collapsed"><ng-transclude</ng-transclude></a>',
          link: function(scope, elem, attr) {
            var panelid = attr.panelid;
            console.log(panelid);
            var collapsePanel = function(panelid) {
              $(elem).find('a').toggleClass('collapsed').promise().done(function() {
                document.querySelector('#' + panelid).toggle();
              });
            };
            if(panelid != "") {
              elem.on('click', function() {
                collapsePanel(panelid);
              });
            }
          }
        };
    }]);
