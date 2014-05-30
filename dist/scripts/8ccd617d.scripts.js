"use strict";angular.module("JesusEspejoACVApp",["JesusEspejoACVServices","JesusEspejoACVDirectives","JesusEspejoACVControllers","JesusEspejoACVFilters","pascalprecht.translate"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/aboutme.html"}).when("/experience",{templateUrl:"views/experience.html",controller:"ExperienceCtrl"}).when("/experience/:start",{templateUrl:"views/experience-detail.html",controller:"ExperienceDetailCtrl"}).otherwise({redirectTo:"/"})}]).config(["$translateProvider",function(a){a.translations("test",{WHO_I_AM:"Quien soy",ABOUT_ME:"Sobre mí",TECHNICAL_SKILLS:"Tecnologías",EXPERTISE:"Tecnologías",EXPERIENCE:"Experiencia",EDUCATION:"Educación",TRAINING:"Cursos",ABOUT_ME_EXPL:"Perfil profesional e Información de Contacto",ABOUT_ME_P1:"Hola, soy Jesús, desarrollador web y amante de las nuevas tecnologías.",ABOUT_ME_P2:"Como verás, he dedicado los últimos años en crear sitios web y disfrutar de las tecnologías web en el trabajo y mi tiempo libre. Me encantaría compartir mis conocimientos contigo, así que no dudes en contactar conmigo si estás interesado.",AT:"en",PRESENT:"Hoy",YEAR:"año",YEARS:"años",MONTH:"mes",MONTHS:"meses",SEARCH:"buscar"}),a.useStaticFilesLoader({prefix:"/data/position_",suffix:".json"}),a.preferredLanguage("en")}]),angular.module("JesusEspejoACVServices",["ng","ngResource"]).factory("SharedData",["$resource","$http",function(a,b){var c=[],d=function(a,b,c){for(var d=null,e=0,f=a.length;f>e;e++)if(a[e][b]===c){d=a[e];break}return d};return{getSharedDataResource:function(){var b={query:{method:"GET",isArray:!0}};return a("data/employment.json",{},b)},getSharedDataHttp:function(a){b.get("data/employment.json").success(function(b){return c=b,a(c)})},setSharedData:function(a){angular.copy(a,c)},filterJSON:function(a,b,c){var d=[];for(var e in a)a[e][b]===c&&d.push(a[e]);return d},getEmployersPeriods:function(a){var b,c=[],e={},f={};for(var g in a)b=a[g],e=d(c,"employerName",b.employer.name),e?(e.start>b.start&&(e.start=b.start),e.end<b.end&&(e.end=b.end)):(f={employerName:b.employer.name,webSite:b.employer.webSite,imageUrl:b.employer.imageUrl,start:b.start,end:b.end},c.push(f));return c}}}]),angular.module("JesusEspejoACVControllers",["pascalprecht.translate"]).controller("ExperienceCtrl",["$scope","$window","SharedData","$translate","$parse",function(a,b,c,d){var e=0,f=a.employments=c.getSharedDataResource().query(function(){a.employersDates=c.getEmployersPeriods(f)});a.activateSearchButton=!0,a.buttonContainerClass="",a.sectionTitleWrapperVisible="true",a.searchButtonInputFocus="false",a.searchButtonPlaceholder=d("SEARCH"),a.hideAndExpand=function(c){b.innerWidth<=480&&a.activateSearchButton&&(a.activateSearchButton=!1,c===e?a.sectionTitleWrapperVisible="true":(a.sectionTitleWrapperVisible="false",a.searchButtonInputFocus="true"))},a.exitSearchMode=function(){b.innerWidth<=480&&(a.query&&""!==a.query||(a.sectionTitleWrapperVisible="true",a.activateSearchButton=!0))}}]).controller("ExperienceDetailCtrl",["$scope","$routeParams","SharedData",function(a,b,c){var d=c.getSharedData().query(function(){a.experience=c.filterJSON(d,"start",b.start)[0]})}]),angular.module("JesusEspejoACVFilters",[]).filter("myDate",["$filter",function(a){var b=a("date");return function(a){var c=new Date(a);return""===a&&(c=new Date),b(c.getTime(),"MM-yyyy")}}]).filter("datesDiff",["$translate",function(a){return function(b){var c=new Date(b[0]),d=new Date(b[1]),e=12*(d.getFullYear()-c.getFullYear())+d.getMonth()-c.getMonth(),f=Math.floor(e/12),g=e%12,h="";return f>0&&(h+=f+" ",h+=a(f>1?"YEARS":"YEAR"),g>0&&(h+=" ")),g>0&&(h+=g+" ",h+=a(g>1?"MONTHS":"MONTH")),h}}]),angular.module("NavMenuDirective",["pascalprecht.translate"]).directive("navMenu",function(){return{restrict:"E",transclude:!0,scope:{},controller:["$scope","$element","$translate",function(a,b,c){$(".nav li").click(function(){$(".nav .active").toggleClass("active"),$(this).toggleClass("active"),$("#resp-menu-btn").click()}),a.langSwitchImg="images/lang_spanish.png",a.changeLanguage=function(a){c.uses(a)},a.switchLanguage=function(){"en"===c.uses()?(c.uses("es"),a.langSwitchImg="images/lang_english.png"):(c.uses("en"),a.langSwitchImg="images/lang_spanish.png")}}],templateUrl:"views/templates/navmenu.html",replace:!0}}),angular.module("SearchButtonDirective",[]).directive("searchButton",function(){return{restrict:"E",transclude:!0,scope:{searchQuery:"=",eventHandler:"&onExpand",blurHandler:"&customBlur",customPlaceholder:"="},controller:["$scope",function(a){a.isCollapsed=!0,a.clear=function(){a.searchQuery="",$(".searchButtonContainer > input").focus()},a.showInput=function(){a.isCollapsed&&($(".searchButtonContainer").toggleClass("mobSearchMode","slow","linear"),a.isCollapsed=!1)},a.hideInput=function(){window.innerWidth<=480&&(a.searchQuery&&""!==a.searchQuery||($(".searchButtonContainer").toggleClass("mobSearchMode","slow","linear"),a.isCollapsed=!0))},a.expand=function(){a.isCollapsed&&(a.eventHandler(),a.showInput(),$(".searchButtonContainer > input").focus())},a.blur=function(){a.hideInput(),a.blurHandler()}}],templateUrl:"views/templates/search-button.html",replace:!0}}).directive("ngBlur",function(){return function(a,b,c){b.bind("blur",function(){a.$apply(c.ngBlur)})}}).directive("ngFocus",["$timeout",function(a){return function(b,c,d){b.$watch(d.ngFocus,function(b){b&&a(function(){c[0].focus()},0,!1)})}}]),angular.module("ExperienceDetailsDirective",[]).directive("experienceDetails",function(){return{restrict:"E",templateUrl:"views/templates/experienceDetails.html",transclude:!0,scope:{detailsObjAttr:"=detailsObj"},link:function(){}}}),angular.module("JesusEspejoACVDirectives",["NavMenuDirective","SearchButtonDirective","ExperienceDetailsDirective"]);