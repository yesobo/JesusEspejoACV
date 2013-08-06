'use strict';

angular.module('JesusEspejoACVServices', ['ngResource'])
.factory('SharedData', ['$resource', function ($resource) {
    var experience = [];
    return {
	  getSharedData: function() {
    	return $resource('data/employment.json', {});
      },
	  getSharedDataHttp: function(callBack) {
        $http.get('data/employment.json').success(function(data){
          experience = data;
          return callBack(experience)
	  	}); 
	  },
      setSharedData: function(data) {
        angular.copy(data, employments)
      },
      filterJSON: function(obj, key, val) {
        var objects = [];
        console.log("finding between the objects " + obj)
        for (var i in obj) {
          console.log("i is: " + i);
          console.log(obj[i][key]);
       	  console.log("comparing " + obj[i][key] + " and val: " + val);
          if (obj[i][key] === val) {
          	console.log("FOUND!!");
          	console.log(obj[i].start);
            objects.push(obj[i]);
          }
        }
        return objects;
      }
    };
  }])
;
