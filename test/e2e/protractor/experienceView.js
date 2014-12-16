/* global describe, beforeEach, browser, it, element, by, expect : false*/

describe('view:experience', function() {
  'use strict';

  beforeEach(function() {
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
