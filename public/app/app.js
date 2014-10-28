var app = angular.module('gally', ['ngRoute']);

//Router
app.config(['$routeProvider',
  function($routeProvider, $rootScope, $q, $route) {
    $routeProvider
      .when('/', {
        redirectTo: '/login'
      }).when('/login', {
        templateUrl: './app/views/login.html',
        controller: 'LoginCtrl'
      }).when('/profile', {
        templateUrl: './app/views/profile.html',
        controller: 'ProfileCtrl' 
      }).when('/friends', {
        templateUrl: './app/views/friends.html',
        controller: 'FriendsCtrl'
      }).when('/inbox', {
        templateUrl: './app/views/inbox.html',
        controller: 'InboxCtrl'
      }).when('/findgamers', {
        templateUrl: './app/views/findgamers.html',
        controller: 'FindCtrl'
      }).otherwise({
        redirectTo: '/profile'
      });
}]);