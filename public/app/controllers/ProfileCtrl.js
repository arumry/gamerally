app.controller('ProfileCtrl', function($scope, userSvc, friendService, ModalService, userData, friendData, inboxData){
	var friendCounter = function(status, arr){
    var counter = 0;
    for (var i = 0; i < arr.length; i++) {
      if(arr[i].status === status){
        counter += 1;
      }
    }
    return counter;
  };
  var checkType = function(type, arr){
    for (var i = 0; i < arr.length; i++) {
      if(arr[i].name == $scope.user.type){
        return i;
      }
    }
    return 0;
  };
  $scope.user = userData;
  $scope.inbox = inboxData.inbox;
	$scope.gameTitle = '';
  $scope.allFriends = friendData;
  $scope.pendingFriends = friendCounter('pending', friendData);
  $scope.requestedFriends = friendCounter('requested', friendData);
  $scope.gamerTypes = [{name: 'Casual'},{ name: 'Hardcore'},{ name: 'Pro'}];
  $scope.selectedType = $scope.gamerTypes[checkType($scope.user.type, $scope.gamerTypes)];
  
  $scope.getAllFriends = function(){
    friendService.getAllFriends().then(function(friends){
      $scope.allFriends = friends;
    });
  };
  
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
    var index = $scope.allFriends.indexOf(friend);
    userSvc.setCurFriend(friend);
    ModalService.showModal({
          templateUrl: "app/modaltemplates/friend.html",
          controller: "friend"
    }).then(function(modal) {
          modal.close.then(function() {
            $scope.getAllFriends();
          });
    });
  };

  $scope.saveUserSettings = function(){
    var updatedUser = {};
    updatedUser.type = $scope.selectedType.name;
    updatedUser.age = $scope.user.age;
    updatedUser.info = $scope.user.info;
    userSvc.setUserSettings(updatedUser).then(function(){
      swal("Success!", "Your user settings have been updated.", "success");
    }, function(){
      swal("Uh oh!", "Something unexpected happened. Try savings your settings again!", "error");
    });
  };
});