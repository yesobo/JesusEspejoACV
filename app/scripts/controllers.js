/*global angular: false */
angular.module('JesusEspejoACVControllers', [])
.controller('AppCtrl', ['$scope', function(sc) {
  'use strict';

  sc.clickMenu = {
    // exposed by navmenu directive for changing menu
  };
  sc.menuItems = {
    // exposed by navmenu directive to get info about menu
  };
}
])
.controller('ExperienceCtrl',
['$scope', '$window', 'SharedData', 'DatesDiff',
function(sc, window, SharedData, DatesDiff) {
  'use strict';

  function createDateDiffMap(startEndCollection, key) {
    var result = {};
    var loopDiffObject, loopYearsLabel, loopMonthsLabel, resultKey, startEndObj;
    for(var startEndKey in startEndCollection) {
      startEndObj = startEndCollection[startEndKey];
      loopDiffObject =
        DatesDiff.getYearsMonthsDiff([startEndObj.start, startEndObj.end]);

      loopYearsLabel = DatesDiff.getYearsLabel(loopDiffObject.years);
      loopMonthsLabel = DatesDiff.getMonthsLabel(loopDiffObject.months);
      if(loopDiffObject.years === 0) {
        loopDiffObject.years = '';
      }
      if(loopDiffObject.months === 0) {
        loopDiffObject.months = '';
      }

      resultKey = startEndObj[key];

      result[resultKey] = {
        years: loopDiffObject.years,
        yearLabel: loopYearsLabel,
        months: loopDiffObject.months,
        monthLabel: loopMonthsLabel
      };
    }

    return result;
  }

  var employments = sc.employments =
  SharedData.getEmploymentsResource().query(function() {
    var employersDates = sc.employersDates =
    SharedData.getEmployersPeriods(employments);

    sc.employersDateDiffMap =
      createDateDiffMap(employersDates, 'employerName');

    sc.employmentsDateDiffMap =
      createDateDiffMap(employments, 'locator');
  });

  sc.buttonContainerClass = '';

  sc.rawTitle = 'EXPERIENCE';
  sc.rawSubtitle = 'WHERE_I_WORKED';

  sc.collapseScrollTop = 0;

  sc.notFoundLinkText = 'PERSONAL_PROJECTS';
  sc.myText = 'MY_PLUR';
  sc.notFoundRequestedMenu = 'PROJECTS';
}
])
.controller('ProjectsCtrl', ['$scope', '$window', 'SharedData',
function(sc, window, SharedData) {
  'use strict';
  var projects = sc.employments =
  SharedData.getProjectsResource().query(function() {
    sc.employersDates =
    SharedData.getEmployersPeriods(projects);
  });

  sc.buttonContainerClass = '';

  sc.rawTitle = 'PERSONAL_PROJECTS';
  sc.rawSubtitle = 'FOR_THE_LOVE_OF_ART';

  sc.collapseScrollTop = '';

  sc.notFoundLinkText = 'EXPERIENCE';
  sc.myText = 'MY_SING';
  sc.notFoundRequestedMenu = 'EXPERIENCE';
}
])
.controller('ExperienceDetailCtrl', ['$scope', '$routeParams', 'SharedData',
function($scope, $routeParams, SharedData) {
  'use strict';
  var allExperiences = SharedData.getSharedData()
  .query(function() {
    $scope.experience =
    SharedData.filterJSON(allExperiences, 'start',
    $routeParams.start)[0];
  });
}
]);
