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
            console.log('1');
            sc.activateSearchButton = false;
            if(mode === NO_FOCUS_SEARCH) {
              console.log('2.1');
              sc.sectionTitleWrapperVisible = 'true';
            } else {
              console.log('2.2');
              sc.sectionTitleWrapperVisible = 'false';
              sc.searchButtonInputFocus = 'true';
            }
          }
        }
      }

      sc.exitSearchMode = function() {
        if(window.innerWidth <= 480 ) {
          if(!sc.query || sc.query === "") {
            sc.sectionTitleWrapperVisible = 'true';
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
