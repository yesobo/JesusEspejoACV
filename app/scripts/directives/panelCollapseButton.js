/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('PanelCollapseButtonDirective', [])
    .directive('jeaCollapseButton', ['$q', function($q) {

        function makeSticky(jElement, jParent) {
            jElement.stick_in_parent({
                offset_top: 50,
                parent: jParent,
              });
          }

        function unbindSticky(jElement) {
            jElement.trigger('sticky_kit:detach');
          }

        return {
            restrict: 'A',
            link: function(scope, elem) {
                var deferred = $q.defer();
                var jPanel = $(elem[0].parentElement.parentElement.parentElement);
                var stickyZone = jPanel.children('.stickyZone');
                var panelHeader = stickyZone.children('.panel-heading');
                jPanel.on('shown.bs.collapse', function() {
                    makeSticky(panelHeader, stickyZone, scope);
                    $(document.body).trigger('sticky_kit:recalc');
                  });
                jPanel.on('hide.bs.collapse', function() {
                  $(document.body).trigger('sticky_kit:recalc');
                  unbindSticky(panelHeader);
                  var intScrollTo = stickyZone.offset().top - panelHeader.height();
                  $('body').animate({scrollTop: intScrollTo}, 500, function() {
                    scope.$apply(function() {
                      deferred.resolve('readyToRecalc');
                    });
                  });
                });
              }
          };
      }]);
