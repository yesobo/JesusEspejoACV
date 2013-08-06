'use strict'

function appWindow() {
  return document.getElementsByTagName('iframe')[0].contentWindow;
}
function appAngular() {
  return appWindow().angular;
}

describe('Experience View', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should redirect index.html to /', function() {
    browser().navigateTo('/index.html');
    expect(browser().location().url()).toBe('/');
  });

  it('should filter the employments list as user types into the search box', function() {
    expect(repeater('.employment').count()).toBe(5);

    input('query').enter('Bankia');
    expect(repeater('.employment').count()).toBe(1);

    input('query').enter('2012');
    expect(repeater('.employment').count()).toBe(2);
  });

  it('should order the employments list by descending starting date', function() {
    expect(element('.employment:first h2').text()).toBe("Bankia");
  });

  it('should render employment specific links', function() {
    input('query').enter('bankia');
    element('.employment header a').click();
    expect(browser().location().url()).toBe('/experience/Bankia');
  });
});

describe('Experience detail view', function() {
 
    beforeEach(function() {
      browser().navigateTo('/index.html#/experience/Bankia');
    });
 
    it('should display placeholder page with clientName', function() {
      expect(binding('experience.client.name')).toBe('Bankia');
    });
 });
