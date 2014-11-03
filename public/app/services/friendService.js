app.service('friendService', function($q, $http){
       this.getAllFriends = function(){
       	var defer = $q.defer();
       	$http.get('/friends/all').then(function(data){
                     var friends = data.data;
       		defer.resolve(friends);
       	});
       	return defer.promise;
       };

       this.deleteFriend = function(id){
              var defer = $q.defer();
              $http.delete('/friend/' + id).then(function(result){
                     defer.resolve(result);
              });
              return defer.promise;
       };

       this.requestFriend = function(id){
              var defer = $q.defer();
              $http.post('/friend/' + id).then(function(result){
                     defer.resolve(result);
              });
              return defer.promise;
       };
});