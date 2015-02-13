(function(angular) {

    angular.module('ng-polymer-elements', [])
    	.config(['$compileProvider', '$injector', function($compileProvider, $injector) {
    		
    		'use strict';

    		// Each mapping is an object where the key is the directive/custom element
    	    // name in camel case and the value is an object where the keys are the
    	    // AngularJS attributes in camel case and the values are objects where the 
    	    // key is the type which can be 'primitive', 'object', 'array' or 'event' 
    	    // and the value is the name of the attribute in the web component.

    	    var inputMappings = {
    	        ngModel: {
    	            primitive: 'value'
    	        },
    	        ngDisabled: {
    	        	primitive: 'disabled'
    	        }
    	    };
    	    
    	    var selectorMappings = {
    	    	ngModel: {
    	    		primitive: 'selected'
    	    	}
    	    };
    	    
    	    var checkMappings = {
    	    	ngModel: {
    	    		primitive: 'checked'
    	    	},
    	        ngDisabled: {
    	        	primitive: 'disabled'
    	        }
    	    };
    	    
    	    var openableMappings = {
    	    	ngOpened: {
    	    		primitive: 'opened'
    	    	}
    	    };

    	    var allMappings = {
    	        paperInput: inputMappings,
    	        paperRadioGroup: selectorMappings,
    	        paperTabs: selectorMappings,
    	        coreSelector: selectorMappings,
    	        coreMenu: selectorMappings,
    	        paperCheckbox: checkMappings,
    	        paperToggleButton: checkMappings,
    	        coreOverlay: openableMappings,
    	        paperDialog: openableMappings,
    	        paperActionDialog: openableMappings,
    	        paperToast: openableMappings,
    	        paperSlider: inputMappings,
    	        coreList: {
    	            ngModel: {
    	                array: 'data'
    	            },
    	            ngTap: {
    	                event: 'core-activate'
    	            }
    	        }
    	    };
    		
    		// Extension point for overriding mappings
    		
    		if($injector.has('$ngPolymerMappings')) {
    			var extendedMappings = $injector.get('$ngPolymerMappings');
    			angular.extend(allMappings, extendedMappings);
    		}
    		
		    // A directive is created for each web component according to the mappings
		    
		    Object.keys(allMappings).forEach(function(tag) {
		        var mappings = allMappings[tag];
		
		        $compileProvider.directive(tag, ['$parse', '$window', function($parse, $window) {
		
		            var scopeDefinition = {};
		
		            var keys = Object.keys(mappings);
		
		            keys.forEach(function(attr) {
		
		                var conf = mappings[attr];
		
		                if(conf.primitive || conf.object || conf.array) {
		                    scopeDefinition[attr] = '=';
		                } else if(!conf.event) {
		                    throw 'Invalid mapping for ' + attr + 
		                    ' - must contain primitive | object | array | event';
		                }
		            });
		
		            return {
		                restrict: 'E',
		                scope: scopeDefinition,
		
		                link: function (scope, element, attrs) {
		
		                    var el = element[0];
		
		                    keys.forEach(function(attr) {
		
		                    	// Don't create bindings for non-existent attributes
		                    	if(!attrs[attr]) {
		                    		return;
		                    	}
		                    	
		                        var conf = mappings[attr];
		
		                        if(conf.event) {
		                        	
		                        	var fn = $parse(attrs[attr]);
		
		                            el.addEventListener(conf.event, function (e) {
		                            	scope.$apply(function() {
		                            		fn(scope.$parent, {$event: e});
		                            	});
		                                
		                            });
		
		                        } else {
		
		                            var propertyName = 
		                            	conf.primitive || conf.object || conf.array;
		
		                            if(conf.object) {
		                                el[propertyName] = {};
		                            } else if(conf.array) {
		                                el[propertyName] = [];
		                            }
		
		                            // Copy the scope property value to the web 
		                            // component's value
		                            
		                            var handler = function(value) {
		                                if(conf.primitive) {
		                            		el[propertyName] = value;
		                                } else {
		                                    angular.copy(value, el[propertyName]);
		                                }
		                            };
		
		                            scope.$watch(attr, handler, true);
		
		                            handler(scope[attr]);
		                            
		                            // Copy the web component's value to the scope 
		                            // property value
		                            
		                            var observer = new PathObserver(el, propertyName);
		
		                            observer.open(function (value) {
		                                scope.$apply(function () {
		                                    if(conf.primitive) {
		                                        scope[attr] = value;
		                                    } else {
		                                        angular.copy(value, scope[attr]);
		                                    }
		                                });
		                            });
		
		                        }
		
		                    });
		                }
		
		            };
		        }]);
		    });
		    
    	}]);
	
})(angular);

/**
 * oclazyload - Load modules on demand (lazy load) with angularJS
 * @version v0.5.1
 * @link https://github.com/ocombe/ocLazyLoad
 * @license MIT
 * @author Olivier Combe <olivier.combe@gmail.com>
 */
(function() {
  'use strict';
  var regModules = ['ng'],
    regInvokes = {},
    regConfigs = [],
    justLoaded = [],
    runBlocks = {},
    ocLazyLoad = angular.module('oc.lazyLoad', ['ng']),
    broadcast = angular.noop;

  ocLazyLoad.provider('$ocLazyLoad', ['$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$injector', '$animateProvider',
    function($controllerProvider, $provide, $compileProvider, $filterProvider, $injector, $animateProvider) {
      var modules = {},
        providers = {
          $controllerProvider: $controllerProvider,
          $compileProvider: $compileProvider,
          $filterProvider: $filterProvider,
          $provide: $provide, // other things
          $injector: $injector,
          $animateProvider: $animateProvider
        },
        anchor = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0],
        jsLoader, cssLoader, templatesLoader,
        debug = false,
        events = false;

      // Let's get the list of loaded modules & components
      init(angular.element(window.document));

      this.$get = ['$log', '$q', '$templateCache', '$http', '$rootElement', '$rootScope', '$cacheFactory', '$interval', function($log, $q, $templateCache, $http, $rootElement, $rootScope, $cacheFactory, $interval) {
        var instanceInjector,
          filesCache = $cacheFactory('ocLazyLoad'),
          uaCssChecked = false,
          useCssLoadPatch = false;

        if(!debug) {
          $log = {};
          $log['error'] = angular.noop;
          $log['warn'] = angular.noop;
          $log['info'] = angular.noop;
        }

        // Make this lazy because at the moment that $get() is called the instance injector hasn't been assigned to the rootElement yet
        providers.getInstanceInjector = function() {
          return (instanceInjector) ? instanceInjector : (instanceInjector = ($rootElement.data('$injector') || angular.injector()));
        };

        broadcast = function broadcast(eventName, params) {
          if(events) {
            $rootScope.$broadcast(eventName, params);
          }
          if(debug) {
            $log.info(eventName, params);
          }
        }

        /**
         * Load a js/css file
         * @param type
         * @param path
         * @returns promise
         */
        var buildElement = function buildElement(type, path, params) {
          var deferred = $q.defer(),
            el, loaded,
            cacheBuster = function cacheBuster(url) {
              var dc = new Date().getTime();
              if(url.indexOf('?') >= 0) {
                if(url.substring(0, url.length - 1) === '&') {
                  return url + '_dc=' + dc;
                }
                return url + '&_dc=' + dc;
              } else {
                return url + '?_dc=' + dc;
              }
            };

          // Store the promise early so the file load can be detected by other parallel lazy loads
          // (ie: multiple routes on one page) a 'true' value isn't sufficient
          // as it causes false positive load results.
          if(angular.isUndefined(filesCache.get(path))) {
            filesCache.put(path, deferred.promise);
          }

          // Switch in case more content types are added later
          switch(type) {
            case 'css':
              el = document.createElement('link');
              el.type = 'text/css';
              el.rel = 'stylesheet';
              el.href = params.cache === false ? cacheBuster(path) : path;
              break;
            case 'js':
              el = document.createElement('script');
              el.src = params.cache === false ? cacheBuster(path) : path;
              break;
            default:
              deferred.reject(new Error('Requested type "' + type + '" is not known. Could not inject "' + path + '"'));
              break;
          }
          el.onload = el['onreadystatechange'] = function(e) {
            if((el['readyState'] && !(/^c|loade/.test(el['readyState']))) || loaded) return;
            el.onload = el['onreadystatechange'] = null
            loaded = 1;
            broadcast('ocLazyLoad.fileLoaded', path);
            deferred.resolve();
          }
          el.onerror = function(e) {
            deferred.reject(new Error('Unable to load ' + path));
          }
          el.async = params.serie ? 0 : 1;

          var insertBeforeElem = anchor.lastChild;
          if(params.insertBefore) {
            var element = angular.element(params.insertBefore);
            if(element && element.length > 0) {
              insertBeforeElem = element[0];
            }
          }
          anchor.insertBefore(el, insertBeforeElem);

          /*
           The event load or readystatechange doesn't fire in:
           - iOS < 6       (default mobile browser)
           - Android < 4.4 (default mobile browser)
           - Safari < 6    (desktop browser)
           */
          if(type == 'css') {
            if(!uaCssChecked) {
              var ua = navigator.userAgent.toLowerCase();

              // iOS < 6
              if(/iP(hone|od|ad)/.test(navigator.platform)) {
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                var iOSVersion = parseFloat([parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)].join('.'));
                useCssLoadPatch = iOSVersion < 6;
              } else if(ua.indexOf("android") > -1) { // Android < 4.4
                var androidVersion = parseFloat(ua.slice(ua.indexOf("android") + 8));
                useCssLoadPatch = androidVersion < 4.4;
              } else if(ua.indexOf('safari') > -1 && ua.indexOf('chrome') == -1) {
                var safariVersion = parseFloat(ua.match(/version\/([\.\d]+)/i)[1]);
                useCssLoadPatch = safariVersion < 6;
              }
            }

            if(useCssLoadPatch) {
              var tries = 1000; // * 20 = 20000 miliseconds
              var interval = $interval(function() {
                try {
                  el.sheet.cssRules;
                  $interval.cancel(interval);
                  el.onload();
                } catch(e) {
                  if(--tries <= 0) {
                    el.onerror();
                  }
                }
              }, 20);
            }
          }

          return deferred.promise;
        }

        if(angular.isUndefined(jsLoader)) {
          /**
           * jsLoader function
           * @type Function
           * @param paths array list of js files to load
           * @param callback to call when everything is loaded. We use a callback and not a promise
           * @param params object config parameters
           * because the user can overwrite jsLoader and it will probably not use promises :(
           */
          jsLoader = function(paths, callback, params) {
            var promises = [];
            angular.forEach(paths, function loading(path) {
              promises.push(buildElement('js', path, params));
            });
            $q.all(promises).then(function success() {
              callback();
            }, function error(err) {
              callback(err);
            });
          }
          jsLoader.ocLazyLoadLoader = true;
        }

        if(angular.isUndefined(cssLoader)) {
          /**
           * cssLoader function
           * @type Function
           * @param paths array list of css files to load
           * @param callback to call when everything is loaded. We use a callback and not a promise
           * @param params object config parameters
           * because the user can overwrite cssLoader and it will probably not use promises :(
           */
          cssLoader = function(paths, callback, params) {
            var promises = [];
            angular.forEach(paths, function loading(path) {
              promises.push(buildElement('css', path, params));
            });
            $q.all(promises).then(function success() {
              callback();
            }, function error(err) {
              callback(err);
            });
          }
          cssLoader.ocLazyLoadLoader = true;
        }

        if(angular.isUndefined(templatesLoader)) {
          /**
           * templatesLoader function
           * @type Function
           * @param paths array list of css files to load
           * @param callback to call when everything is loaded. We use a callback and not a promise
           * @param params object config parameters for $http
           * because the user can overwrite templatesLoader and it will probably not use promises :(
           */
          templatesLoader = function(paths, callback, params) {
            var promises = [];
            angular.forEach(paths, function(url) {
              var deferred = $q.defer();
              promises.push(deferred.promise);
              $http.get(url, params).success(function(data) {
                if(angular.isString(data) && data.length > 0) {
                  angular.forEach(angular.element(data), function(node) {
                    if(node.nodeName === 'SCRIPT' && node.type === 'text/ng-template') {
                      $templateCache.put(node.id, node.innerHTML);
                    }
                  });
                }
                if(angular.isUndefined(filesCache.get(url))) {
                  filesCache.put(url, true);
                }
                deferred.resolve();
              }).error(function(err) {
                deferred.reject(new Error('Unable to load template file "' + url + '": ' + err));
              });
            });
            return $q.all(promises).then(function success() {
              callback();
            }, function error(err) {
              callback(err);
            });
          }
          templatesLoader.ocLazyLoadLoader = true;
        }

        var filesLoader = function(config, params) {
          var cssFiles = [],
            templatesFiles = [],
            jsFiles = [],
            promises = [],
            cachePromise = null;

          angular.extend(params || {}, config);

          var pushFile = function(path) {
            cachePromise = filesCache.get(path);
            if(angular.isUndefined(cachePromise) || params.cache === false) {
              if(/\.css[^\.]*$/.test(path) && cssFiles.indexOf(path) === -1) {
                cssFiles.push(path);
              } else if(/\.(htm|html)[^\.]*$/.test(path) && templatesFiles.indexOf(path) === -1) {
                templatesFiles.push(path);
              } else if(jsFiles.indexOf(path) === -1) {
                jsFiles.push(path);
              }
            } else if(cachePromise) {
              promises.push(cachePromise);
            }
          }

          if(params.serie) {
            pushFile(params.files.shift());
          } else {
            angular.forEach(params.files, function(path) {
              pushFile(path);
            });
          }

          if(cssFiles.length > 0) {
            var cssDeferred = $q.defer();
            cssLoader(cssFiles, function(err) {
              if(angular.isDefined(err) && cssLoader.hasOwnProperty('ocLazyLoadLoader')) {
                $log.error(err);
                cssDeferred.reject(err);
              } else {
                cssDeferred.resolve();
              }
            }, params);
            promises.push(cssDeferred.promise);
          }

          if(templatesFiles.length > 0) {
            var templatesDeferred = $q.defer();
            templatesLoader(templatesFiles, function(err) {
              if(angular.isDefined(err) && templatesLoader.hasOwnProperty('ocLazyLoadLoader')) {
                $log.error(err);
                templatesDeferred.reject(err);
              } else {
                templatesDeferred.resolve();
              }
            }, params);
            promises.push(templatesDeferred.promise);
          }

          if(jsFiles.length > 0) {
            var jsDeferred = $q.defer();
            jsLoader(jsFiles, function(err) {
              if(angular.isDefined(err) && jsLoader.hasOwnProperty('ocLazyLoadLoader')) {
                $log.error(err);
                jsDeferred.reject(err);
              } else {
                jsDeferred.resolve();
              }
            }, params);
            promises.push(jsDeferred.promise);
          }

          if(params.serie && params.files.length > 0) {
            return $q.all(promises).then(function success() {
              return filesLoader(config, params);
            });
          } else {
            return $q.all(promises);
          }
        }

        return {
          /**
           * Let you get a module config object
           * @param moduleName String the name of the module
           * @returns {*}
           */
          getModuleConfig: function(moduleName) {
            if(!angular.isString(moduleName)) {
              throw new Error('You need to give the name of the module to get');
            }
            if(!modules[moduleName]) {
              return null;
            }
            return modules[moduleName];
          },

          /**
           * Let you define a module config object
           * @param moduleConfig Object the module config object
           * @returns {*}
           */
          setModuleConfig: function(moduleConfig) {
            if(!angular.isObject(moduleConfig)) {
              throw new Error('You need to give the module config object to set');
            }
            modules[moduleConfig.name] = moduleConfig;
            return moduleConfig;
          },

          /**
           * Returns the list of loaded modules
           * @returns {string[]}
           */
          getModules: function() {
            return regModules;
          },

          /**
           * Let you check if a module has been loaded into Angular or not
           * @param modulesNames String/Object a module name, or a list of module names
           * @returns {boolean}
           */
          isLoaded: function(modulesNames) {
            var moduleLoaded = function(module) {
              var isLoaded = regModules.indexOf(module) > -1;
              if(!isLoaded) {
                isLoaded = !!moduleExists(module);
              }
              return isLoaded;
            }
            if(angular.isString(modulesNames)) {
              modulesNames = [modulesNames];
            }
            if(angular.isArray(modulesNames)) {
              var i, len;
              for(i = 0, len = modulesNames.length; i < len; i++) {
                if(!moduleLoaded(modulesNames[i])) {
                  return false;
                }
              }
              return true;
            } else {
              throw new Error('You need to define the module(s) name(s)');
            }
          },

          /**
           * Load a module or a list of modules into Angular
           * @param module Mixed the name of a predefined module config object, or a module config object, or an array of either
           * @param params Object optional parameters
           * @returns promise
           */
          load: function(module, params) {
            var self = this,
              config = null,
              moduleCache = [],
              deferredList = [],
              deferred = $q.defer(),
              moduleName,
              errText;

            if(angular.isUndefined(params)) {
              params = {};
            }

            // If module is an array, break it down
            if(angular.isArray(module)) {
              // Resubmit each entry as a single module
              angular.forEach(module, function(m) {
                if(m) {
                  deferredList.push(self.load(m, params));
                }
              });

              // Resolve the promise once everything has loaded
              $q.all(deferredList).then(function success() {
                deferred.resolve(module);
              }, function error(err) {
                deferred.reject(err);
              });

              return deferred.promise;
            }

            moduleName = getModuleName(module);

            // Get or Set a configuration depending on what was passed in
            if(typeof module === 'string') {
              config = self.getModuleConfig(module);
              if(!config) {
                config = {
                  files: [module]
                };
                moduleName = null;
              }
            } else if(typeof module === 'object') {
              config = self.setModuleConfig(module);
            }

            if(config === null) {
              errText = 'Module "' + moduleName + '" is not configured, cannot load.';
              $log.error(errText);
              deferred.reject(new Error(errText));
            } else {
              // deprecated
              if(angular.isDefined(config.template)) {
                if(angular.isUndefined(config.files)) {
                  config.files = [];
                }
                if(angular.isString(config.template)) {
                  config.files.push(config.template);
                } else if(angular.isArray(config.template)) {
                  config.files.concat(config.template);
                }
              }
            }

            moduleCache.push = function(value) {
              if(this.indexOf(value) === -1) {
                Array.prototype.push.apply(this, arguments);
              }
            };

            // If this module has been loaded before, re-use it.
            if(angular.isDefined(moduleName) && moduleExists(moduleName) && regModules.indexOf(moduleName) !== -1) {
              moduleCache.push(moduleName);

              // if we don't want to load new files, resolve here
              if(angular.isUndefined(config.files)) {
                deferred.resolve();
                return deferred.promise;
              }
            }

            var localParams = {};
            angular.extend(localParams, params, config);

            var loadDependencies = function loadDependencies(module) {
              var moduleName,
                loadedModule,
                requires,
                diff,
                promisesList = [];

              moduleName = getModuleName(module);
              if(moduleName === null) {
                return $q.when();
              } else {
                try {
                  loadedModule = getModule(moduleName);
                } catch(e) {
                  var deferred = $q.defer();
                  $log.error(e.message);
                  deferred.reject(e);
                  return deferred.promise;
                }
                requires = getRequires(loadedModule);
              }

              angular.forEach(requires, function(requireEntry) {
                // If no configuration is provided, try and find one from a previous load.
                // If there isn't one, bail and let the normal flow run
                if(typeof requireEntry === 'string') {
                  var config = self.getModuleConfig(requireEntry);
                  if(config === null) {
                    moduleCache.push(requireEntry); // We don't know about this module, but something else might, so push it anyway.
                    return;
                  }
                  requireEntry = config;
                }

                // Check if this dependency has been loaded previously
                if(moduleExists(requireEntry.name)) {
                  if(typeof module !== 'string') {
                    // compare against the already loaded module to see if the new definition adds any new files
                    diff = requireEntry.files.filter(function(n) {
                      return self.getModuleConfig(requireEntry.name).files.indexOf(n) < 0;
                    });

                    // If the module was redefined, advise via the console
                    if(diff.length !== 0) {
                      $log.warn('Module "', moduleName, '" attempted to redefine configuration for dependency. "', requireEntry.name, '"\n Additional Files Loaded:', diff);
                    }

                    // Push everything to the file loader, it will weed out the duplicates.
                    promisesList.push(filesLoader(requireEntry.files, localParams).then(function() {
                      return loadDependencies(requireEntry);
                    }));
                  }
                  return;
                } else if(typeof requireEntry === 'object') {
                  if(requireEntry.hasOwnProperty('name') && requireEntry['name']) {
                    // The dependency doesn't exist in the module cache and is a new configuration, so store and push it.
                    self.setModuleConfig(requireEntry);
                    moduleCache.push(requireEntry['name']);
                  }

                  // CSS Loading Handler
                  if(requireEntry.hasOwnProperty('css') && requireEntry['css'].length !== 0) {
                    // Locate the document insertion point
                    angular.forEach(requireEntry['css'], function(path) {
                      buildElement('css', path, localParams);
                    });
                  }
                  // CSS End.
                }

                // Check if the dependency has any files that need to be loaded. If there are, push a new promise to the promise list.
                if(requireEntry.hasOwnProperty('files') && requireEntry.files.length !== 0) {
                  if(requireEntry.files) {
                    promisesList.push(filesLoader(requireEntry, localParams).then(function() {
                      return loadDependencies(requireEntry);
                    }));
                  }
                }
              });

              // Create a wrapper promise to watch the promise list and resolve it once everything is done.
              return $q.all(promisesList);
            }

            filesLoader(config, localParams).then(function success() {
              if(moduleName === null) {
                deferred.resolve(module);
              } else {
                moduleCache.push(moduleName);
                loadDependencies(moduleName).then(function success() {
                  try {
                    justLoaded = [];
                    register(providers, moduleCache, localParams);
                  } catch(e) {
                    $log.error(e.message);
                    deferred.reject(e);
                    return;
                  }
                  deferred.resolve(module);
                }, function error(err) {
                  deferred.reject(err);
                });
              }
            }, function error(err) {
              deferred.reject(err);
            });

            return deferred.promise;
          }
        };
      }];

      this.config = function(config) {
        if(angular.isDefined(config.jsLoader) || angular.isDefined(config.asyncLoader)) {
          if(!angular.isFunction(config.jsLoader || config.asyncLoader)) {
            throw('The js loader needs to be a function');
          }
          jsLoader = config.jsLoader || config.asyncLoader;
        }

        if(angular.isDefined(config.cssLoader)) {
          if(!angular.isFunction(config.cssLoader)) {
            throw('The css loader needs to be a function');
          }
          cssLoader = config.cssLoader;
        }

        if(angular.isDefined(config.templatesLoader)) {
          if(!angular.isFunction(config.templatesLoader)) {
            throw('The template loader needs to be a function');
          }
          templatesLoader = config.templatesLoader;
        }

        // for bootstrap apps, we need to define the main module name
        if(angular.isDefined(config.loadedModules)) {
          var addRegModule = function(loadedModule) {
            if(regModules.indexOf(loadedModule) < 0) {
              regModules.push(loadedModule);
              angular.forEach(angular.module(loadedModule).requires, addRegModule);
            }
          };
          angular.forEach(config.loadedModules, addRegModule);
        }

        // If we want to define modules configs
        if(angular.isDefined(config.modules)) {
          if(angular.isArray(config.modules)) {
            angular.forEach(config.modules, function(moduleConfig) {
              modules[moduleConfig.name] = moduleConfig;
            });
          } else {
            modules[config.modules.name] = config.modules;
          }
        }

        if(angular.isDefined(config.debug)) {
          debug = config.debug;
        }

        if(angular.isDefined(config.events)) {
          events = config.events;
        }
      };
    }]);

  ocLazyLoad.directive('ocLazyLoad', ['$ocLazyLoad', '$compile', '$animate', '$parse',
    function($ocLazyLoad, $compile, $animate, $parse) {
      return {
        restrict: 'A',
        terminal: true,
        priority: 1000,
        compile: function(element, attrs) {
          // we store the content and remove it before compilation
          var content = element[0].innerHTML;
          element.html('');

          return function($scope, $element, $attr) {
            var model = $parse($attr.ocLazyLoad);
            $scope.$watch(function() {
              // it can be a module name (string), an object, an array, or a scope reference to any of this
              return model($scope) || $attr.ocLazyLoad;
            }, function(moduleName) {
              if(angular.isDefined(moduleName)) {
                $ocLazyLoad.load(moduleName).then(function success(moduleConfig) {
                  $animate.enter($compile(content)($scope), null, $element);
                });
              }
            }, true);
          };
        }
      };
    }]);

  /**
   * Get the list of required modules/services/... for this module
   * @param module
   * @returns {Array}
   */
  function getRequires(module) {
    var requires = [];
    angular.forEach(module.requires, function(requireModule) {
      if(regModules.indexOf(requireModule) === -1) {
        requires.push(requireModule);
      }
    });
    return requires;
  }

  /**
   * Check if a module exists and returns it if it does
   * @param moduleName
   * @returns {boolean}
   */
  function moduleExists(moduleName) {
    try {
      return angular.module(moduleName);
    } catch(e) {
      if(/No module/.test(e) || (e.message.indexOf('$injector:nomod') > -1)) {
        return false;
      }
    }
  }

  function getModule(moduleName) {
    try {
      return angular.module(moduleName);
    } catch(e) {
      // this error message really suxx
      if(/No module/.test(e) || (e.message.indexOf('$injector:nomod') > -1)) {
        e.message = 'The module "' + moduleName + '" that you are trying to load does not exist. ' + e.message
      }
      throw e;
    }
  }

  function invokeQueue(providers, queue, moduleName, reconfig) {
    if(!queue) {
      return;
    }

    var i, len, args, provider;
    for(i = 0, len = queue.length; i < len; i++) {
      args = queue[i];
      if(angular.isArray(args)) {
        if(providers !== null) {
          if(providers.hasOwnProperty(args[0])) {
            provider = providers[args[0]];
          } else {
            throw new Error('unsupported provider ' + args[0]);
          }
        }
        var isNew = registerInvokeList(args, moduleName);
        if(args[1] !== 'invoke') {
          if(isNew && angular.isDefined(provider)) {
            provider[args[1]].apply(provider, args[2]);
          }
        } else { // config block
          var callInvoke = function(fct) {
            var invoked = regConfigs.indexOf(moduleName + '-' + fct);
            if(invoked === -1 || reconfig) {
              if(invoked === -1) {
                regConfigs.push(moduleName + '-' + fct);
              }
              if(angular.isDefined(provider)) {
                provider[args[1]].apply(provider, args[2]);
              }
            }
          }
          if(angular.isFunction(args[2][0])) {
            callInvoke(args[2][0]);
          } else if(angular.isArray(args[2][0])) {
            for(var j = 0, jlen = args[2][0].length; j < jlen; j++) {
              if(angular.isFunction(args[2][0][j])) {
                callInvoke(args[2][0][j]);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Register a new module and load it
   * @param providers
   * @param registerModules
   * @returns {*}
   */
  function register(providers, registerModules, params) {
    if(registerModules) {
      var k, r, moduleName, moduleFn, tempRunBlocks = [];
      for(k = registerModules.length - 1; k >= 0; k--) {
        moduleName = registerModules[k];
        if(typeof moduleName !== 'string') {
          moduleName = getModuleName(moduleName);
        }
        if(!moduleName || justLoaded.indexOf(moduleName) !== -1) {
          continue;
        }
        var newModule = regModules.indexOf(moduleName) === -1;
        moduleFn = angular.module(moduleName);
        if(newModule) { // new module
          regModules.push(moduleName);
          register(providers, moduleFn.requires, params);
        }
        if(moduleFn._runBlocks.length > 0) {
          // new run blocks detected! Replace the old ones (if existing)
          runBlocks[moduleName] = [];
          while(moduleFn._runBlocks.length > 0) {
            runBlocks[moduleName].push(moduleFn._runBlocks.shift());
          }
        }
        if(angular.isDefined(runBlocks[moduleName]) && (newModule || params.rerun)) {
          tempRunBlocks = tempRunBlocks.concat(runBlocks[moduleName]);
        }
        invokeQueue(providers, moduleFn._invokeQueue, moduleName, params.reconfig);
        invokeQueue(providers, moduleFn._configBlocks, moduleName, params.reconfig); // angular 1.3+
        broadcast(newModule ? 'ocLazyLoad.moduleLoaded' : 'ocLazyLoad.moduleReloaded', moduleName);
        registerModules.pop();
        justLoaded.push(moduleName);
      }
      // execute the run blocks at the end
      var instanceInjector = providers.getInstanceInjector();
      angular.forEach(tempRunBlocks, function(fn) {
        instanceInjector.invoke(fn);
      });
    }
  }

  /**
   * Register an invoke
   * @param args
   * @returns {*}
   */
  function registerInvokeList(args, moduleName) {
    var invokeList = args[2][0],
      type = args[1],
      newInvoke = false;
    if(angular.isUndefined(regInvokes[moduleName])) {
      regInvokes[moduleName] = {};
    }
    if(angular.isUndefined(regInvokes[moduleName][type])) {
      regInvokes[moduleName][type] = [];
    }
    var onInvoke = function(invokeName) {
      newInvoke = true;
      regInvokes[moduleName][type].push(invokeName);
      broadcast('ocLazyLoad.componentLoaded', [moduleName, type, invokeName]);
    }
    if(angular.isString(invokeList) && regInvokes[moduleName][type].indexOf(invokeList) === -1) {
      onInvoke(invokeList);
    } else if(angular.isObject(invokeList)) {
      angular.forEach(invokeList, function(invoke) {
        if(angular.isString(invoke) && regInvokes[moduleName][type].indexOf(invoke) === -1) {
          onInvoke(invoke);
        }
      });
    } else {
      return false;
    }
    return newInvoke;
  }

  function getModuleName(module) {
    var moduleName = null;
    if(angular.isString(module)) {
      moduleName = module;
    } else if(angular.isObject(module) && module.hasOwnProperty('name') && angular.isString(module.name)) {
      moduleName = module.name;
    }
    return moduleName;
  }

  /**
   * Get the list of existing registered modules
   * @param element
   */
  function init(element) {
    var elements = [element],
      appElement,
      moduleName,
      names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],
      NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;

    function append(elm) {
      return (elm && elements.push(elm));
    }

    angular.forEach(names, function(name) {
      names[name] = true;
      append(document.getElementById(name));
      name = name.replace(':', '\\:');
      if(element[0].querySelectorAll) {
        angular.forEach(element[0].querySelectorAll('.' + name), append);
        angular.forEach(element[0].querySelectorAll('.' + name + '\\:'), append);
        angular.forEach(element[0].querySelectorAll('[' + name + ']'), append);
      }
    });

    //TODO: search the script tags for angular.bootstrap
    angular.forEach(elements, function(elm) {
      if(!appElement) {
        var className = ' ' + element.className + ' ';
        var match = NG_APP_CLASS_REGEXP.exec(className);
        if(match) {
          appElement = elm;
          moduleName = (match[2] || '').replace(/\s+/g, ',');
        } else {
          angular.forEach(elm.attributes, function(attr) {
            if(!appElement && names[attr.name]) {
              appElement = elm;
              moduleName = attr.value;
            }
          });
        }
      }
    });

    if(appElement) {
      (function addReg(moduleName) {
        if(regModules.indexOf(moduleName) === -1) {
          // register existing modules
          regModules.push(moduleName);
          var mainModule = angular.module(moduleName);

          // register existing components (directives, services, ...)
          invokeQueue(null, mainModule._invokeQueue, moduleName);
          invokeQueue(null, mainModule._configBlocks, moduleName); // angular 1.3+

          angular.forEach(mainModule.requires, addReg);
        }
      })(moduleName);
    }
  }

  // Array.indexOf polyfill for IE8
  if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

      var k;

      // 1. Let O be the result of calling ToObject passing
      //    the this value as the argument.
      if(this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get
      //    internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If len is 0, return -1.
      if(len === 0) {
        return -1;
      }

      // 5. If argument fromIndex was passed let n be
      //    ToInteger(fromIndex); else let n be 0.
      var n = +fromIndex || 0;

      if(Math.abs(n) === Infinity) {
        n = 0;
      }

      // 6. If n >= len, return -1.
      if(n >= len) {
        return -1;
      }

      // 7. If n >= 0, then Let k be n.
      // 8. Else, n<0, Let k be len - abs(n).
      //    If k is less than 0, then let k be 0.
      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      // 9. Repeat, while k < len
      while(k < len) {
        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the
        //    HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        //    i.  Let elementK be the result of calling the Get
        //        internal method of O with the argument ToString(k).
        //   ii.  Let same be the result of applying the
        //        Strict Equality Comparison Algorithm to
        //        searchElement and elementK.
        //  iii.  If same is true, return k.
        if(k in O && O[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  }
})();

/**
 * @license AngularJS v1.3.0
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $resourceMinErr = angular.$$minErr('$resource');

// Helper functions and regex to lookup a dotted path on an object
// stopping at undefined/null.  The path must be composed of ASCII
// identifiers (just like $parse)
var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;

function isValidDottedPath(path) {
  return (path != null && path !== '' && path !== 'hasOwnProperty' &&
      MEMBER_NAME_REGEX.test('.' + path));
}

function lookupDottedPath(obj, path) {
  if (!isValidDottedPath(path)) {
    throw $resourceMinErr('badmember', 'Dotted member path "@{0}" is invalid.', path);
  }
  var keys = path.split('.');
  for (var i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
    var key = keys[i];
    obj = (obj !== null) ? obj[key] : undefined;
  }
  return obj;
}

/**
 * Create a shallow copy of an object and clear other fields from the destination
 */
function shallowClearAndCopy(src, dst) {
  dst = dst || {};

  angular.forEach(dst, function(value, key){
    delete dst[key];
  });

  for (var key in src) {
    if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
      dst[key] = src[key];
    }
  }

  return dst;
}

/**
 * @ngdoc module
 * @name ngResource
 * @description
 *
 * # ngResource
 *
 * The `ngResource` module provides interaction support with RESTful services
 * via the $resource service.
 *
 *
 * <div doc-module-components="ngResource"></div>
 *
 * See {@link ngResource.$resource `$resource`} for usage.
 */

/**
 * @ngdoc service
 * @name $resource
 * @requires $http
 *
 * @description
 * A factory which creates a resource object that lets you interact with
 * [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer) server-side data sources.
 *
 * The returned resource object has action methods which provide high-level behaviors without
 * the need to interact with the low level {@link ng.$http $http} service.
 *
 * Requires the {@link ngResource `ngResource`} module to be installed.
 *
 * By default, trailing slashes will be stripped from the calculated URLs,
 * which can pose problems with server backends that do not expect that
 * behavior.  This can be disabled by configuring the `$resourceProvider` like
 * this:
 *
 * ```js
     app.config(['$resourceProvider', function ($resourceProvider) {
       // Don't strip trailing slashes from calculated URLs
       $resourceProvider.defaults.stripTrailingSlashes = false;
     }]);
 * ```
 *
 * @param {string} url A parametrized URL template with parameters prefixed by `:` as in
 *   `/user/:username`. If you are using a URL with a port number (e.g.
 *   `http://example.com:8080/api`), it will be respected.
 *
 *   If you are using a url with a suffix, just add the suffix, like this:
 *   `$resource('http://example.com/resource.json')` or `$resource('http://example.com/:id.json')`
 *   or even `$resource('http://example.com/resource/:resource_id.:format')`
 *   If the parameter before the suffix is empty, :resource_id in this case, then the `/.` will be
 *   collapsed down to a single `.`.  If you need this sequence to appear and not collapse then you
 *   can escape it with `/\.`.
 *
 * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
 *   `actions` methods. If any of the parameter value is a function, it will be executed every time
 *   when a param value needs to be obtained for a request (unless the param was overridden).
 *
 *   Each key value in the parameter object is first bound to url template if present and then any
 *   excess keys are appended to the url search query after the `?`.
 *
 *   Given a template `/path/:verb` and parameter `{verb:'greet', salutation:'Hello'}` results in
 *   URL `/path/greet?salutation=Hello`.
 *
 *   If the parameter value is prefixed with `@` then the value for that parameter will be extracted
 *   from the corresponding property on the `data` object (provided when calling an action method).  For
 *   example, if the `defaultParam` object is `{someParam: '@someProp'}` then the value of `someParam`
 *   will be `data.someProp`.
 *
 * @param {Object.<Object>=} actions Hash with declaration of custom action that should extend
 *   the default set of resource actions. The declaration should be created in the format of {@link
 *   ng.$http#usage $http.config}:
 *
 *       {action1: {method:?, params:?, isArray:?, headers:?, ...},
 *        action2: {method:?, params:?, isArray:?, headers:?, ...},
 *        ...}
 *
 *   Where:
 *
 *   - **`action`** – {string} – The name of action. This name becomes the name of the method on
 *     your resource object.
 *   - **`method`** – {string} – Case insensitive HTTP method (e.g. `GET`, `POST`, `PUT`,
 *     `DELETE`, `JSONP`, etc).
 *   - **`params`** – {Object=} – Optional set of pre-bound parameters for this action. If any of
 *     the parameter value is a function, it will be executed every time when a param value needs to
 *     be obtained for a request (unless the param was overridden).
 *   - **`url`** – {string} – action specific `url` override. The url templating is supported just
 *     like for the resource-level urls.
 *   - **`isArray`** – {boolean=} – If true then the returned object for this action is an array,
 *     see `returns` section.
 *   - **`transformRequest`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     request body and headers and returns its transformed (typically serialized) version.
 *     By default, transformRequest will contain one function that checks if the request data is
 *     an object and serializes to using `angular.toJson`. To prevent this behavior, set
 *     `transformRequest` to an empty array: `transformRequest: []`
 *   - **`transformResponse`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     response body and headers and returns its transformed (typically deserialized) version.
 *     By default, transformResponse will contain one function that checks if the response looks like
 *     a JSON string and deserializes it using `angular.fromJson`. To prevent this behavior, set
 *     `transformResponse` to an empty array: `transformResponse: []`
 *   - **`cache`** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
 *     GET request, otherwise if a cache instance built with
 *     {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
 *     caching.
 *   - **`timeout`** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise} that
 *     should abort the request when resolved.
 *   - **`withCredentials`** - `{boolean}` - whether to set the `withCredentials` flag on the
 *     XHR object. See
 *     [requests with credentials](https://developer.mozilla.org/en/http_access_control#section_5)
 *     for more information.
 *   - **`responseType`** - `{string}` - see
 *     [requestType](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType).
 *   - **`interceptor`** - `{Object=}` - The interceptor object has two optional methods -
 *     `response` and `responseError`. Both `response` and `responseError` interceptors get called
 *     with `http response` object. See {@link ng.$http $http interceptors}.
 *
 * @param {Object} options Hash with custom settings that should extend the
 *   default `$resourceProvider` behavior.  The only supported option is
 *
 *   Where:
 *
 *   - **`stripTrailingSlashes`** – {boolean} – If true then the trailing
 *   slashes from any calculated URL will be stripped. (Defaults to true.)
 *
 * @returns {Object} A resource "class" object with methods for the default set of resource actions
 *   optionally extended with custom `actions`. The default set contains these actions:
 *   ```js
 *   { 'get':    {method:'GET'},
 *     'save':   {method:'POST'},
 *     'query':  {method:'GET', isArray:true},
 *     'remove': {method:'DELETE'},
 *     'delete': {method:'DELETE'} };
 *   ```
 *
 *   Calling these methods invoke an {@link ng.$http} with the specified http method,
 *   destination and parameters. When the data is returned from the server then the object is an
 *   instance of the resource class. The actions `save`, `remove` and `delete` are available on it
 *   as  methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
 *   read, update, delete) on server-side data like this:
 *   ```js
 *   var User = $resource('/user/:userId', {userId:'@id'});
 *   var user = User.get({userId:123}, function() {
 *     user.abc = true;
 *     user.$save();
 *   });
 *   ```
 *
 *   It is important to realize that invoking a $resource object method immediately returns an
 *   empty reference (object or array depending on `isArray`). Once the data is returned from the
 *   server the existing reference is populated with the actual data. This is a useful trick since
 *   usually the resource is assigned to a model which is then rendered by the view. Having an empty
 *   object results in no rendering, once the data arrives from the server then the object is
 *   populated with the data and the view automatically re-renders itself showing the new data. This
 *   means that in most cases one never has to write a callback function for the action methods.
 *
 *   The action methods on the class object or instance object can be invoked with the following
 *   parameters:
 *
 *   - HTTP GET "class" actions: `Resource.action([parameters], [success], [error])`
 *   - non-GET "class" actions: `Resource.action([parameters], postData, [success], [error])`
 *   - non-GET instance actions:  `instance.$action([parameters], [success], [error])`
 *
 *   Success callback is called with (value, responseHeaders) arguments. Error callback is called
 *   with (httpResponse) argument.
 *
 *   Class actions return empty instance (with additional properties below).
 *   Instance actions return promise of the action.
 *
 *   The Resource instances and collection have these additional properties:
 *
 *   - `$promise`: the {@link ng.$q promise} of the original server interaction that created this
 *     instance or collection.
 *
 *     On success, the promise is resolved with the same resource instance or collection object,
 *     updated with data from server. This makes it easy to use in
 *     {@link ngRoute.$routeProvider resolve section of $routeProvider.when()} to defer view
 *     rendering until the resource(s) are loaded.
 *
 *     On failure, the promise is resolved with the {@link ng.$http http response} object, without
 *     the `resource` property.
 *
 *     If an interceptor object was provided, the promise will instead be resolved with the value
 *     returned by the interceptor.
 *
 *   - `$resolved`: `true` after first server interaction is completed (either with success or
 *      rejection), `false` before that. Knowing if the Resource has been resolved is useful in
 *      data-binding.
 *
 * @example
 *
 * # Credit card resource
 *
 * ```js
     // Define CreditCard class
     var CreditCard = $resource('/user/:userId/card/:cardId',
      {userId:123, cardId:'@id'}, {
       charge: {method:'POST', params:{charge:true}}
      });

     // We can retrieve a collection from the server
     var cards = CreditCard.query(function() {
       // GET: /user/123/card
       // server returns: [ {id:456, number:'1234', name:'Smith'} ];

       var card = cards[0];
       // each item is an instance of CreditCard
       expect(card instanceof CreditCard).toEqual(true);
       card.name = "J. Smith";
       // non GET methods are mapped onto the instances
       card.$save();
       // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
       // server returns: {id:456, number:'1234', name: 'J. Smith'};

       // our custom method is mapped as well.
       card.$charge({amount:9.99});
       // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
     });

     // we can create an instance as well
     var newCard = new CreditCard({number:'0123'});
     newCard.name = "Mike Smith";
     newCard.$save();
     // POST: /user/123/card {number:'0123', name:'Mike Smith'}
     // server returns: {id:789, number:'0123', name: 'Mike Smith'};
     expect(newCard.id).toEqual(789);
 * ```
 *
 * The object returned from this function execution is a resource "class" which has "static" method
 * for each action in the definition.
 *
 * Calling these methods invoke `$http` on the `url` template with the given `method`, `params` and
 * `headers`.
 * When the data is returned from the server then the object is an instance of the resource type and
 * all of the non-GET methods are available with `$` prefix. This allows you to easily support CRUD
 * operations (create, read, update, delete) on server-side data.

   ```js
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123}, function(user) {
       user.abc = true;
       user.$save();
     });
   ```
 *
 * It's worth noting that the success callback for `get`, `query` and other methods gets passed
 * in the response that came from the server as well as $http header getter function, so one
 * could rewrite the above example and get access to http headers as:
 *
   ```js
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123}, function(u, getResponseHeaders){
       u.abc = true;
       u.$save(function(u, putResponseHeaders) {
         //u => saved user object
         //putResponseHeaders => $http header getter
       });
     });
   ```
 *
 * You can also access the raw `$http` promise via the `$promise` property on the object returned
 *
   ```
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123})
         .$promise.then(function(user) {
           $scope.user = user;
         });
   ```

 * # Creating a custom 'PUT' request
 * In this example we create a custom method on our resource to make a PUT request
 * ```js
 *    var app = angular.module('app', ['ngResource', 'ngRoute']);
 *
 *    // Some APIs expect a PUT request in the format URL/object/ID
 *    // Here we are creating an 'update' method
 *    app.factory('Notes', ['$resource', function($resource) {
 *    return $resource('/notes/:id', null,
 *        {
 *            'update': { method:'PUT' }
 *        });
 *    }]);
 *
 *    // In our controller we get the ID from the URL using ngRoute and $routeParams
 *    // We pass in $routeParams and our Notes factory along with $scope
 *    app.controller('NotesCtrl', ['$scope', '$routeParams', 'Notes',
                                      function($scope, $routeParams, Notes) {
 *    // First get a note object from the factory
 *    var note = Notes.get({ id:$routeParams.id });
 *    $id = note.id;
 *
 *    // Now call update passing in the ID first then the object you are updating
 *    Notes.update({ id:$id }, note);
 *
 *    // This will PUT /notes/ID with the note object in the request payload
 *    }]);
 * ```
 */
angular.module('ngResource', ['ng']).
  provider('$resource', function () {
    var provider = this;

    this.defaults = {
      // Strip slashes by default
      stripTrailingSlashes: true,

      // Default actions configuration
      actions: {
        'get': {method: 'GET'},
        'save': {method: 'POST'},
        'query': {method: 'GET', isArray: true},
        'remove': {method: 'DELETE'},
        'delete': {method: 'DELETE'}
      }
    };

    this.$get = ['$http', '$q', function ($http, $q) {

      var noop = angular.noop,
        forEach = angular.forEach,
        extend = angular.extend,
        copy = angular.copy,
        isFunction = angular.isFunction;

      /**
       * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
       * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
       * (pchar) allowed in path segments:
       *    segment       = *pchar
       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
       *    pct-encoded   = "%" HEXDIG HEXDIG
       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
       *                     / "*" / "+" / "," / ";" / "="
       */
      function encodeUriSegment(val) {
        return encodeUriQuery(val, true).
          replace(/%26/gi, '&').
          replace(/%3D/gi, '=').
          replace(/%2B/gi, '+');
      }


      /**
       * This method is intended for encoding *key* or *value* parts of query component. We need a
       * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
       * have to be encoded per http://tools.ietf.org/html/rfc3986:
       *    query       = *( pchar / "/" / "?" )
       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
       *    pct-encoded   = "%" HEXDIG HEXDIG
       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
       *                     / "*" / "+" / "," / ";" / "="
       */
      function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).
          replace(/%40/gi, '@').
          replace(/%3A/gi, ':').
          replace(/%24/g, '$').
          replace(/%2C/gi, ',').
          replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
      }

      function Route(template, defaults) {
        this.template = template;
        this.defaults = extend({}, provider.defaults, defaults);
        this.urlParams = {};
      }

      Route.prototype = {
        setUrlParams: function (config, params, actionUrl) {
          var self = this,
            url = actionUrl || self.template,
            val,
            encodedVal;

          var urlParams = self.urlParams = {};
          forEach(url.split(/\W/), function (param) {
            if (param === 'hasOwnProperty') {
              throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
            }
            if (!(new RegExp("^\\d+$").test(param)) && param &&
              (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
              urlParams[param] = true;
            }
          });
          url = url.replace(/\\:/g, ':');

          params = params || {};
          forEach(self.urlParams, function (_, urlParam) {
            val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
            if (angular.isDefined(val) && val !== null) {
              encodedVal = encodeUriSegment(val);
              url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function (match, p1) {
                return encodedVal + p1;
              });
            } else {
              url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function (match,
                  leadingSlashes, tail) {
                if (tail.charAt(0) == '/') {
                  return tail;
                } else {
                  return leadingSlashes + tail;
                }
              });
            }
          });

          // strip trailing slashes and set the url (unless this behavior is specifically disabled)
          if (self.defaults.stripTrailingSlashes) {
            url = url.replace(/\/+$/, '') || '/';
          }

          // then replace collapse `/.` if found in the last URL path segment before the query
          // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
          url = url.replace(/\/\.(?=\w+($|\?))/, '.');
          // replace escaped `/\.` with `/.`
          config.url = url.replace(/\/\\\./, '/.');


          // set params - delegate param encoding to $http
          forEach(params, function (value, key) {
            if (!self.urlParams[key]) {
              config.params = config.params || {};
              config.params[key] = value;
            }
          });
        }
      };


      function resourceFactory(url, paramDefaults, actions, options) {
        var route = new Route(url, options);

        actions = extend({}, provider.defaults.actions, actions);

        function extractParams(data, actionParams) {
          var ids = {};
          actionParams = extend({}, paramDefaults, actionParams);
          forEach(actionParams, function (value, key) {
            if (isFunction(value)) { value = value(); }
            ids[key] = value && value.charAt && value.charAt(0) == '@' ?
              lookupDottedPath(data, value.substr(1)) : value;
          });
          return ids;
        }

        function defaultResponseInterceptor(response) {
          return response.resource;
        }

        function Resource(value) {
          shallowClearAndCopy(value || {}, this);
        }

        Resource.prototype.toJSON = function () {
          var data = extend({}, this);
          delete data.$promise;
          delete data.$resolved;
          return data;
        };

        forEach(actions, function (action, name) {
          var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

          Resource[name] = function (a1, a2, a3, a4) {
            var params = {}, data, success, error;

            /* jshint -W086 */ /* (purposefully fall through case statements) */
            switch (arguments.length) {
              case 4:
                error = a4;
                success = a3;
              //fallthrough
              case 3:
              case 2:
                if (isFunction(a2)) {
                  if (isFunction(a1)) {
                    success = a1;
                    error = a2;
                    break;
                  }

                  success = a2;
                  error = a3;
                  //fallthrough
                } else {
                  params = a1;
                  data = a2;
                  success = a3;
                  break;
                }
              case 1:
                if (isFunction(a1)) success = a1;
                else if (hasBody) data = a1;
                else params = a1;
                break;
              case 0: break;
              default:
                throw $resourceMinErr('badargs',
                  "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
                  arguments.length);
            }
            /* jshint +W086 */ /* (purposefully fall through case statements) */

            var isInstanceCall = this instanceof Resource;
            var value = isInstanceCall ? data : (action.isArray ? [] : new Resource(data));
            var httpConfig = {};
            var responseInterceptor = action.interceptor && action.interceptor.response ||
              defaultResponseInterceptor;
            var responseErrorInterceptor = action.interceptor && action.interceptor.responseError ||
              undefined;

            forEach(action, function (value, key) {
              if (key != 'params' && key != 'isArray' && key != 'interceptor') {
                httpConfig[key] = copy(value);
              }
            });

            if (hasBody) httpConfig.data = data;
            route.setUrlParams(httpConfig,
              extend({}, extractParams(data, action.params || {}), params),
              action.url);

            var promise = $http(httpConfig).then(function (response) {
              var data = response.data,
                promise = value.$promise;

              if (data) {
                // Need to convert action.isArray to boolean in case it is undefined
                // jshint -W018
                if (angular.isArray(data) !== (!!action.isArray)) {
                  throw $resourceMinErr('badcfg',
                      'Error in resource configuration for action `{0}`. Expected response to ' +
                      'contain an {1} but got an {2}', name, action.isArray ? 'array' : 'object',
                    angular.isArray(data) ? 'array' : 'object');
                }
                // jshint +W018
                if (action.isArray) {
                  value.length = 0;
                  forEach(data, function (item) {
                    if (typeof item === "object") {
                      value.push(new Resource(item));
                    } else {
                      // Valid JSON values may be string literals, and these should not be converted
                      // into objects. These items will not have access to the Resource prototype
                      // methods, but unfortunately there
                      value.push(item);
                    }
                  });
                } else {
                  shallowClearAndCopy(data, value);
                  value.$promise = promise;
                }
              }

              value.$resolved = true;

              response.resource = value;

              return response;
            }, function (response) {
              value.$resolved = true;

              (error || noop)(response);

              return $q.reject(response);
            });

            promise = promise.then(
              function (response) {
                var value = responseInterceptor(response);
                (success || noop)(value, response.headers);
                return value;
              },
              responseErrorInterceptor);

            if (!isInstanceCall) {
              // we are creating instance / collection
              // - set the initial promise
              // - return the instance / collection
              value.$promise = promise;
              value.$resolved = false;

              return value;
            }

            // instance call
            return promise;
          };


          Resource.prototype['$' + name] = function (params, success, error) {
            if (isFunction(params)) {
              error = success; success = params; params = {};
            }
            var result = Resource[name].call(this, params, this, success, error);
            return result.$promise || result;
          };
        });

        Resource.bind = function (additionalParamDefaults) {
          return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
        };

        return Resource;
      }

      return resourceFactory;
    }];
  });


})(window, window.angular);

/**
 * @license AngularJS v1.3.0
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngCookies
 * @description
 *
 * # ngCookies
 *
 * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
 *
 *
 * <div doc-module-components="ngCookies"></div>
 *
 * See {@link ngCookies.$cookies `$cookies`} and
 * {@link ngCookies.$cookieStore `$cookieStore`} for usage.
 */


angular.module('ngCookies', ['ng']).
  /**
   * @ngdoc service
   * @name $cookies
   *
   * @description
   * Provides read/write access to browser's cookies.
   *
   * Only a simple Object is exposed and by adding or removing properties to/from this object, new
   * cookies are created/deleted at the end of current $eval.
   * The object's properties can only be strings.
   *
   * Requires the {@link ngCookies `ngCookies`} module to be installed.
   *
   * @example
   *
   * ```js
   * angular.module('cookiesExample', ['ngCookies'])
   *   .controller('ExampleController', ['$cookies', function($cookies) {
   *     // Retrieving a cookie
   *     var favoriteCookie = $cookies.myFavorite;
   *     // Setting a cookie
   *     $cookies.myFavorite = 'oatmeal';
   *   }]);
   * ```
   */
   factory('$cookies', ['$rootScope', '$browser', function ($rootScope, $browser) {
      var cookies = {},
          lastCookies = {},
          lastBrowserCookies,
          runEval = false,
          copy = angular.copy,
          isUndefined = angular.isUndefined;

      //creates a poller fn that copies all cookies from the $browser to service & inits the service
      $browser.addPollFn(function() {
        var currentCookies = $browser.cookies();
        if (lastBrowserCookies != currentCookies) { //relies on browser.cookies() impl
          lastBrowserCookies = currentCookies;
          copy(currentCookies, lastCookies);
          copy(currentCookies, cookies);
          if (runEval) $rootScope.$apply();
        }
      })();

      runEval = true;

      //at the end of each eval, push cookies
      //TODO: this should happen before the "delayed" watches fire, because if some cookies are not
      //      strings or browser refuses to store some cookies, we update the model in the push fn.
      $rootScope.$watch(push);

      return cookies;


      /**
       * Pushes all the cookies from the service to the browser and verifies if all cookies were
       * stored.
       */
      function push() {
        var name,
            value,
            browserCookies,
            updated;

        //delete any cookies deleted in $cookies
        for (name in lastCookies) {
          if (isUndefined(cookies[name])) {
            $browser.cookies(name, undefined);
          }
        }

        //update all cookies updated in $cookies
        for(name in cookies) {
          value = cookies[name];
          if (!angular.isString(value)) {
            value = '' + value;
            cookies[name] = value;
          }
          if (value !== lastCookies[name]) {
            $browser.cookies(name, value);
            updated = true;
          }
        }

        //verify what was actually stored
        if (updated){
          updated = false;
          browserCookies = $browser.cookies();

          for (name in cookies) {
            if (cookies[name] !== browserCookies[name]) {
              //delete or reset all cookies that the browser dropped from $cookies
              if (isUndefined(browserCookies[name])) {
                delete cookies[name];
              } else {
                cookies[name] = browserCookies[name];
              }
              updated = true;
            }
          }
        }
      }
    }]).


  /**
   * @ngdoc service
   * @name $cookieStore
   * @requires $cookies
   *
   * @description
   * Provides a key-value (string-object) storage, that is backed by session cookies.
   * Objects put or retrieved from this storage are automatically serialized or
   * deserialized by angular's toJson/fromJson.
   *
   * Requires the {@link ngCookies `ngCookies`} module to be installed.
   *
   * @example
   *
   * ```js
   * angular.module('cookieStoreExample', ['ngCookies'])
   *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
   *     // Put cookie
   *     $cookieStore.put('myFavorite','oatmeal');
   *     // Get cookie
   *     var favoriteCookie = $cookieStore.get('myFavorite');
   *     // Removing a cookie
   *     $cookieStore.remove('myFavorite');
   *   }]);
   * ```
   */
   factory('$cookieStore', ['$cookies', function($cookies) {

      return {
        /**
         * @ngdoc method
         * @name $cookieStore#get
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        get: function(key) {
          var value = $cookies[key];
          return value ? angular.fromJson(value) : value;
        },

        /**
         * @ngdoc method
         * @name $cookieStore#put
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         */
        put: function(key, value) {
          $cookies[key] = angular.toJson(value);
        },

        /**
         * @ngdoc method
         * @name $cookieStore#remove
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         */
        remove: function(key) {
          delete $cookies[key];
        }
      };

    }]);


})(window, window.angular);

/**
 * @license AngularJS v1.3.0
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $sanitizeMinErr = angular.$$minErr('$sanitize');

/**
 * @ngdoc module
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */


/**
 * @ngdoc service
 * @name $sanitize
 * @kind function
 *
 * @description
 *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however, since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer.
 *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
 *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
 *
 * @param {string} html Html input.
 * @returns {string} Sanitized html.
 *
 * @example
   <example module="sanitizeExample" deps="angular-sanitize.js">
   <file name="index.html">
     <script>
         angular.module('sanitizeExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }]);
     </script>
     <div ng-controller="ExampleController">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </file>
   </example>
 */
function $SanitizeProvider() {
  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
    return function(html) {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
        return !/^unsafe/.test($$sanitizeUri(uri, isImage));
      }));
      return buf.join('');
    };
  }];
}

function sanitizeText(chars) {
  var buf = [];
  var writer = htmlSanitizeWriter(buf, angular.noop);
  writer.chars(chars);
  return buf.join('');
}


// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP =
       /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
  END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    optionalEndTagInlineElements = makeMap("rp,rt"),
    optionalEndTagElements = angular.extend({},
                                            optionalEndTagInlineElements,
                                            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
var specialElements = makeMap("script,style");

var validElements = angular.extend({},
                                   voidElements,
                                   blockElements,
                                   inlineElements,
                                   optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
var validAttrs = angular.extend({}, uriAttrs, makeMap(
    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
    'scope,scrolling,shape,size,span,start,summary,target,title,type,'+
    'valign,value,vspace,width'));

function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) obj[items[i]] = true;
  return obj;
}


/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser( html, handler ) {
  if (typeof html !== 'string') {
    if (html === null || typeof html === 'undefined') {
      html = '';
    } else {
      html = '' + html;
    }
  }
  var index, chars, match, stack = [], last = html, text;
  stack.last = function() { return stack[ stack.length - 1 ]; };

  while ( html ) {
    text = '';
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        // comments containing -- are not allowed unless they terminate the comment
        index = html.indexOf("--", 4);

        if ( index >= 0 && html.lastIndexOf("-->", index) === index) {
          if (handler.comment) handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }
      // DOCTYPE
      } else if ( DOCTYPE_REGEXP.test(html) ) {
        match = html.match( DOCTYPE_REGEXP );

        if ( match ) {
          html = html.replace( match[0], '');
          chars = false;
        }
      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          // We only have a valid start-tag if there is a '>'.
          if ( match[4] ) {
            html = html.substring( match[0].length );
            match[0].replace( START_TAG_REGEXP, parseStartTag );
          }
          chars = false;
        } else {
          // no ending tag found --- this piece should be encoded as an entity.
          text += '<';
          html = html.substring(1);
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        text += index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        if (handler.chars) handler.chars( decodeEntities(text) );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
        function(all, text){
          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

          if (handler.chars) handler.chars( decodeEntities(text) );

          return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                                        "of html: {0}", html);
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = angular.lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = voidElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    var attrs = {};

    rest.replace(ATTR_REGEXP,
      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
        var value = doubleQuotedValue
          || singleQuotedValue
          || unquotedValue
          || '';

        attrs[name] = decodeEntities(value);
    });
    if (handler.start) handler.start( tagName, attrs, unary );
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = angular.lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        if (handler.end) handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

var hiddenPre=document.createElement("pre");
var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 */
function decodeEntities(value) {
  if (!value) { return ''; }

  // Note: IE8 does not preserve spaces at the start/end of innerHTML
  // so we must capture them and reattach them afterward
  var parts = spaceRe.exec(value);
  var spaceBefore = parts[1];
  var spaceAfter = parts[3];
  var content = parts[2];
  if (content) {
    hiddenPre.innerHTML=content.replace(/</g,"&lt;");
    // innerText depends on styling as it doesn't display hidden elements.
    // Therefore, it's better to use textContent not to cause unnecessary
    // reflows. However, IE<9 don't support textContent so the innerText
    // fallback is necessary.
    content = 'textContent' in hiddenPre ?
      hiddenPre.textContent : hiddenPre.innerText;
  }
  return spaceBefore + content + spaceAfter;
}

/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns {string} escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(SURROGATE_PAIR_REGEXP, function (value) {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf, uriValidator){
  var ignore = false;
  var out = angular.bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = angular.lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] === true) {
        out('<');
        out(tag);
        angular.forEach(attrs, function(value, key){
          var lkey=angular.lowercase(key);
          var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
          if (validAttrs[lkey] === true &&
            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = angular.lowercase(tag);
        if (!ignore && validElements[tag] === true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}


// define ngSanitize module and register $sanitize service
angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

/* global sanitizeText: false */

/**
 * @ngdoc filter
 * @name linky
 * @kind function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
 * @returns {string} Html-linkified text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <example module="linkyExample" deps="angular-sanitize.js">
     <file name="index.html">
       <script>
         angular.module('linkyExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.snippet =
               'Pretty text with some links:\n'+
               'http://angularjs.org/,\n'+
               'mailto:us@somewhere.org,\n'+
               'another@somewhere.org,\n'+
               'and one more: ftp://127.0.0.1/.';
             $scope.snippetWithTarget = 'http://angularjs.org/';
           }]);
       </script>
       <div ng-controller="ExampleController">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Filter</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </file>
     <file name="protractor.js" type="protractor">
       it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
       });

       it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
       });

       it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });
     </file>
   </example>
 */
angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"]/,
      MAILTO_REGEXP = /^mailto:/;

  return function(text, target) {
    if (!text) return text;
    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/mailto then assume mailto
      if (match[2] == match[3]) url = 'mailto:' + url;
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(sanitizeText(text));
    }

    function addLink(url, text) {
      html.push('<a ');
      if (angular.isDefined(target)) {
        html.push('target="');
        html.push(target);
        html.push('" ');
      }
      html.push('href="');
      html.push(url);
      html.push('">');
      addText(text);
      html.push('</a>');
    }
  };
}]);


})(window, window.angular);

/*!
 * angular-translate - v2.4.2 - 2014-10-21
 * http://github.com/angular-translate/angular-translate
 * Copyright (c) 2014 ; Licensed MIT
 */
angular.module('pascalprecht.translate', ['ng']).run([
  '$translate',
  function ($translate) {
    var key = $translate.storageKey(), storage = $translate.storage();
    if (storage) {
      if (!storage.get(key)) {
        if (angular.isString($translate.preferredLanguage())) {
          $translate.use($translate.preferredLanguage());
        } else {
          storage.set(key, $translate.use());
        }
      } else {
        $translate.use(storage.get(key));
      }
    } else if (angular.isString($translate.preferredLanguage())) {
      $translate.use($translate.preferredLanguage());
    }
  }
]);
angular.module('pascalprecht.translate').provider('$translate', [
  '$STORAGE_KEY',
  function ($STORAGE_KEY) {
    var $translationTable = {}, $preferredLanguage, $availableLanguageKeys = [], $languageKeyAliases, $fallbackLanguage, $fallbackWasString, $uses, $nextLang, $storageFactory, $storageKey = $STORAGE_KEY, $storagePrefix, $missingTranslationHandlerFactory, $interpolationFactory, $interpolatorFactories = [], $interpolationSanitizationStrategy = false, $loaderFactory, $cloakClassName = 'translate-cloak', $loaderOptions, $notFoundIndicatorLeft, $notFoundIndicatorRight, $postCompilingEnabled = false, NESTED_OBJECT_DELIMITER = '.', loaderCache;
    var version = '2.4.2';
    var getLocale = function () {
      var nav = window.navigator;
      return ((angular.isArray(nav.languages) ? nav.languages[0] : nav.language || nav.browserLanguage || nav.systemLanguage || nav.userLanguage) || '').split('-').join('_');
    };
    var indexOf = function (array, searchElement) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === searchElement) {
          return i;
        }
      }
      return -1;
    };
    var trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
    var negotiateLocale = function (preferred) {
      var avail = [], locale = angular.lowercase(preferred), i = 0, n = $availableLanguageKeys.length;
      for (; i < n; i++) {
        avail.push(angular.lowercase($availableLanguageKeys[i]));
      }
      if (indexOf(avail, locale) > -1) {
        return preferred;
      }
      if ($languageKeyAliases) {
        var alias;
        for (var langKeyAlias in $languageKeyAliases) {
          var hasWildcardKey = false;
          var hasExactKey = Object.prototype.hasOwnProperty.call($languageKeyAliases, langKeyAlias) && angular.lowercase(langKeyAlias) === angular.lowercase(preferred);
          if (langKeyAlias.slice(-1) === '*') {
            hasWildcardKey = langKeyAlias.slice(0, -1) === preferred.slice(0, langKeyAlias.length - 1);
          }
          if (hasExactKey || hasWildcardKey) {
            alias = $languageKeyAliases[langKeyAlias];
            if (indexOf(avail, angular.lowercase(alias)) > -1) {
              return alias;
            }
          }
        }
      }
      var parts = preferred.split('_');
      if (parts.length > 1 && indexOf(avail, angular.lowercase(parts[0])) > -1) {
        return parts[0];
      }
      return preferred;
    };
    var translations = function (langKey, translationTable) {
      if (!langKey && !translationTable) {
        return $translationTable;
      }
      if (langKey && !translationTable) {
        if (angular.isString(langKey)) {
          return $translationTable[langKey];
        }
      } else {
        if (!angular.isObject($translationTable[langKey])) {
          $translationTable[langKey] = {};
        }
        angular.extend($translationTable[langKey], flatObject(translationTable));
      }
      return this;
    };
    this.translations = translations;
    this.cloakClassName = function (name) {
      if (!name) {
        return $cloakClassName;
      }
      $cloakClassName = name;
      return this;
    };
    var flatObject = function (data, path, result, prevKey) {
      var key, keyWithPath, keyWithShortPath, val;
      if (!path) {
        path = [];
      }
      if (!result) {
        result = {};
      }
      for (key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
          continue;
        }
        val = data[key];
        if (angular.isObject(val)) {
          flatObject(val, path.concat(key), result, key);
        } else {
          keyWithPath = path.length ? '' + path.join(NESTED_OBJECT_DELIMITER) + NESTED_OBJECT_DELIMITER + key : key;
          if (path.length && key === prevKey) {
            keyWithShortPath = '' + path.join(NESTED_OBJECT_DELIMITER);
            result[keyWithShortPath] = '@:' + keyWithPath;
          }
          result[keyWithPath] = val;
        }
      }
      return result;
    };
    this.addInterpolation = function (factory) {
      $interpolatorFactories.push(factory);
      return this;
    };
    this.useMessageFormatInterpolation = function () {
      return this.useInterpolation('$translateMessageFormatInterpolation');
    };
    this.useInterpolation = function (factory) {
      $interpolationFactory = factory;
      return this;
    };
    this.useSanitizeValueStrategy = function (value) {
      $interpolationSanitizationStrategy = value;
      return this;
    };
    this.preferredLanguage = function (langKey) {
      setupPreferredLanguage(langKey);
      return this;
    };
    var setupPreferredLanguage = function (langKey) {
      if (langKey) {
        $preferredLanguage = langKey;
      }
      return $preferredLanguage;
    };
    this.translationNotFoundIndicator = function (indicator) {
      this.translationNotFoundIndicatorLeft(indicator);
      this.translationNotFoundIndicatorRight(indicator);
      return this;
    };
    this.translationNotFoundIndicatorLeft = function (indicator) {
      if (!indicator) {
        return $notFoundIndicatorLeft;
      }
      $notFoundIndicatorLeft = indicator;
      return this;
    };
    this.translationNotFoundIndicatorRight = function (indicator) {
      if (!indicator) {
        return $notFoundIndicatorRight;
      }
      $notFoundIndicatorRight = indicator;
      return this;
    };
    this.fallbackLanguage = function (langKey) {
      fallbackStack(langKey);
      return this;
    };
    var fallbackStack = function (langKey) {
      if (langKey) {
        if (angular.isString(langKey)) {
          $fallbackWasString = true;
          $fallbackLanguage = [langKey];
        } else if (angular.isArray(langKey)) {
          $fallbackWasString = false;
          $fallbackLanguage = langKey;
        }
        if (angular.isString($preferredLanguage) && indexOf($fallbackLanguage, $preferredLanguage) < 0) {
          $fallbackLanguage.push($preferredLanguage);
        }
        return this;
      } else {
        if ($fallbackWasString) {
          return $fallbackLanguage[0];
        } else {
          return $fallbackLanguage;
        }
      }
    };
    this.use = function (langKey) {
      if (langKey) {
        if (!$translationTable[langKey] && !$loaderFactory) {
          throw new Error('$translateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
        }
        $uses = langKey;
        return this;
      }
      return $uses;
    };
    var storageKey = function (key) {
      if (!key) {
        if ($storagePrefix) {
          return $storagePrefix + $storageKey;
        }
        return $storageKey;
      }
      $storageKey = key;
    };
    this.storageKey = storageKey;
    this.useUrlLoader = function (url, options) {
      return this.useLoader('$translateUrlLoader', angular.extend({ url: url }, options));
    };
    this.useStaticFilesLoader = function (options) {
      return this.useLoader('$translateStaticFilesLoader', options);
    };
    this.useLoader = function (loaderFactory, options) {
      $loaderFactory = loaderFactory;
      $loaderOptions = options || {};
      return this;
    };
    this.useLocalStorage = function () {
      return this.useStorage('$translateLocalStorage');
    };
    this.useCookieStorage = function () {
      return this.useStorage('$translateCookieStorage');
    };
    this.useStorage = function (storageFactory) {
      $storageFactory = storageFactory;
      return this;
    };
    this.storagePrefix = function (prefix) {
      if (!prefix) {
        return prefix;
      }
      $storagePrefix = prefix;
      return this;
    };
    this.useMissingTranslationHandlerLog = function () {
      return this.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
    };
    this.useMissingTranslationHandler = function (factory) {
      $missingTranslationHandlerFactory = factory;
      return this;
    };
    this.usePostCompiling = function (value) {
      $postCompilingEnabled = !!value;
      return this;
    };
    this.determinePreferredLanguage = function (fn) {
      var locale = fn && angular.isFunction(fn) ? fn() : getLocale();
      if (!$availableLanguageKeys.length) {
        $preferredLanguage = locale;
      } else {
        $preferredLanguage = negotiateLocale(locale);
      }
      return this;
    };
    this.registerAvailableLanguageKeys = function (languageKeys, aliases) {
      if (languageKeys) {
        $availableLanguageKeys = languageKeys;
        if (aliases) {
          $languageKeyAliases = aliases;
        }
        return this;
      }
      return $availableLanguageKeys;
    };
    this.useLoaderCache = function (cache) {
      if (cache === false) {
        loaderCache = undefined;
      } else if (cache === true) {
        loaderCache = true;
      } else if (typeof cache === 'undefined') {
        loaderCache = '$translationCache';
      } else if (cache) {
        loaderCache = cache;
      }
      return this;
    };
    this.$get = [
      '$log',
      '$injector',
      '$rootScope',
      '$q',
      function ($log, $injector, $rootScope, $q) {
        var Storage, defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'), pendingLoader = false, interpolatorHashMap = {}, langPromises = {}, fallbackIndex, startFallbackIteration;
        var $translate = function (translationId, interpolateParams, interpolationId) {
          if (angular.isArray(translationId)) {
            var translateAll = function (translationIds) {
              var results = {};
              var promises = [];
              var translate = function (translationId) {
                var deferred = $q.defer();
                var regardless = function (value) {
                  results[translationId] = value;
                  deferred.resolve([
                    translationId,
                    value
                  ]);
                };
                $translate(translationId, interpolateParams, interpolationId).then(regardless, regardless);
                return deferred.promise;
              };
              for (var i = 0, c = translationIds.length; i < c; i++) {
                promises.push(translate(translationIds[i]));
              }
              return $q.all(promises).then(function () {
                return results;
              });
            };
            return translateAll(translationId);
          }
          var deferred = $q.defer();
          if (translationId) {
            translationId = trim.apply(translationId);
          }
          var promiseToWaitFor = function () {
              var promise = $preferredLanguage ? langPromises[$preferredLanguage] : langPromises[$uses];
              fallbackIndex = 0;
              if ($storageFactory && !promise) {
                var langKey = Storage.get($storageKey);
                promise = langPromises[langKey];
                if ($fallbackLanguage && $fallbackLanguage.length) {
                  var index = indexOf($fallbackLanguage, langKey);
                  fallbackIndex = index === 0 ? 1 : 0;
                  if (indexOf($fallbackLanguage, $preferredLanguage) < 0) {
                    $fallbackLanguage.push($preferredLanguage);
                  }
                }
              }
              return promise;
            }();
          if (!promiseToWaitFor) {
            determineTranslation(translationId, interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
          } else {
            promiseToWaitFor.then(function () {
              determineTranslation(translationId, interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
            }, deferred.reject);
          }
          return deferred.promise;
        };
        var applyNotFoundIndicators = function (translationId) {
          if ($notFoundIndicatorLeft) {
            translationId = [
              $notFoundIndicatorLeft,
              translationId
            ].join(' ');
          }
          if ($notFoundIndicatorRight) {
            translationId = [
              translationId,
              $notFoundIndicatorRight
            ].join(' ');
          }
          return translationId;
        };
        var useLanguage = function (key) {
          $uses = key;
          $rootScope.$emit('$translateChangeSuccess', { language: key });
          if ($storageFactory) {
            Storage.set($translate.storageKey(), $uses);
          }
          defaultInterpolator.setLocale($uses);
          angular.forEach(interpolatorHashMap, function (interpolator, id) {
            interpolatorHashMap[id].setLocale($uses);
          });
          $rootScope.$emit('$translateChangeEnd', { language: key });
        };
        var loadAsync = function (key) {
          if (!key) {
            throw 'No language key specified for loading.';
          }
          var deferred = $q.defer();
          $rootScope.$emit('$translateLoadingStart', { language: key });
          pendingLoader = true;
          var cache = loaderCache;
          if (typeof cache === 'string') {
            cache = $injector.get(cache);
          }
          var loaderOptions = angular.extend({}, $loaderOptions, {
              key: key,
              $http: angular.extend({}, { cache: cache }, $loaderOptions.$http)
            });
          $injector.get($loaderFactory)(loaderOptions).then(function (data) {
            var translationTable = {};
            $rootScope.$emit('$translateLoadingSuccess', { language: key });
            if (angular.isArray(data)) {
              angular.forEach(data, function (table) {
                angular.extend(translationTable, flatObject(table));
              });
            } else {
              angular.extend(translationTable, flatObject(data));
            }
            pendingLoader = false;
            deferred.resolve({
              key: key,
              table: translationTable
            });
            $rootScope.$emit('$translateLoadingEnd', { language: key });
          }, function (key) {
            $rootScope.$emit('$translateLoadingError', { language: key });
            deferred.reject(key);
            $rootScope.$emit('$translateLoadingEnd', { language: key });
          });
          return deferred.promise;
        };
        if ($storageFactory) {
          Storage = $injector.get($storageFactory);
          if (!Storage.get || !Storage.set) {
            throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or set() method!');
          }
        }
        if (angular.isFunction(defaultInterpolator.useSanitizeValueStrategy)) {
          defaultInterpolator.useSanitizeValueStrategy($interpolationSanitizationStrategy);
        }
        if ($interpolatorFactories.length) {
          angular.forEach($interpolatorFactories, function (interpolatorFactory) {
            var interpolator = $injector.get(interpolatorFactory);
            interpolator.setLocale($preferredLanguage || $uses);
            if (angular.isFunction(interpolator.useSanitizeValueStrategy)) {
              interpolator.useSanitizeValueStrategy($interpolationSanitizationStrategy);
            }
            interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
          });
        }
        var getTranslationTable = function (langKey) {
          var deferred = $q.defer();
          if (Object.prototype.hasOwnProperty.call($translationTable, langKey)) {
            deferred.resolve($translationTable[langKey]);
          } else if (langPromises[langKey]) {
            langPromises[langKey].then(function (data) {
              translations(data.key, data.table);
              deferred.resolve(data.table);
            }, deferred.reject);
          } else {
            deferred.reject();
          }
          return deferred.promise;
        };
        var getFallbackTranslation = function (langKey, translationId, interpolateParams, Interpolator) {
          var deferred = $q.defer();
          getTranslationTable(langKey).then(function (translationTable) {
            if (Object.prototype.hasOwnProperty.call(translationTable, translationId)) {
              Interpolator.setLocale(langKey);
              deferred.resolve(Interpolator.interpolate(translationTable[translationId], interpolateParams));
              Interpolator.setLocale($uses);
            } else {
              deferred.reject();
            }
          }, deferred.reject);
          return deferred.promise;
        };
        var getFallbackTranslationInstant = function (langKey, translationId, interpolateParams, Interpolator) {
          var result, translationTable = $translationTable[langKey];
          if (Object.prototype.hasOwnProperty.call(translationTable, translationId)) {
            Interpolator.setLocale(langKey);
            result = Interpolator.interpolate(translationTable[translationId], interpolateParams);
            Interpolator.setLocale($uses);
          }
          return result;
        };
        var translateByHandler = function (translationId) {
          if ($missingTranslationHandlerFactory) {
            var resultString = $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
            if (resultString !== undefined) {
              return resultString;
            } else {
              return translationId;
            }
          } else {
            return translationId;
          }
        };
        var resolveForFallbackLanguage = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
          var deferred = $q.defer();
          if (fallbackLanguageIndex < $fallbackLanguage.length) {
            var langKey = $fallbackLanguage[fallbackLanguageIndex];
            getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator).then(deferred.resolve, function () {
              resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator).then(deferred.resolve);
            });
          } else {
            deferred.resolve(translateByHandler(translationId));
          }
          return deferred.promise;
        };
        var resolveForFallbackLanguageInstant = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
          var result;
          if (fallbackLanguageIndex < $fallbackLanguage.length) {
            var langKey = $fallbackLanguage[fallbackLanguageIndex];
            result = getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator);
            if (!result) {
              result = resolveForFallbackLanguageInstant(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
            }
          }
          return result;
        };
        var fallbackTranslation = function (translationId, interpolateParams, Interpolator) {
          return resolveForFallbackLanguage(startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex, translationId, interpolateParams, Interpolator);
        };
        var fallbackTranslationInstant = function (translationId, interpolateParams, Interpolator) {
          return resolveForFallbackLanguageInstant(startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex, translationId, interpolateParams, Interpolator);
        };
        var determineTranslation = function (translationId, interpolateParams, interpolationId) {
          var deferred = $q.defer();
          var table = $uses ? $translationTable[$uses] : $translationTable, Interpolator = interpolationId ? interpolatorHashMap[interpolationId] : defaultInterpolator;
          if (table && Object.prototype.hasOwnProperty.call(table, translationId)) {
            var translation = table[translationId];
            if (translation.substr(0, 2) === '@:') {
              $translate(translation.substr(2), interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
            } else {
              deferred.resolve(Interpolator.interpolate(translation, interpolateParams));
            }
          } else {
            var missingTranslationHandlerTranslation;
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              missingTranslationHandlerTranslation = translateByHandler(translationId);
            }
            if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
              fallbackTranslation(translationId, interpolateParams, Interpolator).then(function (translation) {
                deferred.resolve(translation);
              }, function (_translationId) {
                deferred.reject(applyNotFoundIndicators(_translationId));
              });
            } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
              deferred.resolve(missingTranslationHandlerTranslation);
            } else {
              deferred.reject(applyNotFoundIndicators(translationId));
            }
          }
          return deferred.promise;
        };
        var determineTranslationInstant = function (translationId, interpolateParams, interpolationId) {
          var result, table = $uses ? $translationTable[$uses] : $translationTable, Interpolator = interpolationId ? interpolatorHashMap[interpolationId] : defaultInterpolator;
          if (table && Object.prototype.hasOwnProperty.call(table, translationId)) {
            var translation = table[translationId];
            if (translation.substr(0, 2) === '@:') {
              result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId);
            } else {
              result = Interpolator.interpolate(translation, interpolateParams);
            }
          } else {
            var missingTranslationHandlerTranslation;
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              missingTranslationHandlerTranslation = translateByHandler(translationId);
            }
            if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
              fallbackIndex = 0;
              result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator);
            } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
              result = missingTranslationHandlerTranslation;
            } else {
              result = applyNotFoundIndicators(translationId);
            }
          }
          return result;
        };
        $translate.preferredLanguage = function (langKey) {
          if (langKey) {
            setupPreferredLanguage(langKey);
          }
          return $preferredLanguage;
        };
        $translate.cloakClassName = function () {
          return $cloakClassName;
        };
        $translate.fallbackLanguage = function (langKey) {
          if (langKey !== undefined && langKey !== null) {
            fallbackStack(langKey);
            if ($loaderFactory) {
              if ($fallbackLanguage && $fallbackLanguage.length) {
                for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
                  if (!langPromises[$fallbackLanguage[i]]) {
                    langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
                  }
                }
              }
            }
            $translate.use($translate.use());
          }
          if ($fallbackWasString) {
            return $fallbackLanguage[0];
          } else {
            return $fallbackLanguage;
          }
        };
        $translate.useFallbackLanguage = function (langKey) {
          if (langKey !== undefined && langKey !== null) {
            if (!langKey) {
              startFallbackIteration = 0;
            } else {
              var langKeyPosition = indexOf($fallbackLanguage, langKey);
              if (langKeyPosition > -1) {
                startFallbackIteration = langKeyPosition;
              }
            }
          }
        };
        $translate.proposedLanguage = function () {
          return $nextLang;
        };
        $translate.storage = function () {
          return Storage;
        };
        $translate.use = function (key) {
          if (!key) {
            return $uses;
          }
          var deferred = $q.defer();
          $rootScope.$emit('$translateChangeStart', { language: key });
          var aliasedKey = negotiateLocale(key);
          if (aliasedKey) {
            key = aliasedKey;
          }
          if (!$translationTable[key] && $loaderFactory && !langPromises[key]) {
            $nextLang = key;
            langPromises[key] = loadAsync(key).then(function (translation) {
              translations(translation.key, translation.table);
              deferred.resolve(translation.key);
              useLanguage(translation.key);
              if ($nextLang === key) {
                $nextLang = undefined;
              }
            }, function (key) {
              if ($nextLang === key) {
                $nextLang = undefined;
              }
              $rootScope.$emit('$translateChangeError', { language: key });
              deferred.reject(key);
              $rootScope.$emit('$translateChangeEnd', { language: key });
            });
          } else {
            deferred.resolve(key);
            useLanguage(key);
          }
          return deferred.promise;
        };
        $translate.storageKey = function () {
          return storageKey();
        };
        $translate.isPostCompilingEnabled = function () {
          return $postCompilingEnabled;
        };
        $translate.refresh = function (langKey) {
          if (!$loaderFactory) {
            throw new Error('Couldn\'t refresh translation table, no loader registered!');
          }
          var deferred = $q.defer();
          function resolve() {
            deferred.resolve();
            $rootScope.$emit('$translateRefreshEnd', { language: langKey });
          }
          function reject() {
            deferred.reject();
            $rootScope.$emit('$translateRefreshEnd', { language: langKey });
          }
          $rootScope.$emit('$translateRefreshStart', { language: langKey });
          if (!langKey) {
            var tables = [], loadingKeys = {};
            if ($fallbackLanguage && $fallbackLanguage.length) {
              for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
                tables.push(loadAsync($fallbackLanguage[i]));
                loadingKeys[$fallbackLanguage[i]] = true;
              }
            }
            if ($uses && !loadingKeys[$uses]) {
              tables.push(loadAsync($uses));
            }
            $q.all(tables).then(function (tableData) {
              angular.forEach(tableData, function (data) {
                if ($translationTable[data.key]) {
                  delete $translationTable[data.key];
                }
                translations(data.key, data.table);
              });
              if ($uses) {
                useLanguage($uses);
              }
              resolve();
            });
          } else if ($translationTable[langKey]) {
            loadAsync(langKey).then(function (data) {
              translations(data.key, data.table);
              if (langKey === $uses) {
                useLanguage($uses);
              }
              resolve();
            }, reject);
          } else {
            reject();
          }
          return deferred.promise;
        };
        $translate.instant = function (translationId, interpolateParams, interpolationId) {
          if (translationId === null || angular.isUndefined(translationId)) {
            return translationId;
          }
          if (angular.isArray(translationId)) {
            var results = {};
            for (var i = 0, c = translationId.length; i < c; i++) {
              results[translationId[i]] = $translate.instant(translationId[i], interpolateParams, interpolationId);
            }
            return results;
          }
          if (angular.isString(translationId) && translationId.length < 1) {
            return translationId;
          }
          if (translationId) {
            translationId = trim.apply(translationId);
          }
          var result, possibleLangKeys = [];
          if ($preferredLanguage) {
            possibleLangKeys.push($preferredLanguage);
          }
          if ($uses) {
            possibleLangKeys.push($uses);
          }
          if ($fallbackLanguage && $fallbackLanguage.length) {
            possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
          }
          for (var j = 0, d = possibleLangKeys.length; j < d; j++) {
            var possibleLangKey = possibleLangKeys[j];
            if ($translationTable[possibleLangKey]) {
              if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
                result = determineTranslationInstant(translationId, interpolateParams, interpolationId);
              }
            }
            if (typeof result !== 'undefined') {
              break;
            }
          }
          if (!result && result !== '') {
            result = defaultInterpolator.interpolate(translationId, interpolateParams);
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              result = translateByHandler(translationId);
            }
          }
          return result;
        };
        $translate.versionInfo = function () {
          return version;
        };
        $translate.loaderCache = function () {
          return loaderCache;
        };
        if ($loaderFactory) {
          if (angular.equals($translationTable, {})) {
            $translate.use($translate.use());
          }
          if ($fallbackLanguage && $fallbackLanguage.length) {
            var processAsyncResult = function (translation) {
              translations(translation.key, translation.table);
              $rootScope.$emit('$translateChangeEnd', { language: translation.key });
            };
            for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
              langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]).then(processAsyncResult);
            }
          }
        }
        return $translate;
      }
    ];
  }
]);
angular.module('pascalprecht.translate').factory('$translateDefaultInterpolation', [
  '$interpolate',
  function ($interpolate) {
    var $translateInterpolator = {}, $locale, $identifier = 'default', $sanitizeValueStrategy = null, sanitizeValueStrategies = {
        escaped: function (params) {
          var result = {};
          for (var key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              result[key] = angular.element('<div></div>').text(params[key]).html();
            }
          }
          return result;
        }
      };
    var sanitizeParams = function (params) {
      var result;
      if (angular.isFunction(sanitizeValueStrategies[$sanitizeValueStrategy])) {
        result = sanitizeValueStrategies[$sanitizeValueStrategy](params);
      } else {
        result = params;
      }
      return result;
    };
    $translateInterpolator.setLocale = function (locale) {
      $locale = locale;
    };
    $translateInterpolator.getInterpolationIdentifier = function () {
      return $identifier;
    };
    $translateInterpolator.useSanitizeValueStrategy = function (value) {
      $sanitizeValueStrategy = value;
      return this;
    };
    $translateInterpolator.interpolate = function (string, interpolateParams) {
      if ($sanitizeValueStrategy) {
        interpolateParams = sanitizeParams(interpolateParams);
      }
      return $interpolate(string)(interpolateParams || {});
    };
    return $translateInterpolator;
  }
]);
angular.module('pascalprecht.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');
angular.module('pascalprecht.translate').directive('translate', [
  '$translate',
  '$q',
  '$interpolate',
  '$compile',
  '$parse',
  '$rootScope',
  function ($translate, $q, $interpolate, $compile, $parse, $rootScope) {
    return {
      restrict: 'AE',
      scope: true,
      compile: function (tElement, tAttr) {
        var translateValuesExist = tAttr.translateValues ? tAttr.translateValues : undefined;
        var translateInterpolation = tAttr.translateInterpolation ? tAttr.translateInterpolation : undefined;
        var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);
        var interpolateRegExp = '^(.*)(' + $interpolate.startSymbol() + '.*' + $interpolate.endSymbol() + ')(.*)';
        return function linkFn(scope, iElement, iAttr) {
          scope.interpolateParams = {};
          scope.preText = '';
          scope.postText = '';
          iAttr.$observe('translate', function (translationId) {
            if (angular.equals(translationId, '') || !angular.isDefined(translationId)) {
              var interpolateMatches = iElement.text().match(interpolateRegExp);
              if (angular.isArray(interpolateMatches)) {
                scope.preText = interpolateMatches[1];
                scope.postText = interpolateMatches[3];
                scope.translationId = $interpolate(interpolateMatches[2])(scope.$parent);
              } else {
                scope.translationId = iElement.text().replace(/^\s+|\s+$/g, '');
              }
            } else {
              scope.translationId = translationId;
            }
          });
          iAttr.$observe('translateDefault', function (value) {
            scope.defaultText = value;
          });
          if (translateValuesExist) {
            iAttr.$observe('translateValues', function (interpolateParams) {
              if (interpolateParams) {
                scope.$parent.$watch(function () {
                  angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
                });
              }
            });
          }
          if (translateValueExist) {
            var fn = function (attrName) {
              iAttr.$observe(attrName, function (value) {
                scope.interpolateParams[angular.lowercase(attrName.substr(14, 1)) + attrName.substr(15)] = value;
              });
            };
            for (var attr in iAttr) {
              if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
                fn(attr);
              }
            }
          }
          var applyElementContent = function (value, scope, successful) {
            if (!successful && typeof scope.defaultText !== 'undefined') {
              value = scope.defaultText;
            }
            iElement.html(scope.preText + value + scope.postText);
            var globallyEnabled = $translate.isPostCompilingEnabled();
            var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
            var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
            if (globallyEnabled && !locallyDefined || locallyEnabled) {
              $compile(iElement.contents())(scope);
            }
          };
          var updateTranslationFn = function () {
              if (!translateValuesExist && !translateValueExist) {
                return function () {
                  var unwatch = scope.$watch('translationId', function (value) {
                      if (scope.translationId && value) {
                        $translate(value, {}, translateInterpolation).then(function (translation) {
                          applyElementContent(translation, scope, true);
                          unwatch();
                        }, function (translationId) {
                          applyElementContent(translationId, scope, false);
                          unwatch();
                        });
                      }
                    }, true);
                };
              } else {
                return function () {
                  var updateTranslations = function () {
                    if (scope.translationId && scope.interpolateParams) {
                      $translate(scope.translationId, scope.interpolateParams, translateInterpolation).then(function (translation) {
                        applyElementContent(translation, scope, true);
                      }, function (translationId) {
                        applyElementContent(translationId, scope, false);
                      });
                    }
                  };
                  scope.$watch('interpolateParams', updateTranslations, true);
                  scope.$watch('translationId', updateTranslations);
                };
              }
            }();
          var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslationFn);
          updateTranslationFn();
          scope.$on('$destroy', unbind);
        };
      }
    };
  }
]);
angular.module('pascalprecht.translate').directive('translateCloak', [
  '$rootScope',
  '$translate',
  function ($rootScope, $translate) {
    return {
      compile: function (tElement) {
        var applyCloak = function () {
            tElement.addClass($translate.cloakClassName());
          }, removeCloak = function () {
            tElement.removeClass($translate.cloakClassName());
          }, removeListener = $rootScope.$on('$translateChangeEnd', function () {
            removeCloak();
            removeListener();
            removeListener = null;
          });
        applyCloak();
        return function linkFn(scope, iElement, iAttr) {
          if (iAttr.translateCloak && iAttr.translateCloak.length) {
            iAttr.$observe('translateCloak', function (translationId) {
              $translate(translationId).then(removeCloak, applyCloak);
            });
          }
        };
      }
    };
  }
]);
angular.module('pascalprecht.translate').filter('translate', [
  '$parse',
  '$translate',
  function ($parse, $translate) {
    var translateFilter = function (translationId, interpolateParams, interpolation) {
      if (!angular.isObject(interpolateParams)) {
        interpolateParams = $parse(interpolateParams)(this);
      }
      return $translate.instant(translationId, interpolateParams, interpolation);
    };
    translateFilter.$stateful = true;
    return translateFilter;
  }
]);
/*!
 * angular-translate - v2.4.2 - 2014-10-21
 * http://github.com/angular-translate/angular-translate
 * Copyright (c) 2014 ; Licensed MIT
 */
angular.module('pascalprecht.translate').factory('$translateStaticFilesLoader', [
  '$q',
  '$http',
  function ($q, $http) {
    return function (options) {
      if (!options || (!angular.isString(options.prefix) || !angular.isString(options.suffix))) {
        throw new Error('Couldn\'t load static files, no prefix or suffix specified!');
      }
      var deferred = $q.defer();
      $http(angular.extend({
        url: [
          options.prefix,
          options.key,
          options.suffix
        ].join(''),
        method: 'GET',
        params: ''
      }, options.$http)).success(function (data) {
        deferred.resolve(data);
      }).error(function (data) {
        deferred.reject(options.key);
      });
      return deferred.promise;
    };
  }
]);