describe('Protractor Directives', function() {
  'use strict';
  describe('navmenu', function() {

    beforeEach(function() {
      browser.get('/');
    });

    it('should active the projects menu li when experience not found link clicked', function() {
      browser.get('#/experience');
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
});
