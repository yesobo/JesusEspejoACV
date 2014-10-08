/*gloabl angular: false */
angular.module('JesusEspejoACVControllers',
['pascalprecht.translate'])
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
['$scope', '$window', 'SharedData', '$translate', '$parse',
function(sc, window, SharedData) {
  'use strict';
  var employments = sc.employments =
  SharedData.getEmploymentsResource().query(function() {
    sc.employersDates =
    SharedData.getEmployersPeriods(employments);
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
.controller('ProjectsCtrl', ['$scope', '$window', 'SharedData', '$translate', '$parse',
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
