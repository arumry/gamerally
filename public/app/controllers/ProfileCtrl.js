app.controller('ProfileCtrl', function($scope, userSvc, friendService, ModalService, userData, friendData){
	$scope.user = userData;
	$scope.gameTitle = '';
  $scope.acceptedFriends = friendData.acceptedFriends;
  $scope.pendingFriends = friendData.pendingFriends;
  $scope.requestedFriends = friendData.requestedFriends;
  $scope.getAcceptedFriends = function(){
    friendService.getRequestedFriends().then(function({
      $scope.acceptedFriends = friends;
    });
  }
  
	$scope.searchGame = function(){
		if(!$scope.gameTitle) return;
		userSvc.getGameByTitle($scope.gameTitle).then(function(games){
			$scope.sGames = games;
		}, function(err){
			swal("Uh oh!", "Something unexpected happened. Try your search again!", "error");
		});
	};

  $scope.getGames = function(){
    userSvc.getGames().then(function(games){
      $scope.user.games = games;
    });
  };

	$scope.addGame = function(game){
		userSvc.setCurGame(game.title);
		ModalService.showModal({
          templateUrl: "app/modaltemplates/gameTime.html",
          controller: "gameTime"
        }).then(function(modal) {
          modal.close.then(function(times) {
             if(!times){
             	return;
             } else {
             	game.avail = times;
             	userSvc.postGame(game).then(function(updated){
             		if(updated === 'true'){
                  swal("Woot!", "Your game has been added!", "success");
             		} else {
             			swal("Oops...", "You've already added this game before.", "error");
             		}
             	});
             }
          });
        });
	};

  $scope.editGameTime = function(game){
    userSvc.setCurGame(game.title);
    ModalService.showModal({
          templateUrl: "app/modaltemplates/gameTime.html",
          controller: "gameTime"
        }).then(function(modal) {
          modal.close.then(function(times) {
             if(!times){
              return;
             } else {
              game.avail = times;
              userSvc.editGameTime(game).then(function(updated){
                if(updated === 'true'){
                  swal("Tick tock!", "The time was changed successfully!", "success");
                } else {
                  swal("Hmmm...", "Something went wrong. Try again!", "error");
                }
              });
             }
          });
        });
  };

  $scope.deleteGame = function(game){
    var id = game['_id'];
    var index = $scope.user.games.indexOf(game);
    swal({title: "Are you sure you want to delete " + game.title + " ?",   
    text: "You will not be able to recover this game after it is deleted!",   
    type: "warning",   
    showCancelButton: true,   
    confirmButtonColor: "#DD6B55",   
    confirmButtonText: "Be gone with it!",   
    cancelButtonText: "No! I want the game.",   
    closeOnConfirm: false,   
    closeOnCancel: false }, function(isConfirm){
      if (isConfirm) { 
        userSvc.delGame(id).then(function(result){
          if(result === 'true'){
            $scope.user.games.splice(index, 1);
            swal("Deleted!", "Your game has been deleted!", "success");
          } else {
            swal("Oh no!", "Something went wrong. Try again!", "error");
          }
        });
      } else { swal("Cancelled", "Your game is safe :)", "error"); } 
    });
  };

  $scope.viewFriend = function(friend){
    userSvc.setCurFriend(friend);
    ModalService.showModal({
          templateUrl: "app/modaltemplates/friend.html",
          controller: "friend"
        }).then(function(modal) {
          modal.close.then(function(friend) {
             if(friend.remove){
              //delete friend 
             } 
          });
        });
  };
});