/* global describe, beforeEach, browser, it, expect, repeater, input, expect */
'use strict';

function appWindow() {
  return document.getElementsByTagName('iframe')[0].contentWindow;
}

describe('Experience View', function() {

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

    expect(element('#ul-lang img').attr('src')).toBe('images/lang_spanish.png');

    var elem = element('.periodCount:first > span').text();

    expect(elem).toContain("year");
    expect(elem).toContain("month");

    element('#ul-lang img').click();

    elem = element('.periodCount:first > span').text();
    
    expect(elem).toContain("año");
    expect(elem).toContain("mes");
  }) 
});