'use strict';

angular.module('JesusEspejoACVServices', ['ng', 'ngResource'])
.factory('SharedData', ['$resource', '$http', function ($resource, $http) {
    var experience = [];
    var searchObject = function(collection, firstLevelKey, value) {
      var foundObject = null;
      for (var i = 0, len = collection.length; i < len; i++) {
        if(collection[i][firstLevelKey] === value) {
          foundObject = collection[i];
          break;
        }
      }
      return foundObject;
    };
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
        for (var i in obj) {
          if (obj[i][key] === val) {
            objects.push(obj[i]);
          }
        }
        return objects;
      },
      getEmployersLastDate: function(allExperience) {
        var employers = [];
        var auxExperience;
        var auxObj = {};
        for (var i in allExperience) {
          auxExperience = allExperience[i];
          // If i've already stored the employer I check the dates
          var auxObj = searchObject(employers, "employerName", auxExperience.employer.name);
          if( auxObj ){
            if(auxObj.start > auxExperience.start) {
              auxObj.start = auxExperience.start;
            }
            if(auxObj.end < auxExperience.end) {
              auxObj.end = auxExperience.end;
            }
          } else {
            auxObj = {
              employerName: auxExperience.employer.name,
              webSite: auxExperience.employer.webSite,
              imageUrl: auxExperience.employer.imageUrl,
              start: auxExperience.start,
              end: auxExperience.end
            };
            employers.push(auxObj);
          }
        }
        return employers;
      }
    };
  }])
;
