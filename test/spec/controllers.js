/* global describe, beforeEach, it, expect, inject, spyOn: false */
'use strict';

describe('Controller: ExperienceCtrl', function () {

  // load the controller's module
  beforeEach(module('JesusEspejoACVControllers'));

  var MainCtrl,
  scope,
  mockEmploymentsResource,
  $httpBackend;

  beforeEach(function() {

    // creating a mock service
    mockEmploymentsResource = {
      query: function() {}
    };

    spyOn(mockEmploymentsResource, 'query')
      .andCallFake( function(callback) {
        var employments = [
          {
            employer: 'Employer1',
            start: '2009-06-01 00:00:00 UTC',
            end: '2009-10-01 00:00:00 UTC'
          },
          {
            employer: 'Employer1',
            start: '2010-04-01 00:00:00 UTC',
            end: '2011-04-01 00:00:00 UTC'
          },
          {
            employer: 'Employer2',
            start: '2011-04-01 00:00:00 UTC',
            end: '2012-06-01 00:00:00 UTC'
          },
          {
            employer: 'Employer2',
            start: '2012-10-01 00:00:00 UTC',
            end: '2013-07-16 07:27:05 UTC'
          }
        ];
        callback();
        return employments;
      });
  });

  beforeEach(module(function($provide) {
    $provide.factory('mockSharedData', function() {
      return {
        getEmploymentsResource: function() {
          return mockEmploymentsResource;
        },
        getGroupedPeriods: function() {
          var expectedResult = [];
          expectedResult.Employer1 = {
            start: '2009-06-01 00:00:00 UTC',
            end: '2011-04-01 00:00:00 UTC'
          };

          expectedResult.Employer2 = {
            start: '2009-06-01 00:00:00 UTC',
            end: '2011-04-01 00:00:00 UTC'
          };
          return expectedResult;
        }
      };
    });

    $provide.factory('mockDatesDiff', function() {
      return {
        createDateDiffMap: function() {
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
          return expectedResultJSONMap;
        }
      };
    });
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector,
      mockSharedData, mockDatesDiff) {

    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    MainCtrl = $controller('ExperienceCtrl',
      {$scope: scope, SharedData: mockSharedData, DatesDiff: mockDatesDiff});
  }));

  it('should create "employments" model with 4 employments fetched from xhr',
      function () {
    expect(mockEmploymentsResource.query).toHaveBeenCalled();
    expect(scope.employments.length).toBe(4);
    expect(scope.employments[1].employer).toBe('Employer1');
    expect(scope.employersDates.Employer1.start).toBe('2009-06-01 00:00:00 UTC');
    expect(scope.employersDates.Employer2.end).toBe('2011-04-01 00:00:00 UTC');
  });
});
