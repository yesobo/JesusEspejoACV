// Karma configuration
module.exports = function(config) {
    config.set({
      // base path, that will be used to resolve files and exclude
      basePath: '',

      frameworks: ['jasmine'],

      // list of files / patterns to load in the browser
      files: [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/bower_components/angular-translate/angular-translate.js',
        'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'app/bower_components/jquery/jquery.js',
        'app/bower_components/oclazyload/dist/ocLazyLoad.js',
        'app/scripts/*.js',
        'app/scripts/**/*.js',
        //'test/mock/**/*.js',
        'test/spec/**/*.js',

        //include the directory where directive templates are stored.
        'app/views/templates/**/*.html'
      ],

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: true,

      // Start these browsers, currently available:
      // - Chrome
      // - ChromeCanary
      // - Firefox
      // - Opera
      // - Safari (only Mac)
      // - PhantomJS
      // - IE (only Windows)
      browsers: ['Chrome'],

      // test results reporter to use
      // possible values: dots || progress || growl
      reporters: ['progress'],

      // generate js files from html templates to expose them during testing.
      preprocessors: {
        'app/views/templates/**/*.html': ['ng-html2js']
      },

      /*
      ngHtml2JsPreprocessor: {
        // strip this from the file path
        stripPrefix: 'public/',
        // prepend this to the
        prependPrefix: 'served/',

        // or define a custom transform function
        cacheIdFromPath: function(filepath) {
          return cacheId;
        },

        // setting this option will create only a single module that contains templates
        // from all the files, so you can load them all with module('foo')
        moduleName: 'foo'
      }
      */

      // list of files to exclude
      exclude: [],

      // web server port
      port: 8080,

      // cli runner port
      runnerPort: 9100,

      // enable / disable colors in the output (reporters and logs)
      colors: true,

      // level of logging
      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      //logLevel: 'DEBUG',

      // If browser does not capture in given timeout [ms], kill it
      captureTimeout: 15000,

      browserNoActivityTimeout: 300000,

      // Continuous Integration mode
      // if true, it capture browsers, run tests and exit
      singleRun: false

    });
};
