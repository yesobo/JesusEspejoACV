/* global describe, beforeEach, browser, it, element, by, expect, $ : false */
describe('directive:searchButton', function() {
  'use strict';

  beforeEach(function() {
    browser.get('#/experience');
  });

  describe('on desktop', function() {
    it('should clean the search query clicking on the clean button', function() {
      // focus on the input
      var input = element(by.model('searchQuery'));
      input.sendKeys('myQuery');
      $('.close').click();
      expect(input.getAttribute('value')).toBe('');
    });
  });

  describe('on mobile', function() {
    beforeEach(function() {
      var width = 479;
      var height = 600;
      browser.driver.manage().window().setSize(width, height);
    });

    it('should be hidden', function() {
      expect($('#searchForm').isDisplayed()).toBeFalsy();
    });

    describe('once clicked', function() {
      beforeEach(function() {
        var searchIcon = $('.searchButtonContainer');
        searchIcon.click();
      });
      it('should show search', function() {
        expect($('#searchForm').isDisplayed()).toBeTruthy();
      });
      it('should focus search input', function() {
        var input = $('#searchInput');
        expect(input.getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
      });
      it('should hide the search input on blur', function() {
        $('body').click();
        expect($('#searchForm').isDisplayed()).toBeFalsy();
      });

      it('should hide the search input on clear button', function() {
        $('.close').click();
        expect($('#searchForm').isDisplayed()).toBeFalsy();
      });

      it('should clean the search query clicking on the clean button', function() {
        // focus on the input
        var input = element(by.model('searchQuery'));
        input.sendKeys('myQuery');
        $('.close').click();
        expect(input.getAttribute('value')).toBe('');
      });
    });
  });
});
