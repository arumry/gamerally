app.service('userSvc', function($q, $http){
	var user;
	this.getUser = function(){
		var defer = $q.defer();
		$http.get('/user').then(function(data){
			user = data.data;
			defer.resolve(user);
		}, function(err){
			defer.reject(err);
		});
		return defer.promise;
	};
	this.getGameByTitle = function(title){
		var defer = $q.defer();
		$http.get('/game?title='+title).then(function(data){
			games = data.data;
			defer.resolve(games);
		}, function(err){
			defer.reject(err);
		});
		return defer.promise;
	};
});