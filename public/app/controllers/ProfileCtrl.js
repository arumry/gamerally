app.controller('ProfileCtrl', function($scope, userSvc){
	userSvc.getUser().then(function(user){
		$scope.user = user;
	}, function(err){
		if(err) console.error(err) //worry about this later.
		//perhaps doing a sweet alert and then redirect back to the login
	});
	$scope.gameTitle = '';
	$scope.searchGame = function(){
		if(!$scope.gameTitle) return;
		userSvc.getGameByTitle($scope.gameTitle).then(function(games){
			$scope.sGames = games;
			console.log(games);
		}, function(err){
			//swal that there was an error, or no results.
		})
	};
});