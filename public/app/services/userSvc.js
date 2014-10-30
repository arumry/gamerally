app.service('userSvc', function($q, $http){
	var user;
	var curGame;
	this.setCurGame = function(title){
		curGame = title;
	};

	this.getCurGame = function(){
		return curGame;
	};

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
	this.postGame = function(game){
		var defer = $q.defer();
		$http.post('/game', game).then(function(data){
			console.log(data);
			result = data.data;
			defer.resolve(result);
		}, function(err){
			defer.reject(err);
		});
		return defer.promise;
	};
});