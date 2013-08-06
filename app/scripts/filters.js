'use strict';

angular.module('JesusEspejoACVApp')
.filter('myDate', function($filter) {
    var angularDateFilter = $filter('date');
    return function(dateString) {
      var d = new Date(dateString);
      return angularDateFilter(d.getTime(), 'MM-yyyy');
    }
  })
;
