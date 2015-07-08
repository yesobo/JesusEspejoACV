
'use strict';

angular.module('ExperienceDetailsDirective', ['pascalprecht.translate'])
.directive('experienceDetails', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/templates/experienceDetails.html',
    //template: '<div><ul class="tasksList"><li ng-repeat="task in detailsObjAttr.tasks" class="liTask"><span class="taskDescription"><div>{{ detailsObjAttr.locator + ".tasks." + $index + ".description" | translate }}</div></span><ul class="techList"><li ng-repeat="tech in task.techs"><div class="imageWrapper"><img ng-src="images/{{tech.image}}" alt="{{tech.name}}" title="{{tech.name}}"></img></div></li></ul></li></ul></div>',
    //replace: true,
    //transclude: true,
    scope: {
      detailsObjAttr: '=detailsObj'
    },
    link: function() {
    }
  };
});
