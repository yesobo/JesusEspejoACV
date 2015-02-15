/* global describe, beforeEach, browser, it, element, by, expect : false*/

describe('view:experience', function() {
  'use strict';

  var hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };

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

  ddescribe('on collapse button clicked', function() {

    var desktopButton;
    var mobileButton;

    describe('on desktop', function() {

      var anchor;

      beforeEach(function() {
        desktopButton = element.all(by.css('jea-collapse-button.desktop')).get(0);
        mobileButton = element.all(by.css('jea-collapse-button.mobile')).get(0);
      });
      it('mobile button is hidden', function() {
        expect(mobileButton.isDisplayed()).toBeFalsy();
      });
      it('desktop button has its referenced panel id', function() {
        expect(desktopButton.getAttribute('panelid')).not.toBe('');
      });
      it('the anchor has collapsed class', function() {
        anchor = desktopButton.element(by.css('a'));
        expect(hasClass(anchor, 'collapsed')).toBeTruthy();
      });
      it('the icon shown is the arrow', function() {
        var icon = anchor.element(by.css('span'));
        expect(hasClass(icon, 'glyphicon-chevron-up')).toBeTruthy();
      });
    });

    describe('on mobile', function() {
      beforeEach(function() {
        var width = 479;
        var height = 600;
        browser.driver.manage().window().setSize(width, height);

        browser.get('#/experience');

        desktopButton = element.all(by.css('jea-collapse-button.desktop')).get(0);
        mobileButton = element.all(by.css('jea-collapse-button.mobile')).get(0);
      });

      it('desktop button is hidden', function() {
        expect(desktopButton.isDisplayed()).toBeFalsy();
      });
      it('mobile button has its referenced panel id', function() {
        expect(mobileButton.getAttribute('panelid')).toBe('');
      });
      it('on click shows a paper-dialog', function() {
        mobileButton.click();
        var overlayLayer = element.all(by.css('core-overlay-layer')).get(0);
        expect(hasClass(overlayLayer, 'core-opened')).toBeTruthy();
      });
    });
  });
});
