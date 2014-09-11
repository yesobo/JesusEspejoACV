/*global $:false */
'use strict';

angular.module('NavMenuDirective',
  ['pascalprecht.translate'])
.directive('navMenu', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function($scope, $element, $translate, $location) {

      $('.nav li').click(function() {
        $('.nav .active').toggleClass('active');
        $(this).toggleClass('active');
        $('#resp-menu-btn').click();
      });

      $scope.langSwitchImg = 'images/lang_spanish.png';
      $scope.changeLanguage = function(langKey) {
        $translate.uses(langKey);
      };

      $scope.switchLanguage = function() {
        if($translate.uses() === 'en') {
          $translate.uses('es');
          $scope.langSwitchImg = 'images/lang_english.png';
        } else {
          $translate.uses('en');
          $scope.langSwitchImg = 'images/lang_spanish.png';
        }
      };
    },
    templateUrl: 'views/templates/navmenu.html',
    replace: true
  };
})

;
