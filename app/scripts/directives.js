/*global $:false */
'use strict';

angular.module('JesusEspejoACVDirectives', ['pascalprecht.translate'])
.directive('navMenu', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: function($scope, $element, $translate) {

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
}).directive('searchButton', function($rootScope) {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			searchQuery: '=',
			eventHandler: '&onExpand',
			blurHandler: '&customBlur',
			customPlaceholder: '='
		},
		controller: function($scope, $element) {
			$scope.isCollapsed = true;
			
			$scope.clear = function() {
				$scope.searchQuery = "";
				$('.searchButtonContainer > input').focus();
			};

			$scope.showInput = function() {
				if($scope.isCollapsed) {
					$('.searchButtonContainer').toggleClass('mobSearchMode', 'slow', 'linear');
					$scope.isCollapsed = false;
				}
			};

			$scope.hideInput = function() {
		        if(window.innerWidth <= 480 ) {
		          if(!$scope.searchQuery || $scope.searchQuery === "") {
					$('.searchButtonContainer').toggleClass('mobSearchMode', 'slow', 'linear');
					$scope.isCollapsed = true;
		          }
		        }
			}

			$scope.expand = function() {
				if($scope.isCollapsed) {
					$scope.eventHandler();
					$scope.showInput();
					$('.searchButtonContainer > input').focus();
				}
			}

			$scope.blur = function() {
				$scope.hideInput();
				$scope.blurHandler();
			}
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
}).directive('ngFocus', function( $timeout ) {
  return function( scope, elem, attrs ) {
    scope.$watch(attrs.ngFocus, function( newval ) {
      if ( newval ) {
        $timeout(function() {
          elem[0].focus();
        }, 0, false);
      }
    });
  };
});