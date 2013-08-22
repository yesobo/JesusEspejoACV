'use strict';

describe('Controller: ExperienceDetailCtrl', function () {
/**
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
          }
        ]);
      };
      return {
        getSharedData: getSharedData
      };
    });
  }));

  // load the controller's module
  beforeEach(module('JesusEspejoACVApp'));

  var ExperienceDetailCtrl,
    scope;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, mockSharedData) {
    scope = $rootScope.$new();
    ExperienceDetailCtrl = $controller('ExperienceDetailCtrl', {$scope: scope,
      $routeParams: { clientName: 'Metro de Madrid S.A.' }, sharedData: mockSharedData});
  }));

  it('should create "exprience" model with 1 employments fetched from a service', function() {
    expect(scope.experience).toEqual({
      'client': {
        'name': 'Metro de Madrid S.A.',
        'imageUrl': 'img/client/metro_madrid_logo.png'
      }
    });
  });
**/ 
});
