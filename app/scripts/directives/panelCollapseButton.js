/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('PanelCollapseButtonDirective', [])
    .directive('jeaCollapseButton', function() {

        function makeSticky(jElement, jParent, scope) {
            jElement.stick_in_parent({
                offset_top: 50,
                parent: jParent,
              }).on('sticky_kit:stick', function() {
                scope.collapseScrollTop = $(document).scrollTop();
              }).on('sticky_kit:unstick', function() {
              });
          }

        function unbindSticky(jElement) {
            jElement.off('sticky_kit:stick').off('sticky_kit:unstick');
          }

        return {
            restrict: 'A',
            link: function(scope, elem) {
                var jPanel = $(elem[0].parentElement.parentElement);
                var stickyZone = jPanel.children('.stickyZone');
                var panelHeader = stickyZone.children('.panel-heading');
                jPanel.on('shown.bs.collapse', function() {
                    makeSticky(panelHeader, stickyZone, scope);
                    $(document.body).trigger('sticky_kit:recalc');
                  });
                jPanel.on('hide.bs.collapse', function() {
                  unbindSticky(panelHeader);
                  if(scope.collapseScrollTop !== 0) {
                    var intScrollTo = scope.collapseScrollTop - 20;
                    $('html, body').animate({scrollTop: intScrollTo}, 500);
                  }
                });
                jPanel.on('hidden.bs.collapse', function() {
                    $(document.body).trigger('sticky_kit:recalc');
                    // commented because of sticky-kit issue #23
                    //panelHeader.trigger('sticky_kit:detach');
                  });
              }
          };
      });
