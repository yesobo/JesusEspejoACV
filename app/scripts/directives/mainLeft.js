'use strict';

angular.module('MainLeftDirective', [])
.directive('mainLeft', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      //searchQuery: '=',
      //expandHandler: '&onExpand',
      //blurHandler: '&customBlur',
      customQuery: '=',
      customTitle: '=',
      customSubtitle: '='
    },
    controller: function($scope, $window) {
      var NO_FOCUS_SEARCH = 0;
      $scope.sectionTitleWrapperVisible = true;
      $scope.activateSearchButton = true;
      $scope.searchButtonInputFocus = false;

      $scope.hideAndExpand = function(mode) {
          if ($window.innerWidth <= 480) {
            if ($scope.activateSearchButton) {
              $scope.activateSearchButton = false;
              if (mode === NO_FOCUS_SEARCH) {
                $scope.sectionTitleWrapperVisible = true;
              } else {
                $scope.sectionTitleWrapperVisible = false;
                $scope.searchButtonInputFocus = true;
              }
            }
          }
        };

      $scope.exitSearchMode = function() {
          if ($window.innerWidth <= 480) {
            if (!$scope.query || $scope.query === '') {
              $scope.sectionTitleWrapperVisible = true;
              $scope.activateSearchButton = true;
            }
          }
        };
    },
    templateUrl: 'views/templates/main-left.html',
    replace: true
  };
});
