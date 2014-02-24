/* global describe, ddescribe, beforeEach, inject, it, expect, $: true */
'use strict';

ddescribe('experienceDetailsDirective', function() {

  beforeEach(module('ExperienceDetailsDirective'));
  
  // load the templates
  beforeEach(module('app/views/templates/experienceDetails.html'));
  // tip: could load the template in a module declared at karma.conf with ngHtml2JsPreprocessor
  
  var element;

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {
    
    var experienceDetailObj = {
      "position" : "Programador Web J2EE/EJB/Front-end/Reporting",
      "task": [
        {"description": "Diseño y Desarrollo web a partir de maquetas"},
        {"description": "Implementación de lógica de negocio (Session y Entity Beans)"},
        {"description": "Desarrollo de informes pdf con contenido gráfico a partir de maquetas"},
        {"description": "Desarrollo de pruebas unitarias y funcionales"}
      ]
    }

    var template = $templateCache.get('app/views/templates/experienceDetails.html');
    $templateCache.put('views/templates/experienceDetails.html', template);
    var elem = angular.element('<experience-details experience="{{experienceDetailObj}}"></experience-details>');

    var scope = _$rootScope_;
    scope.experienceDetailObj = experienceDetailObj;

    element = _$compile_(elem)(scope);
    scope.$digest();
  }));

  describe('experienceDetails', function() {
    it('should list the experience tasks', function() {
      // .find() is limited to tag name 
      expect($(element.find('ul')[1]).find('li').length).toBe("4");
    });
  });
});
