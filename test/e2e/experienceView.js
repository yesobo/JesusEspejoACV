'use strict'

function appWindow() {
  return document.getElementsByTagName('iframe')[0].contentWindow;
}
function appAngular() {
  return appWindow().angular;
}

describe('Experience View', function() {

  beforeEach(function() {
    browser().navigateTo('/#/experience');
  });

  it('should filter the employments list as user types into the search box', function() {
    expect(repeater('.employment').count()).toBe(7);

    input('query').enter('Bankia');
    
    expect(repeater('.employment').count()).toBe(1);

    input('query').enter('2012');
    expect(repeater('.employment').count()).toBe(2);
  });
});