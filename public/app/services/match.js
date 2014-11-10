app.service('matchService', function($q, $http){
       this.getMatchGamer = function(){
              var defer = $q.defer();
              $http.get('/gamer/similar').then(function(data){
                     var gamer = data.data;
                     defer.resolve(gamer);
              });
              return defer.promise;
       };
       this.negateMatch = function(id){
       		var defer = $q.defer();
              $http.put('/gamer/' + id).then(function(data){
                     var result = data.data;
                     defer.resolve(result);
              });
              return defer.promise;
       };
});