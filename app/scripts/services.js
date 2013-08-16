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
          return callBack(experience);
        });
      },
      setSharedData: function(data) {
        angular.copy(data, experience);
      },
      filterJSON: function(obj, key, val) {
        var objects = [];
        console.log('finding between the objects ' + obj);
        for (var i in obj) {
          if (obj[i][key] === val) {
            objects.push(obj[i]);
          }
        }
        return objects;
      },
      getEmployersLastDate: function(allExperience) {
        console.log("executing employersLastDate");
        var employers = [];
        var auxExperience;
        for (var i in allExperience) {
          auxExperience = allExperience[i];
          // If i've already stored the employer I check the dates
          if (employers[auxExperience.employer]) {
            if(employers[auxExperience.employer].start > auxExperience.start) {
              employers[auxExperience.employer].start = auxExperience.start;
            }
            if(employers[auxExperience.employer].end < auxExperience.end) {
              employers[auxExperience.employer].end = auxExperience.end;
            }
          // Store the employer and dates
          } else {
            employers[auxExperience.employer] = {
              start: auxExperience.start,
              end: auxExperience.end
            };
          }

        }
        return employers;
      }
    };
  }])
;
