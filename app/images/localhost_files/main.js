'use strict';

angular.module('JesusEspejoACVApp')
  .controller('ExperienceCtrl',
    ['$scope', 'SharedData',
    function (sc, SharedData) {
      
      var employments = sc.employments =
        SharedData.getSharedData().query(function() {
        sc.employersDates =
          SharedData.getEmployersLastDate(employments);
      });

      sc.expanded = false;
      sc.hideAndExpand = function(selector, caller) {
        if(!sc.expanded) {
          $(selector).toggle('15');
          sc.expanded = true;

          $(caller).addClass('mobSearchMode');
          var nextSiblingSelector = caller + ' > span';
          $(nextSiblingSelector).addClass('mobSearchMode');
          nextSiblingSelector = caller + ' > input';
          $(nextSiblingSelector).addClass('mobSearchMode');
        }
      }

    }])
  .controller('ExperienceDetailCtrl',
    ['$scope', '$routeParams', 'SharedData',
    function ($scope, $routeParams, SharedData) {
      var allExperiences = SharedData.getSharedData()
        .query( function() {
        $scope.experience =
            SharedData.filterJSON(allExperiences, 'start', $routeParams.start)[0];
      });
    }]);
