'use strict';

angular.module('JesusEspejoACVApp',
  ['ngRoute', 'JesusEspejoACVServices', 'JesusEspejoACVDirectives',
    'JesusEspejoACVControllers', 'JesusEspejoACVFilters',
    'pascalprecht.translate', 'ng-polymer-elements'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/aboutme.html',
      })
      .when('/experience', {
        templateUrl: 'views/experience.html',
        controller: 'ExperienceCtrl'
      })
      .when('/experience/:start', {
        templateUrl: 'views/experience-detail.html',
        controller: 'ExperienceDetailCtrl'
      })
      .when('/projects', {
        templateUrl: 'views/experience.html',
        controller: 'ProjectsCtrl'
      })
      .when('/blog', {
        templateUrl: 'views/blog.html'
        //controller: 'ProjectsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('test', {
      /* Nav menu */
      'WHO_I_AM': 'Quien soy',
      'ABOUT_ME': 'Sobre mí',
      'TECHNICAL_SKILLS': 'Tecnologías',
      'EXPERTISE': 'Tecnologías',
      'EXPERIENCE': 'Experiencia',
      'EDUCATION': 'Educación',
      'TRAINING': 'Cursos',

      /* About me */
      'ABOUT_ME_EXPL': 'Perfil profesional e Información de Contacto',
      'ABOUT_ME_P1': 'Hola, soy Jesús, desarrollador web y amante de las nuevas tecnologías.',
      'ABOUT_ME_P2': 'Como verás, he dedicado los últimos años en crear sitios web y disfrutar de las tecnologías web en el trabajo y mi tiempo libre. Me encantaría compartir mis conocimientos contigo, así que no dudes en contactar conmigo si estás interesado.',

      /* Experience */
      'AT': 'en',
      'PRESENT': 'Hoy',
      'YEAR': 'año',
      'YEARS': 'años',
      'MONTH': 'mes',
      'MONTHS': 'meses',
      'SEARCH': 'buscar'
    });

    $translateProvider.useStaticFilesLoader({
      prefix: '/data/position_',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');
  }]);
