// Modeling Data and State in Your AngularJS Application by joel hooks joelhooks.com

angular.module('modelDemo', []).
config(function ($routeProvider) {
    $routeProvider.
    when('/', {
        controller: 'AuthorListCtrl',
        templateUrl: 'list.html'
    }).
    otherwise({
        redirectTo: '/'
    });
});

angular.module('modelDemo').controller("AuthorListCtrl", ['$scope', 'authorListModel', function($scope, authorListModel) {

    $scope.authorListModel = authorListModel
    
    $scope.selectQuote = function(author) {
        authorListModel.setSelectedAuthor(author);
    };
    
    $scope.isSelected = function(author) {
        return author === authorListModel.selectedAuthor;
    };
}]);

angular.module('modelDemo').controller("QuoteTextCtrl", ['$scope', 'authorListModel', function($scope, authorListModel) {
    $scope.authorListModel = authorListModel;
}]);

angular.module('modelDemo').service("authorListModel", [function() {
    var fowler = {
            name: "Fowler",
            quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
        },
        twain = {
            name: "Twain",
            quote: "Why, I have known clergymen, good men, kind-hearted, liberal, sincere, and all that, who did not know the meaning of a 'flush.' It is enough to make one ashamed of one's species."
        },
        poe = {
            name: "Poe",
            quote: "Deep into that darkness peering, long I stood there, wondering, fearing, doubting, dreaming dreams no mortal ever dared to dream before."
        },
        plato = {
            name: "Plato",
            quote: "All things will be produced in superior quantity and quality, and with greater ease, when each man works at a single occupation, in accordance with his natural gifts, and at the right moment, without meddling with anything else. "
        };
    
    this.list = [fowler, twain, poe, plato];
    
    this.selectedAuthor = null;
    this.setSelectedAuthor = function(author) {
        if(this.list.indexOf(author) > -1) {
            this.selectedAuthor = author;
        }
    };
            
}]);

// redefine the service with the Author class

var Author = function(atts){
  var self = this;
  var initialSettings = atts || {};
  //initial settings if passed in
  for(var setting in initialSettings){
    if(initialSettings.hasOwnProperty(setting))
      self[setting] = initialSettings[setting];
  };

  //with some logic...
  self.fullName = function(){
    return self.first + " " + self.last;
  }

  //return the scope-safe instance
  return self;
};

var fowler = Author({
    name: "Fowler",
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
}),
twain = Author({
    name: "Twain",
    quote: "Why, I have known clergymen, good men, kind-hearted, liberal, sincere, and all that, who did not know the meaning of a 'flush.' It is enough to make one ashamed of one's species."
});