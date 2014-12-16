/* global describe, beforeEach, inject, it, expect: false*/
'use strict';

describe('Service', function() {

  describe('DatesDiff', function() {

    var datesDiff;

    var testStartEndCollection = [];
    var expectedEmployer1 = {
      employerName: 'Employer1',
      start: '2009-06-01 00:00:00 UTC',
      end: '2010-07-01 00:00:00 UTC'
    };
    var expectedEmployer2 = {
      employerName: 'Employer2',
      start: '2010-06-01 00:00:00 UTC',
      end: '2010-07-01 00:00:00 UTC'
    };

    testStartEndCollection.push(expectedEmployer1);
    testStartEndCollection.push(expectedEmployer2);

    var expectedResultJSONMap = {
      'Employer1': {
        'monthLabel': 'MONTH',
        'months': 1,
        'yearLabel': 'YEAR',
        'years': 1
      },
      'Employer2': {
        'monthLabel': 'MONTH',
        'months': 1,
        'yearLabel': '',
        'years': ''
      }
    };

    beforeEach(module('JesusEspejoACVServices'));

    beforeEach(inject(function($injector) {
      datesDiff = $injector.get('DatesDiff');
    }));

    describe('createDateDiffMap', function() {

      it('creates start and end map of the related objects', function() {
        var map = datesDiff.createDateDiffMap(testStartEndCollection, 'employerName');
        expect(map.Employer1.monthLabel).toBe(expectedResultJSONMap.Employer1.monthLabel);
        expect(map.Employer1.months).toBe(expectedResultJSONMap.Employer1.months);
        expect(map.Employer1.yearLabel).toBe(expectedResultJSONMap.Employer1.yearLabel);
        expect(map.Employer1.years).toBe(expectedResultJSONMap.Employer1.years);

        expect(map.Employer2.monthLabel).toBe(expectedResultJSONMap.Employer2.monthLabel);
        expect(map.Employer2.months).toBe(expectedResultJSONMap.Employer2.months);
        expect(map.Employer2.yearLabel).toBe(expectedResultJSONMap.Employer2.yearLabel);
        expect(map.Employer2.years).toBe(expectedResultJSONMap.Employer2.years);
      });
    });
  });
});
