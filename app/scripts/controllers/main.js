'use strict';

angular.module('JesusEspejoACVApp')
  .controller('ExperienceCtrl',
    ['$scope', 'SharedData',
    function (sc, SharedData) {
      
      var NO_FOCUS_SEARCH = 0;

      var employments = sc.employments =
        SharedData.getSharedData().query(function() {
        sc.employersDates =
          SharedData.getEmployersLastDate(employments);
      });

      sc.activateSearchButton = true;
      sc.hideAndExpand = function(mode) {
        if($(window).width() <= 480 ) {
          if(sc.activateSearchButton) {
            sc.activateSearchButton = false;
            $('.searchButtonContainer').toggleClass('mobSearchMode', 'slow', 'linear');
            if(mode === NO_FOCUS_SEARCH) {
              $('.sectionTitleWrapper').toggle();
            } else {
              $('.sectionTitleWrapper').toggle(1, function() {
                $('.searchButtonContainer > input').focus();
              });
            }
          }
        }
      }

      sc.exitSearchMode = function() {
        if($(window).width() <= 480 ) {
          if(!sc.query || sc.query === "") {
            sc.activateSearchButton = true;
            sc.hideAndExpand(NO_FOCUS_SEARCH);
            sc.activateSearchButton = true;
          }
        }
      }

      sc.translateUses = function() {
        return 'en';
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
