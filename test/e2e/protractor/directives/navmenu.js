/* global describe, beforeEach, browser, it, element, by, expect : false */
describe('directive: navmenu', function() {
  'use strict';

  beforeEach(function() {
    browser.get('/');
  });

  it('should active the projects menu li when experience not found link clicked',
    function() {

    browser.get('#/experience');
    var searchInput = element(by.model('searchQuery'));
    searchInput.sendKeys('unknown tech');

    var noFoundLink = element(by.css('[ng-click="clickMenu(notFoundRequestedMenu);"]'));
    noFoundLink.click();

    var projectsMenu = element.all(by.css('#ul-lang > li')).get(2);
    expect(projectsMenu.getAttribute('class')).toMatch('active');
  });

  it('should active the experience menu li when projects not found link clicked',
    function() {

    browser.get('#/projects');
    var searchInput = element(by.model('searchQuery'));
    searchInput.sendKeys('unknown tech');

    var noFoundLink = element(by.css('[ng-click="clickMenu(notFoundRequestedMenu);"]'));
    noFoundLink.click();

    var experienceMenu = element.all(by.css('#ul-lang > li')).get(1);
    expect(experienceMenu.getAttribute('class')).toMatch('active');
  });

  iit('should change class to scrolled on scroll', function() {
    var nav = element.all(by.css('header')).get(0);
    expect(nav.getAttribute('class')).not.toMatch('scrolled');
    browser.executeScript('window.scrollTo(0,10);').then(function() {
      expect(nav.getAttribute('class')).toMatch('scrolled');
    })
  })
});
