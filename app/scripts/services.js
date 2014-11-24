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
      getEmploymentsResource: function() {
        var actions = {
          'query': {
            method: 'GET',
            isArray: true
          }
        };
        return $resource('data/employment.json', {},
          actions);
      },
      getProjectsResource: function() {
        var actions = {
          'query': {
            method: 'GET',
            isArray: true
          }
        };
        return $resource('data/projects.json', {},
          actions);
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
      /*
        returned JS object example:
            {
              employerName: '',
              webSite: '',
              imageUrl: '',
              start: '',
              end: ''
            };
       */
      getEmployersPeriods: function(allExperience) {
        var resultArray = [];
        var auxExperience;
        var foundInEmployersArray = {};
        var newResultEmployerObject = {};
        for (var i = 0; i < allExperience.length; i++) {
          auxExperience = allExperience[i];
          // If i've already stored the employer I check the dates
          foundInEmployersArray = searchObject(resultArray, 'employerName', auxExperience.employer.name);
          if( foundInEmployersArray ){
            if(foundInEmployersArray.start > auxExperience.start) {
              foundInEmployersArray.start = auxExperience.start;
            }
            if(foundInEmployersArray.end < auxExperience.end) {
              foundInEmployersArray.end = auxExperience.end;
            }
          } else {
            newResultEmployerObject = {
              employerName: auxExperience.employer.name,
              webSite: auxExperience.employer.webSite,
              imageUrl: auxExperience.employer.imageUrl,
              start: auxExperience.start,
              end: auxExperience.end
            };
            resultArray.push(newResultEmployerObject);
          }
        }
        return resultArray;
      }
    };
  }])
;
