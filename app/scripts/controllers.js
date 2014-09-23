'use strict';

angular.module('JesusEspejoACVControllers', ['pascalprecht.translate'])
    .controller('ExperienceCtrl', ['$scope', '$window', 'SharedData', '$translate', '$parse',
        function(sc, window, SharedData) {

            var employments = sc.employments =
                SharedData.getEmploymentsResource().query(function() {
                    sc.employersDates =
                        SharedData.getEmployersPeriods(employments);
                  });

            sc.buttonContainerClass = '';

            sc.rawTitle = 'EXPERIENCE';
            sc.rawSubtitle = 'WHERE_I_WORKED';

            sc.collapseScrollTop = 0;

            sc.noFoundLinkText = 'PERSONAL_PROJECTS';
            sc.myText = 'MY_PLUR';
            sc.noFoundLink = '#/projects';
          }
          ])
    .controller('ProjectsCtrl', ['$scope', '$window', 'SharedData', '$translate', '$parse',
        function(sc, window, SharedData) {

            var projects = sc.employments =
                SharedData.getProjectsResource().query(function() {
                    sc.employersDates =
                        SharedData.getEmployersPeriods(projects);
                  });

            sc.buttonContainerClass = '';

            sc.rawTitle = 'PERSONAL_PROJECTS';
            sc.rawSubtitle = 'FOR_THE_LOVE_OF_ART';

            sc.collapseScrollTop = 0;

            sc.noFoundLinkText = 'EXPERIENCE';
            sc.myText = 'MY_SING';
            sc.noFoundLink = '#/experience';
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
