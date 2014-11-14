/*global $:false */
'use strict';

angular.module('SearchButtonDirective', [])
.directive('searchButton', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      searchQuery: '=',
      expandHandler: '&onExpand',
      blurHandler: '&customBlur',
      customPlaceholder: '='
    },
    controller: function($scope) {
      $scope.isCollapsed = true;

      $scope.clear = function() {
        $scope.searchQuery = '';
        $('#searchInput').focus();
      };

      $scope.showInput = function() {
        if($scope.isCollapsed) {
          $('.searchButtonContainer').toggleClass('mobSearchMode', 'slow', 'linear');
          $scope.isCollapsed = false;
        }
      };

      $scope.hideInput = function() {
        if(window.innerWidth <= 480 ) {
          if(!$scope.searchQuery || $scope.searchQuery === '') {
            $('.searchButtonContainer').toggleClass('mobSearchMode', 'slow', 'linear');
            $scope.isCollapsed = true;
          }
        }
      };

      $scope.expand = function() {
        if($scope.isCollapsed) {
          $scope.expandHandler();
          $scope.showInput();
          $('.searchButtonContainer #searchInput').focus();
        }
      };

      $scope.blur = function() {
        if(!$scope.searchQuery) {
          $scope.hideInput();
          $scope.blurHandler();
        }
      };

      $scope.hideKeyboard = function() {
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        $('.searchButtonContainer').appendChild(field);
        field.setAttribute('style', 'display:none;');
        field.focus();
      };
    },
    templateUrl: 'views/templates/search-button.html',
    replace: true
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
