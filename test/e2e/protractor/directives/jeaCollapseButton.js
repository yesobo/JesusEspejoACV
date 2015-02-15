/* global describe, beforeEach, browser, it, element, by, expect : false */
describe('directive:jeaCollapseButton', function() {
  'use strict';

  var hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };

  beforeEach(function() {
    browser.get('#/experience');
  });

  describe('on click', function() {

    var button;

    beforeEach(function() {
      browser.get('#/experience');
      button = element.all(by.css('jea-collapse-button')).first();
      button.click();
    });

    it('should toggle its anchor\'s collapsed class', function() {
      var anchor = button.element(by.css('a'));
      expect(hasClass(anchor, 'collapsed')).toBeFalsy();
    });

    it('should toggle its associated panel', function() {
      var panelid = 'positionDetailsAPBankia';
      expect(button.getAttribute('panelid')).toBe(panelid);
      expect(hasClass(element(by.css('#' + panelid)), 'core-collapse-closed')).toBeFalsy();
    });
  });
});
