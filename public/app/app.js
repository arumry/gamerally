var app = angular.module('gally', ['ngRoute', 'SlideViewer', 'angular-loading-bar', 'angularModalService', 'ui.bootstrap']);

//Router
app.config(['$routeProvider','$httpProvider',
  function($routeProvider, $httpProvider) {
    $httpProvider.responseInterceptors.push('responseObserver');
    $routeProvider
      .when('/', {
        redirectTo: '/login'
      }).when('/login', {
        templateUrl: './app/views/login.html',
        controller: 'LoginCtrl'
      }).when('/profile', {
        templateUrl: './app/views/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          userData: function($q, userSvc){
            var defer = $q.defer();
            userSvc.getUser().then(function(user){
                return defer.resolve(user);
            });
            return defer.promise;   
          },
          friendData: function($q, friendService){
            var defer = $q.defer();
            var friendObj = {};
            friendService.getAllFriends().then(function(friends){
              defer.resolve(friends);
            });
            return defer.promise;
          },
          inboxData: function($q, messageService){
            var defer = $q.defer();
            messageService.getAllMessages().then(function(messages){
              defer.resolve(messages);
            });
            return defer.promise;
          }
        } 
      }).when('/findgamers', {
        templateUrl: './app/views/findgamers.html',
        controller: 'FindCtrl',
        resolve: {
          matchedGamers: function($q, matchService){
            var defer = $q.defer();
            matchService.getGamers().then(function(gamers){
              defer.resolve(gamers);
            });
            return defer.promise;
          }
        }
      }).otherwise({
        redirectTo: '/profile'
      });
}]);