/*eslint-env jasmine */
/*global inject, module*/

describe('Service', function() {
	'use strict';

	describe('SharedData', function() {

		var $httpBackend, sharedData;

		var expectedResult = [];
		var expectedEmployer1 = {
			employerName: 'Employer1',
			start: '2009-06-01 00:00:00 UTC',
			end: '2011-04-01 00:00:00 UTC'
		};
		var expectedEmployer2 = {
			employerName: 'Employer2',
			start: '2011-04-01 00:00:00 UTC',
			end: '2013-07-16 07:27:05 UTC'
		};

		var testResponseJSONArray = [
			{
				'employer': {
					'name': 'Employer1'
				},
				'start': '2009-06-01 00:00:00 UTC',
				'end': '2009-10-01 00:00:00 UTC',
				'auxKey': 'value1'
			},
			{
				'employer': {
					'name': 'Employer1'
				},
				'start': '2010-04-01 00:00:00 UTC',
				'end': '2011-04-01 00:00:00 UTC',
				'auxKey': 'value1'
			},
			{
				'employer': {
					'name': 'Employer2'
				},
				'start': '2011-04-01 00:00:00 UTC',
				'end': '2012-06-01 00:00:00 UTC',
				'auxKey': 'value2'
			},
			{
				'employer': {
					'name': 'Employer2'
				},
				'start': '2012-10-01 00:00:00 UTC',
				'end': '2013-07-16 07:27:05 UTC',
				'auxKey': 'value3'
		  }
		];

		expectedResult.push(expectedEmployer1);
		expectedResult.push(expectedEmployer2);

		beforeEach(module('JesusEspejoACVServices'));

		beforeEach(inject(function($injector) {
			sharedData = $injector.get('SharedData');
			$httpBackend = $injector.get('$httpBackend');
			$httpBackend.whenGET('data/employment.json')
				.respond(testResponseJSONArray);
			$httpBackend.whenGET('data/projects.json')
				.respond(testResponseJSONArray);
		}));

		describe('getEmploymentsResource', function() {

			it('should return a resource with the query method to the test data',
				function() {

				var data = sharedData.getEmploymentsResource().query();
				$httpBackend.flush();
				expect(data).toBeDefined();
				expect(data.length).toBe(4);
			});
		});

		describe('getProjectsResource', function() {

			it('should return a resource with the query method to the test data',
			function() {

				var data = sharedData.getProjectsResource().query();
				$httpBackend.flush();
				expect(data).toBeDefined();
				expect(data.length).toBe(4);
			});
		});

		describe('filterJSON', function() {

			it('should return an array filtered by key: value',
			function() {

				var filtered = sharedData.filterJSON(testResponseJSONArray, 'auxKey',
					'value1');
				expect(filtered.length).toBe(2);
			});
		});

		var data, allExperience;

		describe('getGroupedPeriods', function() {

			beforeEach(function(done) {
				allExperience = sharedData.getEmploymentsResource().query(function() {
					data = true;
					data = sharedData.getGroupedPeriods(allExperience);
					done();
				});
				$httpBackend.flush();
			});

			it('returns all the employer\'s first and last dates of the given array',
				function() {

					expect(data).not.toBe(null);
					expect(data.length).toBe(2);
					expect(data[0].employerName).toBe(expectedEmployer1.employerName);
					expect(data[0].start).toBe(expectedEmployer1.start);
					expect(data[0].end).toBe(expectedEmployer1.end);
					expect(data[1].employerName).toBe(expectedEmployer2.employerName);
					expect(data[1].start).toBe(expectedEmployer2.start);
					expect(data[1].end).toBe(expectedEmployer2.end);

			});
		});
	});
});
