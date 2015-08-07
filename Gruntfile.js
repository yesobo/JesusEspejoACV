/*global require, module: true */
// Generated on 2013-07-14 using generator-angular 0.3.0
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  'use strict';
  return connect.static(require('path').resolve(dir));
};
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  'use strict';
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {
    grunt.log.write('Error getting app name');
  }

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // codio port 3000
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
        // codio hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      options: {
        //The source directory where you keep your Sass stylesheets.
        sassDir: '<%= yeoman.app %>/styles',
        //The target directory where you keep your CSS stylesheets.
        cssDir: '.tmp/styles',
        //The directory where generated images are kept. It is relative to the projectPath.
        generatedImagesDir: '.tmp/images/generated',
        //The directory where you keep your images.
        imagesDir: '<%= yeoman.app %>/images',
        //The directory where you keep your JavaScript files.
        javascriptsDir: '<%= yeoman.app %>/scripts',
        //The directory where you keep your fonts.
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        //Makes files under the specified folder findable by Sass's @import directive.
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    concat: {
      dist: {
        src: ['<%= yeoman.app %>/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js'],
        dest: '<%= yeoman.dist %>/scripts/mybootstrap.js',
        options: {
          banner: '(function(window, document){',
          footer: '})(wrap(window), wrap(document));'
        }
      },
      server: {
        src: ['<%= yeoman.app %>/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js'],
        dest: '.tmp/scripts/mybootstrap.js',
        options: {
          banner: '(function(window, document){',
          footer: '})(wrap(window), wrap(document));'
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/components/{,*/}*.js',
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      // By default, your `index.html` <!-- Usemin Block --> will take care of
      // minification. This option is pre-configured if you do not wish to use
      // Usemin blocks.
      // dist: {
      //   files: {
      //     '<%= yeoman.dist %>/styles/main.css': [
      //       '.tmp/styles/{,*/}*.css',
      //       '<%= yeoman.app %>/styles/{,*/}*.css'
      //     ]
      //   }
      // }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: [
            '*.html',
            'views/*.html',
            'views/{,*/}*.html'
          ],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'components/**/*',
            'images/{,*/}*.{gif,webp,svg}',
            'styles/fonts/*',
            'data/*.*',
            'fonts/*.*',
            'scripts/xhr/*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      }
    },
    concurrent: {
      server: [
        'coffee:dist',
        'compass:server',
        'concat:server'
      ],
      test: [
        'coffee',
        'compass'
      ],
      dist: [
        'coffee',
        'compass:dist',
        'imagemin',
        'htmlmin'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      e2e: {
        configFile: 'karma-e2e.conf.js',
        singleRun: true
      }
    },
    protractor: {
      options: {
        keepAlive: true,
        configFile: 'protractor.conf.js'
      },
      run: {}
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      },
      tmp: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/xhr/my-sticky-kit.js': [
            '<%= yeoman.dist %>/scripts/xhr/my-sticky-kit.js'
          ],
          '<%= yeoman.dist %>/scripts/mybootstrap.js': [
            '<%= yeoman.dist %>/scripts/mybootstrap.js'
          ]
        }
      }
    },
    'ftp-deploy': {
      build: {
        auth: {
          host: 'ftp.strato.com',
          port: 21,
          authKey: 'key1'
        },
        src: 'dist',
        dest: '/',
        exclusions: [
          'dist/bower_components/**',
          'dist/images/**',
        ]
      }
    },
    processhtml: {}
  });

  // Find unused images
  grunt.registerTask('unusedimages', function(){
    var assets = [],
        links = [];

    // Get list of images
    grunt.file.expand(
      {
        filter: 'isFile',
        cwd: 'app/images/' // Change this to your images dir
      },
      ['*.{png,jpg,jpeg,gif,webp,svg}']
    ).forEach(
        function(file){
          assets.push(file);
        }
    );

    // Find images in content
    grunt.file.expand(
      {
        filter: 'isFile'
      },
      [
        'app/scripts/{,*/}*.js',
        'components/{,*/}*.js',
        'app/data/{,*/}*.json',
        'app/styles/{,*/}*.css',
        'app/views/{,*/}*.html'
      ]
    ).forEach(
        function(file){ // Change this to narrow down the search
          var content = grunt.file.read(file);
          assets.forEach(function(asset){
            if(content.search(asset) !== -1){
              links.push(asset);
            }
          });
        }
    );

    // Output unused images
    var unused = grunt.util._.difference(assets, links);
    grunt.log.writeln('Found ' + links.length + ' used images:');
    grunt.log.writeln('Found ' + unused.length + ' unused images:');
    unused.forEach(
      function(el){
        grunt.log.writeln(el);
      }
    );
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([ 'build',
                              // remove open for codio
                              'open',
                              'connect:dist:keepalive'
                            ]);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

/* default generator-angular test
  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);
*/
  // e2e tests workaround
  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'compass',
    'connect:livereload',
    'karma',
    'protractor:run'
  ]);

  grunt.registerTask('test:unit', [
    'clean:server',
    'coffee',
    'compass',
    'connect:livereload',
    'karma:unit'
  ]);

  grunt.registerTask('test:e2e', [
    'clean:server',
    'coffee',
    'compass',
    'connect:livereload',
    'karma:e2e',
    'protractor:run'
  ]);

  grunt.registerTask('test:prot', [
    'clean:server',
    'coffee',
    'compass',
    'connect:livereload',
    'protractor:run'
  ]);

  grunt.registerTask('test:prot_watch', [
    'clean:server',
    'coffee',
    'compass',
    'connect:livereload',
    'protractor:run',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy:dist',
    'cdnify',
    'ngmin', // ng-min is deprecated, use grunt-ng-anotate
    'cssmin',
    'uglify',
    //'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
