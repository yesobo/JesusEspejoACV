/*global $:false */
'use strict';

angular.module('ExperienceDetailsDirective', [])
.directive('experienceDetails', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/templates/experienceDetails.html',
    //replace: true,
    transclude: true,
    scope: {
      detailsObjAttr: '=detailsObj'
    },
    link: function(scope, element, attrs) {
    }
  };
});