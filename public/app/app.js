var app = angular.module('gally', ['ngRoute', 'SlideViewer', 'angular-loading-bar', 'angularModalService']);

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
          }
        } 
      }).when('/findgamers', {
        templateUrl: './app/views/findgamers.html',
        controller: 'FindCtrl'
      }).otherwise({
        redirectTo: '/profile'
      });
}]);