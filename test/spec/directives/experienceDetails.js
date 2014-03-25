/* global describe, ddescribe, beforeEach, inject, it, expect, $: true */
'use strict';

describe('experienceDetailsDirective', function() {

  beforeEach(module('ExperienceDetailsDirective'));
  
  // load the templates
  beforeEach(module('app/views/templates/experienceDetails.html'));
  // tip: could load the template in a module declared at karma.conf with ngHtml2JsPreprocessor
  
  var $compile, $rootScope, template, element;
  var experienceDetailObj = {
    position : "Programador Web J2EE/EJB/Front-end/Reporting",
    tasks: [
      {
        techs: [
          {name: "tech1"}
        ],
        description: "description1"
      },
      {
        techs: [
          {name: "tech2"}
        ],
        description: "description2"
      },
      {
        techs: [
          {name: "tech3"}
        ],
        description: "description3"
      },
      {
        techs: [
          {name: "tech4"}
        ],
        description: "description4"
      }
    ]
  };

  var experienceDetailJSON = {
    "position" : "Programador Web J2EE/EJB/Front-end/Reporting",
    "tasks": [
      {
        "techs": [
          {"name": "tech1"}
        ],
        "description": "description1"
      },
      {
        "techs": [
          {"name": "tech2"}
        ],
        "description": "description2"
      },
      {
        "techs": [
          {"name": "tech3"}
        ],
        "description": "description3"
      },
      {
        "techs": [
          {"name": "tech4"}
        ],
        "description": "description4"
      }
    ]
  };

  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {
    
    var template = $templateCache.get('app/views/templates/experienceDetails.html');
    $templateCache.put('views/templates/experienceDetails.html', template);
    
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    $rootScope.experienceDetailObj = experienceDetailJSON;
    
    var htmlString = '' +
      '<experience-details details-obj="experienceDetailObj">' + experienceDetailJSON.tasks[0].description + '</experience-details>';
    var elem = angular.element(htmlString);
    element = $compile(elem)($rootScope);
    
    $rootScope.$digest();
  }));

  it('should list the tasks techs of the experience\'s inserted as parameter', function() {

    // .find() is limited to tag name
    var taskTech = element.find('ul').find('li').find('ul').find('li').find('span')[0].innerHTML;
    var numberOfLi = element.children().children().children().length;
    expect(numberOfLi).toBe(experienceDetailObj.tasks.length);
    expect(taskTech).toBe(experienceDetailObj.tasks[0].techs[0].name);
  });

  it('should list the experience\'s tasks descriptions inserted as transcluded content', function() {

    // .find() is limited to tag name
    var transcludeElement = element.find('ul').find('li').find('span').find('span')[0].innerHTML;
    expect(transcludeElement).toBe(experienceDetailObj.tasks[0].description);
  });

});