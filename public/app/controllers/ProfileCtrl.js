app.controller('ProfileCtrl', function($scope, userSvc, friendService, messageService, ModalService, userData, friendData, inboxData){
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

  var getMessage = function(){
    messageService.getAllMessages().then(function(messages){
                $scope.inbox = messages.inbox;
    });
  };

  var timeZone = function(){
    var userObj = {};
    var timezone = jstz.determine();
    var tName = timezone.name();
    if($scope.user.timezone !== tName) {
      $scope.user.timezone = tName;
      userObj.timezone = tName;
      userSvc.setUserSettings(userObj);
    }
  };
  
  $scope.user = userData;
  timeZone();
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
		userSvc.setCurGame(game);
		ModalService.showModal({
          templateUrl: "app/modaltemplates/gameEdit.html",
          controller: "gameEdit"
        }).then(function(modal) {
          modal.close.then(function(game) {
             if(!game){
             	return;
             } else {
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

  $scope.editGame = function(game){
    userSvc.setCurGame(game);
    ModalService.showModal({
          templateUrl: "app/modaltemplates/gameEdit.html",
          controller: "gameEdit"
        }).then(function(modal) {
          modal.close.then(function(game) {
             if(!game){
              return;
             } else {
              userSvc.editGame(game).then(function(updated){
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
    var id = game._id;
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

  $scope.viewMessage = function(message){
    var index = $scope.inbox.indexOf(message);
    messageService.setCurMessage(message);
    ModalService.showModal({
          templateUrl: "app/modaltemplates/viewmessage.html",
          controller: "viewMessage"
    }).then(function(modal) {
        modal.close.then(function() {
            getMessage();
        });
    });
  };

  $scope.deleteAllMail = function(){
    swal({title: "Are you sure you want to delete all your mail?",   
    text: "You will not be able to recover any of your mail!",   
    type: "warning",   
    showCancelButton: true,   
    confirmButtonColor: "#DD6B55",   
    confirmButtonText: "Be gone with it all!",   
    cancelButtonText: "No! I want the mail.",   
    closeOnConfirm: false,   
    closeOnCancel: false }, function(isConfirm){
      if (isConfirm) { 
        messageService.delAllMessages().then(function(result){
          if(result === 'true'){
            swal("Deleted!", "Your mail has been deleted!", "success");
            getMessage();
          } else {
            swal("Oh no!", "Something went wrong. Try again!", "error");
          }
        });
      } else { swal("Cancelled", "Your mail is safe :)", "error"); } 
    });
  };
  $scope.refreshMessages = function(){
    getMessage();
  };
});