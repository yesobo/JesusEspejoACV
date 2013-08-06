'use strict';

angular.module('JesusEspejoACVDirectives', ['pascalprecht.translate'])
.directive('navmenu', function() {
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

			$scope.lang_switch_img = 'img/lang_spanish.png';
			$scope.changeLanguage = function(langKey) {
				$translate.uses(langKey);
			}

			$scope.switchLanguage = function() {
				if($translate.uses() === 'en') {
					$translate.uses('es');
					$scope.lang_switch_img = 'img/lang_english.png';
				} else {
					$translate.uses('en');
					$scope.lang_switch_img = 'img/lang_spanish.png';
				}
			}
		},
		templateUrl: 'views/templates/navmenu.html',
		replace: true
	};
});