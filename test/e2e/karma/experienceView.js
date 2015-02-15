/* global describe, beforeEach, browser, it, expect, repeater, input, expect, element */

describe('Experience View', function() {
  'use strict';

  beforeEach(function() {
    browser().navigateTo('/#/experience');
  });

  it('should filter the employments list as user types into the search box', function() {
    expect(repeater('.employment').count()).toBe(7);

    input('searchQuery').enter('Bankia');

    expect(repeater('.employment').count()).toBe(1);

    input('searchQuery').enter('2012');
    expect(repeater('.employment').count()).toBe(2);
  });

  it('should change the language of period count when clicking on language flag', function() {

    expect(element('#divLangDesk img').attr('src')).toBe('images/lang_spanish.png');

    var elem = element('.periodCount:first > span').text();

    expect(elem).toContain('year');
    expect(elem).toContain('month');

    element('#divLangDesk img').click();

    elem = element('.periodCount:first > span').text();

    expect(elem).toContain('año');
    expect(elem).toContain('mes');
  });

  it('on desktops (991px), should keep the aside content fixed', function() {
    element(':first').query(function(first, done) {
      if(first.outerWidth(true) + 15 > 991) {
        expect(element('.main-left', 'DESKTOP TESTING')
          .css('position')).toBe('fixed');
        done();
      } else {
        expect(element('.main-left', 'PHONE TO WIDE TABLET TESTING')
          .css('position')).not().toBe('fixed');
        done();
      }
    });
  });

  it('should translate the employer.employerName (list group title)', function() {
    browser().navigateTo('/#/projects');
    expect(element('#divLangDesk img').attr('src')).toBe('images/lang_spanish.png');
    var elem = element('.employerName:first').text();
    expect(elem).toContain('Current projects');

    element('#divLangDesk img').click();

    elem = element('.employerName:first').text();
    expect(elem).toContain('Proyectos en desarrollo');
  });
});
