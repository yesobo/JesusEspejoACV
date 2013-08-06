'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('JesusEspejoACVApp'));

  var MainCtrl,
    scope;

  // creating a mock service
  beforeEach(module(function($provide) {
    $provide.factory('mockSharedData', function() {
      var getSharedData = function(callBack){
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
      };
      return {
        getSharedData: getSharedData
      };
    });
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, mockSharedData) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {$scope: scope, sharedData: mockSharedData});
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
