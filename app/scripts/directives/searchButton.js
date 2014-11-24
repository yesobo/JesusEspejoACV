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
