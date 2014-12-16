/* global describe, beforeEach, browser, it, element, by, expect : false*/

describe('view:experience', function() {
  'use strict';

  beforeEach(function() {
    var width = 1280;
    var height = 768;
    browser.driver.manage().window().setSize(width, height);
    browser.get('#/experience');
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
