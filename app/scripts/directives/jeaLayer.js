/* global $ : false */
angular.module('JeaLayerDirective', [])
.directive('jeaLayer', function() {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, elem) {
      elem.bind('core-overlay-open', function(e) {
        if(e.target.opened) {
          $('body').addClass('hideScroll');
        } else {
          $('body').removeClass('hideScroll');
        }
      });
    }
  };
});
