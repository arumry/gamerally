app.service('friendService', function($q, $http){
       this.getPendingFriends = function(){
       		var defer = $q.defer();
       		$http.get('/friends/pending').then(function(pendingFriends){
       			defer.resolve(pendingFriends);
       		});
       		return defer.promise;
       };

       this.getRequestedFriends = function(){
       		var defer = $q.defer();
       		$http.get('/friends/requested').then(function(requestedFriends){
       			defer.resolve(requestedFriends);
       		});
       		return defer.promise;
       };

       this.getAcceptedFriends = function(){
       		var defer = $q.defer();
       		$http.get('/friends/accepted').then(function(acceptedFriends){
       			defer.resolve(acceptedFriends);
       		});
       		return defer.promise;
       };
});