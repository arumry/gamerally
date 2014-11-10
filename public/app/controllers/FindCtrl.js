app.controller('FindCtrl', function($scope, matchedGamer, userData, matchService, friendService, userSvc, ModalService){
	$scope.user = userData;
	$scope.displayButtons =  true;
	$scope.matchedGamers = matchedGamer.users;
	$scope.$watch('matchedGamers', function() {
       if($scope.matchedGamers.length === 0) {
       		$scope.matchedGamers.push({displayname: 'Limited results? Try refining your profile.', avatarlg: '/img/question.png'});
       		$scope.displayButtons = false;
       }
   	}, true);
   	$scope.showGamer = function(gamer){
   		userSvc.setCurFriend(gamer);
   		ModalService.showModal({
          templateUrl: "app/modaltemplates/previewgamer.html",
          controller: "previewGamer"
        });
   	};

	$scope.skip = function(gamer){
		var index = $scope.matchedGamers.indexOf(gamer);
		$scope.matchedGamers.splice(index, 1);
	};
	$scope.friendRequest = function(gamer){
		var id = gamer._id;
		friendService.requestFriend(id).then(function(result){
			$scope.skip(gamer);
			swal("Success!", "Friend request submitted. You can check the status in the friends tab of your profile page.", "success")
		});
	};
	$scope.doNotShow = function(gamer){
		var id = gamer._id;
		swal({   title: "Are you sure?",   
			text: "You will not be able see this gamer ever again!",   
			type: "warning",   
			showCancelButton: true,   
			confirmButtonColor: "#DD6B55",   
			confirmButtonText: "Yes, do it!",   
			cancelButtonText: "No, let me double check!",   
			closeOnConfirm: false,   
			closeOnCancel: false }, 
			function(isConfirm){   
				if (isConfirm) {     
					matchService.negateMatch(id).then(function(result){
						$scope.skip(gamer);
						swal("Success!", "You won't be seeing them again!", "success"); 
					});
				}	
				else {     
					swal("Cancelled", "I'm sure they appreciate it.", "error");   
				} 
			});	
	};
});