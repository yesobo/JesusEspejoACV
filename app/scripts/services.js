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
  .factory('DatesDiff', [function() {

    var getMonthsDiff = function(datesObj) {
      var dStart = new Date(datesObj[0]);
      var dEnd;
      if(datesObj[1] === '') {
        dEnd = new Date();
      } else {
        dEnd = new Date(datesObj[1]);
      }
      var monthDiff = (dEnd.getFullYear() -
        dStart.getFullYear()) * 12 + dEnd.getMonth() - dStart.getMonth();

      return monthDiff;
    };

    var getYearsMonthsDiff = function(datesObj) {
      var result = {};

      result.years = '';
      result.months = '';

      var monthDiff = getMonthsDiff(datesObj);
      var years = Math.floor(monthDiff / 12);
      var months = monthDiff % 12;
      result.years = years;
      result.months = months;

      return result;
    };

    var getYearsLabel = function(years) {
      var result = '';
      if ( years > 0 ) {
        if ( years > 1) {
          result = 'YEARS';
        } else {
          result = 'YEAR';
        }
      }
      return result;
    };

    var getMonthsLabel = function(months) {
      var result = '';
      if ( months > 0 ) {
        if (months > 1) {
          result = 'MONTHS';
        } else {
          result = 'MONTH';
        }
      }
      return result;
    };

    var createDateDiffMap = function(startEndCollection, key) {
      var result = {};
      var loopDiffObject, loopYearsLabel, loopMonthsLabel, resultKey, startEndObj;
      for(var startEndKey in startEndCollection) {
        startEndObj = startEndCollection[startEndKey];
        loopDiffObject =
          getYearsMonthsDiff([startEndObj.start, startEndObj.end]);

        loopYearsLabel = getYearsLabel(loopDiffObject.years);
        loopMonthsLabel = getMonthsLabel(loopDiffObject.months);
        if(loopDiffObject.years === 0) {
          loopDiffObject.years = '';
        }
        if(loopDiffObject.months === 0) {
          loopDiffObject.months = '';
        }

        resultKey = startEndObj[key];

        result[resultKey] = {
          years: loopDiffObject.years,
          yearLabel: loopYearsLabel,
          months: loopDiffObject.months,
          monthLabel: loopMonthsLabel
        };
      }

      return result;
    };

    var api = {
      createDateDiffMap : createDateDiffMap
    };
    return api;
  }]);
