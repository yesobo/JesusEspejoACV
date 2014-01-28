'use strict';

angular.module('JesusEspejoACVControllers', [])
  .controller('ExperienceCtrl',
    ['$scope', '$window', 'SharedData',
    function (sc, window, SharedData) {
      
      var NO_FOCUS_SEARCH = 0;

      var employments = sc.employments =
        SharedData.getSharedData().query(function() {
        sc.employersDates =
          SharedData.getEmployersLastDate(employments);
      });

      sc.activateSearchButton = true;

      sc.buttonContainerClass = '';
      sc.sectionTitleWrapperVisible = 'true';
      sc.searchButtonInputFocus = 'false'; 

      sc.hideAndExpand = function(mode) {
        if(window.innerWidth <= 480 ) {
          if(sc.activateSearchButton) {
            sc.activateSearchButton = false;
            if(mode === NO_FOCUS_SEARCH) {
              sc.sectionTitleWrapperVisible = 'true';
            } else {
              sc.sectionTitleWrapperVisible = 'false';
              sc.searchButtonInputFocus = 'true';
            }
          }
        }
      }

      sc.exitSearchMode = function() {
        if(window.innerWidth <= 480 ) {
          if(!sc.query || sc.query === "") {
            sc.activateSearchButton = true;
            sc.hideAndExpand(NO_FOCUS_SEARCH);
            sc.activateSearchButton = true;
          }
        }
      }
    }])
  .controller('ExperienceDetailCtrl',
    ['$scope', '$routeParams', 'SharedData',
    function ($scope, $routeParams, SharedData) {
      var allExperiences = SharedData.getSharedData()
        .query( function() {
        $scope.experience =
            SharedData.filterJSON(allExperiences, 'start', 
              $routeParams.start)[0];
      });
    }]);
