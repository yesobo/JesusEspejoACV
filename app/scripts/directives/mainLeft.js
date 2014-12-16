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
