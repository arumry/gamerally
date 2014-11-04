app.controller('friend', ['$scope', 'close', 'userSvc', 'friendService', 'ModalService', 'messageService', function($scope, close, userSvc, friendService, ModalService, messageService) { 
  var friend = userSvc.getCurFriend();
  messageService.setReceiverId(friend._id);
  $scope.friendButton = (friend.status === 'pending');
  $scope.display = true;
  $scope.friend = friend.friend;
  $scope.closeFriend = function(){
    $scope.display = false;
    close();
  };
  $scope.delFriend = function(){
    $scope.display = false;
    swal({   
      title: "Are you sure?",   
      text: "Your friendship will be deleted. Please note that old messages sent from this friend will still be present in your account until you remove them.",   
      type: "warning",   
      showCancelButton: true,   
      confirmButtonColor: "#DD6B55",   
      confirmButtonText: "Yes, delete them!",   
      cancelButtonText: "No, cancel please!",   
      closeOnConfirm: false,   
      closeOnCancel: false }, 
      function(isConfirm){
        if (isConfirm) {
          friendService.deleteFriend(friend.friend._id).then(function(){
            swal("Removed friend!", "Sorry they didn't work out.", "success");
            close();  
          }, function(){
            swal("Uh oh!", "Something unexpected happened. Try again!", "error");
            close(); 
          });
        } else { 
          swal("Friend removal cancelled", "You're a real life saver!", "error"); 
          close();  
        } });  
  };
  $scope.acceptFriend = function(){
    $scope.display = false;
    friendService.requestFriend(friend.friend._id).then(function(result){
        swal("Friend added", "Have fun gaming together!", "success");
        close(); 
    });      
  };

  $scope.messageSend = function(){
    ModalService.showModal({
          templateUrl: "app/modaltemplates/message.html",
          controller: "message"
    }).then(function(modal) {
          modal.close.then(function() {

          });
    });   
  };
  
}]);