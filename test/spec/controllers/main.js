/* global describe, beforeEach, it, expect, inject, jasmine:false */
'use strict';

describe('Controller: ExperienceCtrl', function () {

  // load the controller's module
  beforeEach(module('JesusEspejoACVApp'));

  var MainCtrl,
    scope, mockSharedDataResource;

   beforeEach(function() {
    // creating a mock service
    mockSharedDataResource = {
      query: function() {}
    };
    
    spyOn(mockSharedDataResource, 'query').andCallFake( function(callback) {
        debugger;
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
  })

  beforeEach(module(function($provide) {
    $provide.factory('mockSharedData', function() {
      return {
        getSharedData: function() {
          return mockSharedDataResource;
        },
        getEmployersLastDate: function() {
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
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, mockSharedData) {
    scope = $rootScope.$new();
    MainCtrl = $controller('ExperienceCtrl', {$scope: scope, SharedData: mockSharedData});
  }));

  it('should create "employment" model with 2 employments fetched from xhr', function() {
    expect(mockSharedDataResource.query).toHaveBeenCalled();
    debugger;
    expect(scope.employments.length).toBe(4);
    expect(scope.employments[1].employer).toBe('Employer1');
    expect(scope.employersDates.Employer1.start).toBe('2009-06-01 00:00:00 UTC');
    expect(scope.employersDates.Employer2.end).toBe('2011-04-01 00:00:00 UTC');
  });
});
