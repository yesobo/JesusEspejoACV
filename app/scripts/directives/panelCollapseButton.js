/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('PanelCollapseButtonDirective', [])
    .directive('jeaCollapseButton', ['$q', function($q) {

        function makeSticky(jElement, jParent) {
            jElement.stick_in_parent({
                offset_top: 50,
                parent: jParent,
              }).on('sticky_kit:stick', function() {
              }).on('sticky_kit:unstick', function() {
              });
          }

        function unbindSticky(jElement) {
            //jElement.off('sticky_kit:stick');
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
                  var intScrollTo = stickyZone.offset().top - panelHeader.height();
                  $('body').animate({scrollTop: intScrollTo}, 500, function() {
                    scope.$apply(function() {
                      deferred.resolve('readyToRecalc');
                    });
                  });
                });
                jPanel.on('hidden.bs.collapse', function() {
                    deferred.promise.then(function() {
                      $(document.body).trigger('sticky_kit:recalc');
                      unbindSticky(panelHeader);
                    });
                    // commented because of sticky-kit issue #23
                    //panelHeader.trigger('sticky_kit:detach');
                  });
              }
          };
      }]);
