/*global $:false */

angular.module('NavMenuDirective',
  ['pascalprecht.translate'])
.directive('navMenu', function() {
  'use strict';
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      clickMenuItem: '='
    },
    controller: function($scope, $element, $translate) {

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

      $scope.clickMenuItem = function(menuItemNumber) {
        $element.find('li')[menuItemNumber].children()[0].click();
      };
    },
    templateUrl: 'views/templates/navmenu.html',
    replace: true
  };
})

;
