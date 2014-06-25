/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('PanelCollapseButtonDirective', [])
.directive('jeaCollapseButton', function() {

  function makeSticky(jElement, jParent) {
    jElement.stick_in_parent({
        offset_top: 50,
        parent: jParent,
      });
  }

  return {
    restrict: 'A',
    link: function(scope, elem) {

      var jPanel = $(elem[0].parentElement.parentElement);
      var panelHeader = jPanel.children().first();
      jPanel.on('shown.bs.collapse', function () {
          makeSticky(panelHeader, jPanel);
          $(document.body).trigger('sticky_kit:recalc');
        });
      jPanel.on('hidden.bs.collapse', function () {
          $(document.body).trigger('sticky_kit:recalc');
          panelHeader.trigger('sticky_kit:detach');
        });
    }
  };
});
