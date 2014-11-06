app.service('matchService', function($q, $http){
       this.getGamers = function(){
              var defer = $q.defer();
              $http.get('/gamers/similar').then(function(data){
                     var gamers = data.data;
                     console.log(data);
                     defer.resolve(gamers);

              })
              return defer.promise;
       };
});