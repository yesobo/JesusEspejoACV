/* global describe, beforeEach, it, expect, inject:false */
'use strict';

describe('Controller: ExperienceCtrl', function () {

  // load the controller's module
  beforeEach(module('JesusEspejoACVApp'));

  var MainCtrl,
    scope;

  // creating a mock service
  beforeEach(module(function($provide) {
    $provide.factory('mockSharedData', function() {
      var getSharedData = function() {
        
        return {
          query:function(callBack){
            return callBack([
              {
                'client': {
                  'name': 'Metro de Madrid S.A.',
                  'imageUrl': 'img/client/metro_madrid_logo.png'
                }
              },
              {
                'client': {
                  'name': 'Bankia',
                  'imageUrl': 'img/client/bankia_logo.png'
                }
              }
            ]);
          }
        };
      };

      var getEmployersLastDate = function() {
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
      };

      return {
        getSharedData: getSharedData,
        getEmployersLastDate: getEmployersLastDate
      };
    });
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, mockSharedData) {
    scope = $rootScope.$new();
    MainCtrl = $controller('ExperienceCtrl', {$scope: scope, SharedData: mockSharedData});
  }));

  it('should create "employment" model with 2 employments fetched from xhr', function() {
    expect(scope.employments).toEqual([
        {
          'client': {
            'name': 'Metro de Madrid S.A.',
            'imageUrl': 'img/client/metro_madrid_logo.png'
          }
        },
        {
          'client': {
            'name': 'Bankia',
            'imageUrl': 'img/client/bankia_logo.png'
          }
        }
      ]);
  });
});
