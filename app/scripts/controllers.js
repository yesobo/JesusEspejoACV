/*global angular, skrollr: false */
angular.module('JesusEspejoACVControllers', ['oc.lazyLoad'])
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
.controller('RestartSkrollrCtrl', ['$timeout', restartSkrollrCtrl])
.controller('DestroySkrollrCtrl', [destroySkrollr])
.controller('ExperienceCtrl',
['$scope', '$window', 'SharedData', 'DatesDiff', '$ocLazyLoad', '$timeout',
function(sc, window, SharedData, DatesDiff, $ocLazyLoad) {
  'use strict';

  $ocLazyLoad.load([{
    files: ['scripts/xhr/my-sticky-kit.js']
  }]);

  var employments = sc.employments =
  SharedData.getEmploymentsResource().query(function() {
    var employersDates = sc.employersDates =
    SharedData.getGroupedPeriods(employments, 'employerName');

    sc.employersDateDiffMap =
      DatesDiff.createDateDiffMap(employersDates, 'employerName');

    sc.employmentsDateDiffMap =
      DatesDiff.createDateDiffMap(employments, 'locator');
  });

  sc.buttonContainerClass = '';

  sc.rawTitle = 'EXPERIENCE';
  sc.rawSubtitle = 'WHERE_I_WORKED';

  sc.collapseScrollTop = 0;

  sc.notFoundLinkText = 'PERSONAL_PROJECTS';
  sc.myText = 'MY_PLUR';
  sc.notFoundRequestedMenu = 'PROJECTS';

  sc.openDialog = function(dialogId) {
    document.querySelector('[dialog-id=' + dialogId + ']').open();
  };

  destroySkrollr();
}
])
.controller('ProjectsCtrl', ['$scope', '$window', 'SharedData', 'DatesDiff',
'$ocLazyLoad', '$timeout', function(sc, window, SharedData, DatesDiff, $ocLazyLoad) {
  'use strict';

  $ocLazyLoad.load([{
    files: ['scripts/xhr/my-sticky-kit.js']
  }]);
  var projects = sc.employments =
  SharedData.getProjectsResource().query(function() {
    var employersDates = sc.employersDates =
    SharedData.getGroupedPeriods(projects);

    sc.employersDateDiffMap =
      DatesDiff.createDateDiffMap(employersDates, 'employerName');

    sc.employmentsDateDiffMap =
      DatesDiff.createDateDiffMap(projects, 'locator');

  });

  sc.buttonContainerClass = '';

  sc.rawTitle = 'PERSONAL_PROJECTS';
  sc.rawSubtitle = 'FOR_THE_LOVE_OF_ART';

  sc.collapseScrollTop = '';

  sc.notFoundLinkText = 'EXPERIENCE';
  sc.myText = 'MY_SING';
  sc.notFoundRequestedMenu = 'EXPERIENCE';

  sc.openDialog = function(dialogId) {
    document.querySelector('[dialog-id=' + dialogId + ']').open();
  };

  destroySkrollr();
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

function restartSkrollrCtrl(timeout) {
  'use strict';
  timeout(function() {
    var s = skrollr.init();
    s.refresh();
  }, 0);
}

function destroySkrollr() {
  'use strict';
  var s = skrollr.init();
  s.destroy();
}
