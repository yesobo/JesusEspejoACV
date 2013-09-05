'use strict';

angular.module('JesusEspejoACVApp')
  .controller('ExperienceCtrl',
    ['$scope', 'SharedData',
    function (sc, SharedData) {
      
      sc.showTitle = true;

      var hideFunc = function(selector) {
        console.log(selector);
        $(selector).toggle();
      }
      
      sc.hide = hideFunc;

      var employments = sc.employments =
        SharedData.getSharedData().query(function() {
        sc.employersDates =
          SharedData.getEmployersLastDate(employments);
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
