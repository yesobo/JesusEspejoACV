/* global describe, beforeEach, inject, it, expect: false*/
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
			var expectedEmployer1 = {
				employerName: 'Employer1',
				start: '2009-06-01 00:00:00 UTC',
				end: '2011-04-01 00:00:00 UTC'
			};
			
			var expectedEmployer2 = {
				employerName: 'Employer2',
				start: '2009-06-01 00:00:00 UTC',
				end: '2011-04-01 00:00:00 UTC'
			};

			expectedResult.push(expectedEmployer1);
			expectedResult.push(expectedEmployer2);

			it('should return the expectedResult', function() {
				var allExperience = sharedData.getSharedData().query(function() {
					$httpBackend.flush();
					var data = sharedData.getEmployersLastDate(allExperience);
					expect(data.length).toBe(2);
					expect(data[0].start).toEqual(expectedEmployer1.start);
					expect(data[1].end).toEqual(expectedEmployer2.end);
				});
			});
		});
	});
});