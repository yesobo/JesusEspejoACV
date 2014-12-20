
'use strict';

angular.module('ExperienceDetailsDirective', ['pascalprecht.translate'])
.directive('experienceDetails', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/templates/experienceDetails.html',
    //replace: true,
    //transclude: true,
    scope: {
      detailsObjAttr: '=detailsObj'
    },
    link: function() {
    }
  };
});
