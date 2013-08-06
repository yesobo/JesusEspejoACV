'use strict';

angular.module('JesusEspejoACVApp')
  .controller('ExperienceCtrl',
    ['$scope', 'SharedData',
    function ($scope, SharedData) {
    $scope.employments = SharedData.getSharedData().query();
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
      $scope.showTaskDetails = function(task){
        alert('no details available for ' + task.description);
      }
  }]);
