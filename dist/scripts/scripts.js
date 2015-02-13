'use strict';

angular.module('JesusEspejoACVApp',
  ['ngRoute', 'JesusEspejoACVServices', 'JesusEspejoACVDirectives',
    'JesusEspejoACVControllers', 'JesusEspejoACVFilters',
    'pascalprecht.translate', 'ng-polymer-elements'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/aboutme.html',
      })
      .when('/experience', {
        templateUrl: 'views/experience.html',
        controller: 'ExperienceCtrl'
      })
      .when('/experience/:start', {
        templateUrl: 'views/experience-detail.html',
        controller: 'ExperienceDetailCtrl'
      })
      .when('/projects', {
        templateUrl: 'views/experience.html',
        controller: 'ProjectsCtrl'
      })
      .when('/blog', {
        templateUrl: 'views/blog.html'
        //controller: 'ProjectsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('test', {
      /* Nav menu */
      'WHO_I_AM': 'Quien soy',
      'ABOUT_ME': 'Sobre mí',
      'TECHNICAL_SKILLS': 'Tecnologías',
      'EXPERTISE': 'Tecnologías',
      'EXPERIENCE': 'Experiencia',
      'EDUCATION': 'Educación',
      'TRAINING': 'Cursos',

      /* About me */
      'ABOUT_ME_EXPL': 'Perfil profesional e Información de Contacto',
      'ABOUT_ME_P1': 'Hola, soy Jesús, desarrollador web y amante de las nuevas tecnologías.',
      'ABOUT_ME_P2': 'Como verás, he dedicado los últimos años en crear sitios web y disfrutar de las tecnologías web en el trabajo y mi tiempo libre. Me encantaría compartir mis conocimientos contigo, así que no dudes en contactar conmigo si estás interesado.',

      /* Experience */
      'AT': 'en',
      'PRESENT': 'Hoy',
      'YEAR': 'año',
      'YEARS': 'años',
      'MONTH': 'mes',
      'MONTHS': 'meses',
      'SEARCH': 'buscar'
    });

    $translateProvider.useStaticFilesLoader({
      prefix: '/data/position_',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');
  }]);

'use strict';

angular.module('JesusEspejoACVServices', ['ng', 'ngResource'])
.factory('SharedData', ['$resource', function ($resource) {

    function searchObject(collection, firstLevelKey, value) {
      var foundObject = null;
      for (var i = 0, len = collection.length; i < len; i++) {
        if(collection[i][firstLevelKey] === value) {
          foundObject = collection[i];
          break;
        }
      }
      return foundObject;
    }

    /**
     * Returns the JSON objects of the provided Array that matches the key: value
     *   pair given as parameters
     * @param {Array} obj - Array to be filtered.
     * @param {String} key - Propery to be filtered by.
     * @param {String} val - Value of the property that matches the resulting
     *   collection elements.
     * @returns {Array}
     */
    function _filterJSON(obj, key, val) {
      var objects = [];
      for (var i in obj) {
        if (obj[i][key] === val) {
          objects.push(obj[i]);
        }
      }
      return objects;
    }

    /**
    * Groups related by a given key events from a given collection of events,
    *   returning a collection of event objects that represents the period of
    *   time where these related events took place.
    * @param {json} eventsCollection - collection of event objects with 'start'
    *   , 'end' and 'employer' properties.
    * @param {String} relationKey - the key wich event objects are related by.
    * @returns {json} periodObject that represents the period during related
    *  events took place.
    *  {
    *    employerName: "name",
    *    webSite: "website",
    *    imageUrl: "url",
    *    start: "2010-04-01T00:00:00",
    *    end: "2011-02-12T00:00:00"
    *  }
    */
    function _groupEvents(eventsCollection) {
      var resultArray = [];
      var auxObject;
      var minStartMaxEnd = {};
      var newEventsGroup = {};
      for (var i = 0; i < eventsCollection.length; i++) {
        auxObject = eventsCollection[i];
        // If i've already created the events group I check the max and min dates
        minStartMaxEnd = searchObject(resultArray, 'employerName',
          auxObject.employer.name);
        if( minStartMaxEnd ){
          if(minStartMaxEnd.start > auxObject.start) {
            minStartMaxEnd.start = auxObject.start;
          }
          if(minStartMaxEnd.end < auxObject.end) {
            minStartMaxEnd.end = auxObject.end;
          }
        } else {
          newEventsGroup = {
              employerName: auxObject.employer.name,
              webSite: auxObject.employer.webSite,
              imageUrl: auxObject.employer.imageUrl,
              start: auxObject.start,
              end: auxObject.end
            };
          resultArray.push(newEventsGroup);
        }
      }
      return resultArray;
    }

    return {
      getEmploymentsResource: function() {
        var actions = {
          'query': {
            method: 'GET',
            isArray: true
          }
        };
        return $resource('data/employment.json', {},
          actions);
      },
      getProjectsResource: function() {
        var actions = {
          'query': {
            method: 'GET',
            isArray: true
          }
        };
        return $resource('data/projects.json', {},
          actions);
      },
      filterJSON: _filterJSON,
      getGroupedPeriods: _groupEvents
    };
  }])
  .factory('DatesDiff', [function() {

    var getMonthsDiff = function(datesObj) {
      var dStart = new Date(datesObj[0]);
      var dEnd;
      if(datesObj[1] === '') {
        dEnd = new Date();
      } else {
        dEnd = new Date(datesObj[1]);
      }
      var monthDiff = (dEnd.getFullYear() -
        dStart.getFullYear()) * 12 + dEnd.getMonth() - dStart.getMonth();

      return monthDiff;
    };

    var getYearsMonthsDiff = function(datesObj) {
      var result = {};

      result.years = '';
      result.months = '';

      var monthDiff = getMonthsDiff(datesObj);
      var years = Math.floor(monthDiff / 12);
      var months = monthDiff % 12;
      result.years = years;
      result.months = months;

      return result;
    };

    var getYearsLabel = function(years) {
      var result = '';
      if ( years > 0 ) {
        if ( years > 1) {
          result = 'YEARS';
        } else {
          result = 'YEAR';
        }
      }
      return result;
    };

    var getMonthsLabel = function(months) {
      var result = '';
      if ( months > 0 ) {
        if (months > 1) {
          result = 'MONTHS';
        } else {
          result = 'MONTH';
        }
      }
      return result;
    };

    /**
     * Returns an map of entries whose keys are a common property of the objects
     *  included in the provided array, and whose values are objects that represents
     *  the time between start and end dates of these objects, expressed with
     *  month(s) and year(s)
     * @param {Array} startEndCollection - Array of objects with 'start' and 'end'
     *   properties.
     * @param {String} key - object property used as the key of the map entry.
     * @result {Object}
     *    {
     *      "key": {
     *        "monthLabel": "MONTH",
     *        "months": 3,
     *        "yearLabel": "YEARS",
     *        "years": 3
     *      }
     *    }
     */
    var createDateDiffMap = function(startEndCollection, key) {
      var result = {};
      var loopDiffObject, loopYearsLabel, loopMonthsLabel, resultKey, startEndObj;
      for(var startEndKey in startEndCollection) {
        startEndObj = startEndCollection[startEndKey];
        loopDiffObject =
          getYearsMonthsDiff([startEndObj.start, startEndObj.end]);

        loopYearsLabel = getYearsLabel(loopDiffObject.years);
        loopMonthsLabel = getMonthsLabel(loopDiffObject.months);
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
    };

    var api = {
      createDateDiffMap : createDateDiffMap
    };
    return api;
  }]);

/*global angular: false */
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
.controller('ExperienceCtrl',
['$scope', '$window', 'SharedData', 'DatesDiff', '$ocLazyLoad',
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
}
])
.controller('ProjectsCtrl', ['$scope', '$window', 'SharedData', 'DatesDiff',
'$ocLazyLoad', function(sc, window, SharedData, DatesDiff, $ocLazyLoad) {
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

'use strict';

angular.module('JesusEspejoACVFilters', [])
.filter('myDate', ['$filter',
	function($filter) {
	    var angularDateFilter = $filter('date');
			return function(dateString) {
				var d = new Date(dateString);
				if(dateString === '') {
					d = new Date();
				}
				return angularDateFilter(d.getTime(), 'MM-yyyy');
			};
		}]);

/*global $:false */

angular.module('NavMenuDirective',
  ['pascalprecht.translate'])
.directive('navMenu', function() {
  'use strict';
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      clickMenuItem: '=',
      navMenuItems: '='
    },
    controller: function($scope, $element, $translate, $location) {

      var menuItems = {
        'WHO_I_AM': {
          'position': 0,
          'path': '/'
        },
        'EXPERIENCE': {
          'position': 1,
          'path': '/experience'
        },
        'PROJECTS': {
          'position': 2,
          'path': '/projects'
        }
      };

      $(document).ready(function() {
        $('.nav li').click(function() {
          $('.nav .active').toggleClass('active');
          $(this).toggleClass('active');
          $('#resp-menu-btn').click();
        });

        $(document).on('click','.navbar-collapse.in',function(e) {
          if( $(e.target).is('a') ) {
            $(this).collapse('hide');
          }
        });
      });

      $scope.langSwitchImg = 'images/lang_spanish.png';

      $scope.switchLanguage = function() {
        if($translate.use() === 'en') {
          $translate.use('es');
          $scope.langSwitchImg = 'images/lang_english.png';
        } else {
          $translate.use('en');
          $scope.langSwitchImg = 'images/lang_spanish.png';
        }
      };

      $scope.clickMenuItem = function(requestedMenu) {
        var reqMenuPosition = menuItems[requestedMenu].position;
        $($($element.find('li'))).removeClass('active');
        $($($element.find('li')[reqMenuPosition])).addClass('active');
        $location.path(menuItems[requestedMenu].path);
      };

      $scope.navMenuItems = menuItems;
    },
    templateUrl: 'views/templates/navmenu.html',
    replace: true
  };
})

;

/*global $:false */
'use strict';

angular.module('SearchButtonDirective', [])
.controller('SearchButtonController', function($scope, $window) {
  $scope.window = $window;
})
.directive('searchButton', function() {
  return {
    restrict: 'E',
    transclude: false,
    scope: {
      searchQuery: '=',
      customPlaceholder: '=',
      expandHandler: '&onExpand',
      collapseHandler: '&onCollapse',
      blurHandler: '&customBlur'
    },
    templateUrl: 'views/templates/search-button.html',
    replace: true,
    controller: 'SearchButtonController',
    link: function(scope, element) {

      var isCollapsed = scope.window.innerWidth <= 480;

      var showInput = function() {
        $(element).toggleClass('mobSearchMode', 'slow', 'linear');
        isCollapsed = false;
        scope.expandHandler();
      };

      var hideInput = function() {
        $(element).toggleClass('mobSearchMode', 'slow', 'linear');
        isCollapsed = true;
        scope.collapseHandler();
      };

      scope.clear = function() {
        $('#searchInput').focus();
        if(scope.window.innerWidth <= 480) {
          if(scope.searchQuery === '' ||
              typeof(scope.searchQuery) === 'undefined') {
            hideInput();
          }
        }
        scope.searchQuery = '';
      };

      scope.click = function() {
        if(isCollapsed) {
          showInput();
          $('.searchButtonContainer #searchInput').focus();
        }
      };

      scope.blur = function() {
        if(!isCollapsed) {
          if(scope.searchQuery === '' ||
              typeof(scope.searchQuery) === 'undefined') {
            hideInput();
            scope.blurHandler();
          }
        }
      };
    }
  };
})

//Credit for ngBlur and ngFocus to https://github.com/addyosmani/todomvc/blob/master/architecture-examples/angularjs/js/directives/
.directive('ngBlur', function() {
  return function( scope, elem, attrs ) {
    elem.bind('blur', function() {
      scope.$apply(attrs.ngBlur);
    });
  };
})

.directive('ngFocus', function( $timeout ) {
  return function( scope, elem, attrs ) {
    scope.$watch(attrs.ngFocus, function( newval ) {
      if ( newval ) {
        $timeout(function() {
          elem[0].focus();
        }, 0, false);
      }
    });
  };
})

.directive('handlePhoneSubmit', function () {
  return function (scope, element) {
    $(element).submit(function() {
        $('#searchInput').blur();
      });
  };
});


'use strict';

angular.module('ExperienceDetailsDirective', ['pascalprecht.translate'])
.directive('experienceDetails', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/templates/experienceDetails.html',
    //replace: true,
    //transclude: true,
    scope: {
      detailsObjAttr: '=detailsObj'
    },
    link: function() {
    }
  };
});

/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('JeaCollapseDirective', [])
.directive('jeaCollapse', [function() {

  function makeSticky(jElement, jParent) {
    jElement.stick_in_parent({
      offset_top: 50,
      parent: jParent,
    });
  }

  function unbindSticky(jElement) {
    jElement.trigger('sticky_kit:detach');
  }

  function openedCallBack(scope, panelHeader, stickyZone) {
    makeSticky(panelHeader, stickyZone, scope);
    $(document.body).trigger('sticky_kit:recalc');
  }

  function closedCallback(scope, panelHeader, stickyZone, scrollBackNeeded) {
    unbindSticky(panelHeader);
    var intScrollTo = $(stickyZone).offset().top - panelHeader.height();
    if(scrollBackNeeded) {
      $('body').animate({scrollTop: intScrollTo}, 500, function() {
        scope.$apply(function() {
          $(document.body).trigger('sticky_kit:recalc');
        });
      });
    } else {
      $(document.body).trigger('sticky_kit:recalc');
    }
  }

  return {
    restrict: 'A',
    link: function(scope, elem) {
      var stickyZone = elem[0].parentElement;
      var panelHeader = $(stickyZone.children[0]);
      var collapsePanel = elem[0];
      var scrollBackNeeded = false;

      var collapseListener = function(scrollBackNeeded) {
        if(collapsePanel.opened) {
          openedCallBack(scope, panelHeader, stickyZone);
        } else {
          closedCallback(scope, panelHeader, stickyZone, scrollBackNeeded);
        }
      };

      elem[0].addEventListener('core-collapse-open', function() {
        if(panelHeader.css('position') === 'fixed') {
          scrollBackNeeded = true;
          panelHeader.css({position: 'fixed', top: '-50px'});
        } else {
          scrollBackNeeded = false;
        }
      });
      elem[0].addEventListener('core-resize', function() {
        collapseListener(scrollBackNeeded);
      });
    }
  };
}]);

/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('JeaCollapseButtonDirective', [])
    .directive('jeaCollapseButton', [function() {

      return {
          restrict: 'E',
          transclude: true,
          template: '<a class="collapsed"><ng-transclude</ng-transclude></a>',
          link: function(scope, elem, attr) {
            var panelid = attr.panelid;
            var collapsePanel = function(panelid) {
              $(elem).find('a').toggleClass('collapsed').promise().done(function() {
                document.querySelector('#' + panelid).toggle();
              });
            };
            if(panelid !== '') {
              elem.on('click', function() {
                collapsePanel(panelid);
              });
            }
          }
        };
    }]);

'use strict';

angular.module('JesusEspejoACVDirectives',
  ['NavMenuDirective',
  'SearchButtonDirective',
  'ExperienceDetailsDirective',
  'JeaCollapseButtonDirective',
  'JeaCollapseDirective',
  'MainLeftDirective',
  'JeaLayerDirective'
  ]);

'use strict';

angular.module('MainLeftDirective', [])
.controller('MainLeftController', ['$scope', '$window', function($scope, $window) {

  $scope.sectionTitleWrapperVisible = true;

  $scope.showTitle = function() {
    if ($window.innerWidth <= 480) {
      $scope.sectionTitleWrapperVisible = true;
    }
  };

  $scope.hideTitle = function() {
    if ($window.innerWidth <= 480) {
      $scope.sectionTitleWrapperVisible = false;
    }
  };

  $scope.exitSearchMode = function(query) {
    if ($window.innerWidth <= 480) {
      if (!query || query === '') {
        $scope.sectionTitleWrapperVisible = true;
      } else {
        $scope.sectionTitleWrapper = false;
      }
    }
  };
}])

.directive('mainLeft', function() {
  return {
    restrict: 'E',
    transclude: false,
    scope: {
      customQuery: '=',
      customTitle: '=',
      customSubtitle: '='
    },
    controller: 'MainLeftController',
    templateUrl: 'views/templates/main-left.html',
    replace: true
  };
});

/* global $ : false */
angular.module('JeaLayerDirective', [])
.directive('jeaLayer', function() {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, elem) {
      elem.bind('core-overlay-open', function(e) {
        if(e.target.opened) {
          $('body').addClass('hideScroll');
        } else {
          $('body').removeClass('hideScroll');
        }
      });
    }
  };
});
