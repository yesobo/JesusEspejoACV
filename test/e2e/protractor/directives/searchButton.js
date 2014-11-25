/* global describe, beforeEach, browser, it, element, by, expect : false */
describe('directive:searchButton', function() {
  'use strict';

  beforeEach(function() {
    browser.get('#/experience');
  });

  describe('on desktop', function() {
    it('should clean the search query clicking on the clean button', function() {

    });
  });

  ddescribe('on mobile', function() {
    beforeEach(function() {
      var width = 479;
      var height = 600;
      browser.driver.manage().window().setSize(width, height);
    });

    it('should hide search input', function() {
      var searchInput = element(by.model('searchQuery'));
      searchInput.sendKeys('unknown tech');
      var clearButton = element(by.css('.close'));
      clearButton.click();
      expect(searchInput.getText()).toMatcH('');
    });

    it('should show search input on click', function() {

    });

    it('should hide the search input on blur and empty search query', function() {

    });

    it('should hide the search input on clear and empty search query', function() {

    });
  });

  it('should active the projects menu li when experience not found link clicked', function() {
    var searchInput = element(by.model('searchQuery'));
    searchInput.sendKeys('unknown tech');

    var noFoundLink = element(by.css('[ng-click="clickMenu(notFoundRequestedMenu);"]'));
    noFoundLink.click();

    var projectsMenu = element.all(by.css('#ul-lang > li')).get(2);
    expect(projectsMenu.getAttribute('class')).toMatch('active');
  });

  it('should active the experience menu li when projects not found link clicked', function() {
    browser.get('#/projects');
    var searchInput = element(by.model('searchQuery'));
    searchInput.sendKeys('unknown tech');

    var noFoundLink = element(by.css('[ng-click="clickMenu(notFoundRequestedMenu);"]'));
    noFoundLink.click();

    var experienceMenu = element.all(by.css('#ul-lang > li')).get(1);
    expect(experienceMenu.getAttribute('class')).toMatch('active');
  });
});
