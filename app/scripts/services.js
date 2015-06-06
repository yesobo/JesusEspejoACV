'use strict';

angular.module('JesusEspejoACVServices', ['ng', 'ngResource'])
.factory('SharedData', ['$resource', function ($resource) {

    function searchObject(collection, firstLevelKey, value) {
      var foundObject = null;
      for (var i = 0, len = collection.length; i < len; i++) {
        if(collection[i][firstLevelKey] === value) {
          foundObject = collection[i];
          break;
        }
      }
      return foundObject;
    }

    /**
     * Returns the JSON objects of the provided Array that matches the key: value
     *   pair given as parameters
     * @param {Array} obj - Array to be filtered.
     * @param {String} key - Propery to be filtered by.
     * @param {String} val - Value of the property that matches the resulting
     *   collection elements.
     * @returns {Array}
     */
    function _filterJSON(obj, key, val) {
      var objects = [];
      for (var i in obj) {
        if (obj[i][key] === val) {
          objects.push(obj[i]);
        }
      }
      return objects;
    }

    /**
    * Groups related by a given key events from a given collection of events,
    *   returning a collection of event objects that represents the period of
    *   time where these related events took place.
    * @param {json} eventsCollection - collection of event objects with 'start'
    *   , 'end' and 'employer' properties.
    * @param {String} relationKey - the key wich event objects are related by.
    * @returns {json} periodObject that represents the period during related
    *  events took place.
    *  {
    *    employerName: "name",
    *    webSite: "website",
    *    imageUrl: "url",
    *    start: "2010-04-01T00:00:00",
    *    end: "2011-02-12T00:00:00"
    *  }
    */
    function _groupEvents(eventsCollection) {
      var resultArray = [];
      var auxObject;
      var minStartMaxEnd = {};
      var newEventsGroup = {};
      for (var i = 0; i < eventsCollection.length; i++) {
        auxObject = eventsCollection[i];
        // If i've already created the events group I check the max and min dates
        minStartMaxEnd = searchObject(resultArray, 'employerName',
          auxObject.employer.name);
        if( minStartMaxEnd ){
          if(minStartMaxEnd.start > auxObject.start) {
            minStartMaxEnd.start = auxObject.start;
          }
          if(auxObject.end === '') {
            auxObject.end = new Date().toISOString();
          }
          if(minStartMaxEnd.end < auxObject.end) {
            minStartMaxEnd.end = auxObject.end;
          }
        } else {
          newEventsGroup = {
              employerName: auxObject.employer.name,
              webSite: auxObject.employer.webSite,
              imageUrl: auxObject.employer.imageUrl,
              start: auxObject.start,
              end: auxObject.end
            };
          resultArray.push(newEventsGroup);
        }
      }
      return resultArray;
    }

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
      filterJSON: _filterJSON,
      getGroupedPeriods: _groupEvents
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

    /**
     * Returns an map of entries whose keys are a common property of the objects
     *  included in the provided array, and whose values are objects that represents
     *  the time between start and end dates of these objects, expressed with
     *  month(s) and year(s)
     * @param {Array} startEndCollection - Array of objects with 'start' and 'end'
     *   properties.
     * @param {String} key - object property used as the key of the map entry.
     * @result {Object}
     *    {
     *      "key": {
     *        "monthLabel": "MONTH",
     *        "months": 3,
     *        "yearLabel": "YEARS",
     *        "years": 3
     *      }
     *    }
     */
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
