"use strict";angular.module("JesusEspejoACVApp",["ngRoute","JesusEspejoACVServices","JesusEspejoACVDirectives","JesusEspejoACVControllers","JesusEspejoACVFilters","pascalprecht.translate"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/aboutme.html"}).when("/experience",{templateUrl:"views/experience.html",controller:"ExperienceCtrl"}).when("/experience/:start",{templateUrl:"views/experience-detail.html",controller:"ExperienceDetailCtrl"}).when("/projects",{templateUrl:"views/experience.html",controller:"ProjectsCtrl"}).otherwise({redirectTo:"/"})}]).config(["$translateProvider",function(a){a.translations("test",{WHO_I_AM:"Quien soy",ABOUT_ME:"Sobre mí",TECHNICAL_SKILLS:"Tecnologías",EXPERTISE:"Tecnologías",EXPERIENCE:"Experiencia",EDUCATION:"Educación",TRAINING:"Cursos",ABOUT_ME_EXPL:"Perfil profesional e Información de Contacto",ABOUT_ME_P1:"Hola, soy Jesús, desarrollador web y amante de las nuevas tecnologías.",ABOUT_ME_P2:"Como verás, he dedicado los últimos años en crear sitios web y disfrutar de las tecnologías web en el trabajo y mi tiempo libre. Me encantaría compartir mis conocimientos contigo, así que no dudes en contactar conmigo si estás interesado.",AT:"en",PRESENT:"Hoy",YEAR:"año",YEARS:"años",MONTH:"mes",MONTHS:"meses",SEARCH:"buscar"}),a.useStaticFilesLoader({prefix:"/data/position_",suffix:".json"}),a.preferredLanguage("en")}]),angular.module("JesusEspejoACVServices",["ng","ngResource"]).factory("SharedData",["$resource",function(a){function b(a,b,c){for(var d=null,e=0,f=a.length;f>e;e++)if(a[e][b]===c){d=a[e];break}return d}function c(a,b,c){var d=[];for(var e in a)a[e][b]===c&&d.push(a[e]);return d}function d(a){for(var c,d=[],e={},f={},g=0;g<a.length;g++)c=a[g],e=b(d,"employerName",c.employer.name),e?(e.start>c.start&&(e.start=c.start),e.end<c.end&&(e.end=c.end)):(f={employerName:c.employer.name,webSite:c.employer.webSite,imageUrl:c.employer.imageUrl,start:c.start,end:c.end},d.push(f));return d}return{getEmploymentsResource:function(){var b={query:{method:"GET",isArray:!0}};return a("data/employment.json",{},b)},getProjectsResource:function(){var b={query:{method:"GET",isArray:!0}};return a("data/projects.json",{},b)},filterJSON:c,getGroupedPeriods:d}}]).factory("DatesDiff",[function(){var a=function(a){var b,c=new Date(a[0]);b=""===a[1]?new Date:new Date(a[1]);var d=12*(b.getFullYear()-c.getFullYear())+b.getMonth()-c.getMonth();return d},b=function(b){var c={};c.years="",c.months="";var d=a(b),e=Math.floor(d/12),f=d%12;return c.years=e,c.months=f,c},c=function(a){var b="";return a>0&&(b=a>1?"YEARS":"YEAR"),b},d=function(a){var b="";return a>0&&(b=a>1?"MONTHS":"MONTH"),b},e=function(a,e){var f,g,h,i,j,k={};for(var l in a)j=a[l],f=b([j.start,j.end]),g=c(f.years),h=d(f.months),0===f.years&&(f.years=""),0===f.months&&(f.months=""),i=j[e],k[i]={years:f.years,yearLabel:g,months:f.months,monthLabel:h};return k},f={createDateDiffMap:e};return f}]),angular.module("JesusEspejoACVControllers",["oc.lazyLoad"]).controller("AppCtrl",["$scope",function(a){a.clickMenu={},a.menuItems={}}]).controller("ExperienceCtrl",["$scope","$window","SharedData","DatesDiff","$ocLazyLoad",function(a,b,c,d,e){e.load([{files:["scripts/xhr/my-sticky-kit.js"]}]);var f=a.employments=c.getEmploymentsResource().query(function(){var b=a.employersDates=c.getGroupedPeriods(f,"employerName");a.employersDateDiffMap=d.createDateDiffMap(b,"employerName"),a.employmentsDateDiffMap=d.createDateDiffMap(f,"locator")});a.buttonContainerClass="",a.rawTitle="EXPERIENCE",a.rawSubtitle="WHERE_I_WORKED",a.collapseScrollTop=0,a.notFoundLinkText="PERSONAL_PROJECTS",a.myText="MY_PLUR",a.notFoundRequestedMenu="PROJECTS"}]).controller("ProjectsCtrl",["$scope","$window","SharedData","DatesDiff","$ocLazyLoad",function(a,b,c,d,e){e.load([{files:["scripts/xhr/my-sticky-kit.js"]}]);var f=a.employments=c.getProjectsResource().query(function(){var b=a.employersDates=c.getGroupedPeriods(f);a.employersDateDiffMap=d.createDateDiffMap(b,"employerName"),a.employmentsDateDiffMap=d.createDateDiffMap(f,"locator")});a.buttonContainerClass="",a.rawTitle="PERSONAL_PROJECTS",a.rawSubtitle="FOR_THE_LOVE_OF_ART",a.collapseScrollTop="",a.notFoundLinkText="EXPERIENCE",a.myText="MY_SING",a.notFoundRequestedMenu="EXPERIENCE"}]).controller("ExperienceDetailCtrl",["$scope","$routeParams","SharedData",function(a,b,c){var d=c.getSharedData().query(function(){a.experience=c.filterJSON(d,"start",b.start)[0]})}]),angular.module("JesusEspejoACVFilters",[]).filter("myDate",["$filter",function(a){var b=a("date");return function(a){var c=new Date(a);return""===a&&(c=new Date),b(c.getTime(),"MM-yyyy")}}]),angular.module("NavMenuDirective",["pascalprecht.translate"]).directive("navMenu",function(){return{restrict:"E",transclude:!0,scope:{clickMenuItem:"=",navMenuItems:"="},controller:["$scope","$element","$translate","$location",function(a,b,c,d){var e={WHO_I_AM:{position:0,path:"/"},EXPERIENCE:{position:1,path:"/experience"},PROJECTS:{position:2,path:"/projects"}};$(document).ready(function(){$(".nav li").click(function(){$(".nav .active").toggleClass("active"),$(this).toggleClass("active"),$("#resp-menu-btn").click()}),$(document).on("click",".navbar-collapse.in",function(a){$(a.target).is("a")&&$(this).collapse("hide")})}),a.langSwitchImg="images/lang_spanish.png",a.switchLanguage=function(){"en"===c.use()?(c.use("es"),a.langSwitchImg="images/lang_english.png"):(c.use("en"),a.langSwitchImg="images/lang_spanish.png")},a.clickMenuItem=function(a){var c=e[a].position;$($(b.find("li"))).removeClass("active"),$($(b.find("li")[c])).addClass("active"),d.path(e[a].path)},a.navMenuItems=e}],templateUrl:"views/templates/navmenu.html",replace:!0}}),angular.module("SearchButtonDirective",[]).controller("SearchButtonController",["$scope","$window",function(a,b){a.window=b}]).directive("searchButton",function(){return{restrict:"E",transclude:!1,scope:{searchQuery:"=",customPlaceholder:"=",expandHandler:"&onExpand",collapseHandler:"&onCollapse",blurHandler:"&customBlur"},templateUrl:"views/templates/search-button.html",replace:!0,controller:"SearchButtonController",link:function(a,b){var c=a.window.innerWidth<=480,d=function(){$(b).toggleClass("mobSearchMode","slow","linear"),c=!1,a.expandHandler()},e=function(){$(b).toggleClass("mobSearchMode","slow","linear"),c=!0,a.collapseHandler()};a.clear=function(){$("#searchInput").focus(),a.window.innerWidth<=480&&(""===a.searchQuery||"undefined"==typeof a.searchQuery)&&e(),a.searchQuery=""},a.click=function(){c&&(d(),$(".searchButtonContainer #searchInput").focus())},a.blur=function(){c||(""===a.searchQuery||"undefined"==typeof a.searchQuery)&&(e(),a.blurHandler())}}}}).directive("ngBlur",function(){return function(a,b,c){b.bind("blur",function(){a.$apply(c.ngBlur)})}}).directive("ngFocus",["$timeout",function(a){return function(b,c,d){b.$watch(d.ngFocus,function(b){b&&a(function(){c[0].focus()},0,!1)})}}]).directive("handlePhoneSubmit",function(){return function(a,b){$(b).submit(function(){$("#searchInput").blur()})}}),angular.module("ExperienceDetailsDirective",["pascalprecht.translate"]).directive("experienceDetails",function(){return{restrict:"E",templateUrl:"views/templates/experienceDetails.html",scope:{detailsObjAttr:"=detailsObj"},link:function(){}}}),angular.module("PanelCollapseButtonDirective",[]).directive("jeaCollapseButton",["$q",function(a){function b(a,b){a.stick_in_parent({offset_top:50,parent:b})}function c(a){a.trigger("sticky_kit:detach")}return{restrict:"A",link:function(d,e){var f=a.defer(),g=$(e[0].parentElement.parentElement.parentElement),h=g.children(".stickyZone"),i=h.children(".panel-heading");g.on("shown.bs.collapse",function(){b(i,h,d),$(document.body).trigger("sticky_kit:recalc")}),g.on("hide.bs.collapse",function(){$(document.body).trigger("sticky_kit:recalc"),c(i);var a=h.offset().top-i.height();$("body").animate({scrollTop:a},500,function(){d.$apply(function(){f.resolve("readyToRecalc")})})})}}}]),angular.module("JesusEspejoACVDirectives",["NavMenuDirective","SearchButtonDirective","ExperienceDetailsDirective","PanelCollapseButtonDirective","MainLeftDirective"]),angular.module("MainLeftDirective",[]).controller("MainLeftController",["$scope","$window",function(a,b){a.sectionTitleWrapperVisible=!0,a.showTitle=function(){b.innerWidth<=480&&(a.sectionTitleWrapperVisible=!0)},a.hideTitle=function(){b.innerWidth<=480&&(a.sectionTitleWrapperVisible=!1)},a.exitSearchMode=function(c){b.innerWidth<=480&&(c&&""!==c?a.sectionTitleWrapper=!1:a.sectionTitleWrapperVisible=!0)}}]).directive("mainLeft",function(){return{restrict:"E",transclude:!1,scope:{customQuery:"=",customTitle:"=",customSubtitle:"="},controller:"MainLeftController",templateUrl:"views/templates/main-left.html",replace:!0}});