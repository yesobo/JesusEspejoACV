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

      sc.activateSearchButton = true;
      sc.hideAndExpand = function() {
        if(sc.activateSearchButton) {
          $('.sectionTitleWrapper').toggle('15');
          $('.searchButtonContainer').toggleClass('mobSearchMode');
          sc.activateSearchButton = false;
        }
      }

      sc.exitSearchMode = function() {
        sc.activateSearchButton = true;
        sc.hideAndExpand();
        sc.activateSearchButton = true;
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
