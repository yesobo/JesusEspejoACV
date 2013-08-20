'use strict';

describe('Service', function() {

	describe('SharedData', function() {

		var $httpBackend, sharedData;
			
		beforeEach(module('JesusEspejoACVServices'));

		beforeEach(inject(function(_$httpBackend_) {

			inject(function($injector) {
				sharedData = $injector.get('SharedData');
			});

			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('data/employment.json').
				respond([
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
			]);
		}));

		describe('getEmployersLastDate', function() {

			var expectedResult = [];
			expectedResult.Employer1 = {
				start: '2009-06-01 00:00:00 UTC',
				end: '2011-04-01 00:00:00 UTC'
			};
			
			expectedResult.Employer2 = {
				start: '2009-06-01 00:00:00 UTC',
				end: '2011-04-01 00:00:00 UTC'
			};

			it('should return the expectedResult', function() {
				var allExperience = sharedData.getSharedData().query();
				$httpBackend.flush();
				var data = sharedData.getEmployersLastDate(allExperience);
				expect(data.Employer1).toBeDefined();
				expect(data.Employer1.start).toEqual(expectedResult.Employer1.start);
				expect(data.Employer1.end).toEqual(expectedResult.Employer1.end);
			}) ;
		});
	});
});