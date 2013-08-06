'use strict';

angular.module('JesusEspejoACVApp', 
  ['JesusEspejoACVServices', 'JesusEspejoACVDirectives', 'pascalprecht.translate'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/aboutme.html',
      })
      .when('/experience', {
        templateUrl: 'views/main.html',
        controller: 'ExperienceCtrl'
      })
      .when('/experience/:start', {
        templateUrl: 'views/experience-detail.html',
        controller: 'ExperienceDetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]).config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
      /* Nav menu */
      'ABOUT_ME': 'About Me',
      'TECHNICAL_SKILLS': 'Technical Skills',
      'EXPERIENCE': 'Experience',
      'EDUCATION': 'Education',
      'TRAINING': 'Training',

      /* About me */
      'ABOUT_ME_EXPL': 'Proffesional profile & Contact Info',
      'ABOUT_ME_P1': 'Hello, I’m Jesus, web developer and new technologies enthusiast.',
      'ABOUT_ME_P2': 'As you will see, I\'ve spent the last years building websites and enjoying web technologies in my job and spare time. I would love to share my knowledge with you, so please don\'t hesitate in contacting with me if you\'re interested.'
    });
    
    $translateProvider.translations('es', {
      /* Nav menu */
      'ABOUT_ME': 'Sobre mí',
      'TECHNICAL_SKILLS': 'Tecnologías',
      'EXPERIENCE': 'Experiencia',
      'EDUCATION': 'Educación',
      'TRAINING': 'Cursos',

      /* About me */
      'ABOUT_ME_EXPL': 'Perfil profesional e Información de Contacto',
      'ABOUT_ME_P1': 'Hola, soy Jesús, desarrollador web y amante de las nuevas tecnologías.',
      'ABOUT_ME_P2': 'Como verás, he dedicado los últimos años en crear sitios web y disfrutar de las tecnologías web en el trabajo y mi tiempo libre. Me encantaría compartir mis conocimientos contigo, así que no dudes en contactar conmigo si estás interesado.'

    });

    $translateProvider.preferredLanguage('en');
  }]);
