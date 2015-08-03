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
        },
        'BLOG': {
          'position': 3,
          'path': '/blog'
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
