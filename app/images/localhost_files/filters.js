'use strict';

angular.module('JesusEspejoACVApp')
.filter('myDate', function($filter) {
    var angularDateFilter = $filter('date');
    return function(dateString) {
			var d = new Date(dateString);
			if(dateString === '') {
				d = new Date();
			}
			return angularDateFilter(d.getTime(), 'MM-yyyy');
    };
  });
