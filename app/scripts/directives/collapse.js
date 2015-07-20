/* global document, angular, $*/
/*eslint-env jquery */
/* jshint camelcase: false */

/**
 * @ngdoc directive
 * @name jeaStickCollapseHeader
 *
 * @description
 * The 'jeaStickCollapseHeader' directive is used to make the header of the
 * collapsed element sticky throughout its parent when the collapsed element
 * is opened.
 *
 * @param {string} jea-stick-collapse-header Sibling header selector.
 * If not provided, the directive uses the first of its siblings.
 * @param {string} jea-collapse-start Name of the event launched when the
 * collapse animation starts. Default value is "transitionend"
 * @param {string} jea-collapse-end Name of the event launched when the
 * collapse animation end. Default value is "opened-changed".
 * The event must have the detail.value property.
 *
*/
angular
  .module('jea.directives.stickCollapseHeader', [])
  .directive('jeaStickCollapseHeader', [jeaStickCollapseHeader]);

function jeaStickCollapseHeader() {
  'use strict';

  return {
    restrict: 'A',
    link: linkFunc
  };

  function linkFunc(scope, elem, attrs) {

    var COLLAPSE_END_EVENT = 'transitionend';
    var COLLAPSE_INIT_EVENT = 'opened-changed';

    var collapseEndEvent = COLLAPSE_END_EVENT;
    var collapseInitEvent = COLLAPSE_INIT_EVENT;

    var stickyZone = elem[0].parentElement;
    var jStickyHeader;
    if(attrs.jeaStickCollapseHeader) {
      jStickyHeader = $(stickyZone.querySelector(attrs.jeaStickCollapseHeader));
    } else {
      jStickyHeader = $(stickyZone.children[0]);
    }
    var collapsePanel = elem[0];
    var scrollBackNeeded = false;

    elem.bind(collapseEndEvent, function() {
      collapseEndListener(scrollBackNeeded, collapsePanel.opened);
    });

    elem.bind(collapseInitEvent, function(event) {
      if(jStickyHeader.css('position') === 'fixed') {
        scrollBackNeeded = true;
        jStickyHeader.css({position: 'fixed', top: '-50px'});
      } else {
        scrollBackNeeded = false;
      }
      if(!event.detail.value) {
        unbindSticky(jStickyHeader);
      }
    });

    var collapseEndListener = function(scrollNeeded, isOpened) {
      if(isOpened) {
        openedCallBack(scope, jStickyHeader, stickyZone);
      } else {
        closedCallback(scope, jStickyHeader, stickyZone, scrollNeeded);
      }
    };
  }

  function openedCallBack(scope, jStickyHeader, stickyZone) {
    makeSticky(jStickyHeader, stickyZone, scope);
    $(document.body).trigger('sticky_kit:recalc');
  }

  function closedCallback(scope, jStickyHeader, stickyZone, scrollBackNeeded) {
    var intScrollTo = $(stickyZone).offset().top - jStickyHeader.height();
    if(scrollBackNeeded) {
      // Webkit and Firefox selector
      $('body,html').animate({scrollTop: intScrollTo}, 500, function() {
        scope.$apply(function() {
          $(document.body).trigger('sticky_kit:recalc');
        });
      });
    } else {
      $(document.body).trigger('sticky_kit:recalc');
    }
  }

  function makeSticky(jElement, jParent) {
    /*eslint-disable*/
    jElement.stick_in_parent({
      offset_top: 50,
      parent: jParent
    });
    /*eslint-enable*/
  }

  function unbindSticky(jElement) {
    jElement.trigger('sticky_kit:detach');
  }

}
