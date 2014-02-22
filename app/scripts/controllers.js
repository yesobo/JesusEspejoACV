'use strict';

angular.module('JesusEspejoACVControllers', ['pascalprecht.translate'])
  .controller('ExperienceCtrl',
    ['$scope', '$window', 'SharedData', '$translate',
    function (sc, window, SharedData, translate) {
      
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

      sc.searchButtonPlaceholder = translate('SEARCH');

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
