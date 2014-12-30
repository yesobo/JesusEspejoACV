/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('JeaCollapseDirective', [])
.directive('jeaCollapse', [function() {

  function makeSticky(jElement, jParent) {
    jElement.stick_in_parent({
      offset_top: 50,
      parent: jParent,
    });
  }

  function unbindSticky(jElement) {
    jElement.trigger('sticky_kit:detach');
  }

  function openedCallBack(scope, panelHeader, stickyZone) {
    makeSticky(panelHeader, stickyZone, scope);
    $(document.body).trigger('sticky_kit:recalc');
  }

  function closedCallback(scope, panelHeader, stickyZone, scrollBackNeeded) {
    unbindSticky(panelHeader);
    var intScrollTo = $(stickyZone).offset().top - panelHeader.height();
    if(scrollBackNeeded) {
      $('body').animate({scrollTop: intScrollTo}, 500, function() {
        scope.$apply(function() {
          $(document.body).trigger('sticky_kit:recalc');
        });
      });
    } else {
      $(document.body).trigger('sticky_kit:recalc');
    }
  }

  return {
    restrict: 'A',
    link: function(scope, elem) {
      var stickyZone = elem[0].parentElement;
      var panelHeader = $(stickyZone.children[0]);
      var collapsePanel = elem[0];
      var scrollBackNeeded = false;

      var collapseListener = function(scrollBackNeeded) {
        if(collapsePanel.opened) {
          openedCallBack(scope, panelHeader, stickyZone);
        } else {
          closedCallback(scope, panelHeader, stickyZone, scrollBackNeeded);
        }
      };

      elem[0].addEventListener('core-collapse-open', function() {
        if(panelHeader.css('position') === 'fixed') {
          scrollBackNeeded = true;
          panelHeader.css({position: 'fixed', top: '-50px'});
        } else {
          scrollBackNeeded = false;
        }
      });
      elem[0].addEventListener('core-resize', function() {
        collapseListener(scrollBackNeeded);
      });
    }
  };
}]);
