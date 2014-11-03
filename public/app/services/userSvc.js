app.service('userSvc', function($q, $http){
	var user;
	var curFriend;
	var curGame;

	this.setCurFriend = function(friend){
		curFriend = friend;
	};

	this.getCurFriend = function(){
		return curFriend;
	};

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

	this.setUserSettings = function(updatedUser){
		var defer = $q.defer();
		$http.put('/user/settings', updatedUser).then(function(){
			defer.resolve();
		}, function(err){
			defer.reject();
		});
		return defer.promise;
	}
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
			result = data.data;
			defer.resolve(result);
		}, function(err){
			defer.reject(err);
		});
		return defer.promise;
	};
	this.editGameTime = function(game){
		var id = game['_id'];
		var times = game.avail;
		var defer = $q.defer();
		$http.put('/game/' + id, times).then(function(data){
			result = data.data;
			defer.resolve(result);
		}, function(err){
			defer.reject(err);
		});
		return defer.promise;
	};
	this.delGame = function(id){
		var defer = $q.defer();
		$http.delete('/game/' + id).then(function(data){
			result = data.data;
			defer.resolve(result);
		}, function(err){
			defer.reject(err);
		});
		return defer.promise;
	};
	this.getGames = function(){
		var defer = $q.defer();
		$http.get('/games').then(function(data){
			result = data.data;
			defer.resolve(result);
		}, function(err){
			defer.reject(err);
		});
		return defer.promise;
	};
});