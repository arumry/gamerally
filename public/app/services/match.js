app.service('matchService', function($q, $http){
       this.getMatchGamer = function(){
              var defer = $q.defer();
              $http.get('/gamer/similar').then(function(data){
                     var gamer = data.data;
                     console.log(gamer);
                     defer.resolve(gamer);
              });
              return defer.promise;
       };
});