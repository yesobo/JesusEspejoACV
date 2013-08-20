'use strict';

angular.module('JesusEspejoACVApp')
  .controller('ExperienceCtrl',
    ['$scope', 'SharedData',
    function ($scope, SharedData) {
      var employments = $scope.employments = SharedData.getSharedData().query(function() {
        $scope.employersDates = SharedData.getEmployersLastDate(employments);
      });
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
