'use strict';

angular.module('JesusEspejoACVControllers', ['pascalprecht.translate'])
    .controller('ExperienceCtrl', ['$scope', '$window', 'SharedData', '$translate', '$parse',
        function(sc, window, SharedData, translate) {

            var employments = sc.employments =
                SharedData.getSharedDataResource().query(function() {
                    sc.employersDates =
                        SharedData.getEmployersPeriods(employments);
                  });

            sc.buttonContainerClass = '';

            // moving to main-left directive controller
            /*
            var NO_FOCUS_SEARCH = 0;

            sc.sectionTitleWrapperVisible = 'true';
            sc.activateSearchButton = true;
            sc.searchButtonInputFocus = 'false';

            sc.hideAndExpand = function(mode) {
                if (window.innerWidth <= 480) {
                  if (sc.activateSearchButton) {
                    sc.activateSearchButton = false;
                    if (mode === NO_FOCUS_SEARCH) {
                      sc.sectionTitleWrapperVisible = 'true';
                    } else {
                      sc.sectionTitleWrapperVisible = 'false';
                      sc.searchButtonInputFocus = 'true';
                    }
                  }
                }
              };

            */

            sc.collapseScrollTop = 0;
          }
          ])
    .controller('ExperienceDetailCtrl', ['$scope', '$routeParams', 'SharedData',
        function($scope, $routeParams, SharedData) {
            var allExperiences = SharedData.getSharedData()
                .query(function() {
                    $scope.experience =
                        SharedData.filterJSON(allExperiences, 'start',
                            $routeParams.start)[0];
                  });
          }
    ]);
