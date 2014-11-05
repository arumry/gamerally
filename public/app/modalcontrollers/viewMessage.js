app.controller('viewMessage', ['$scope', 'close', 'messageService', function($scope, close, messageService) {
  var message = messageService.getCurMessage();
  $scope.replyActive = false;
  $scope.subject = message.message.subject;
  $scope.message = message.message.message;
  $scope.friend = message.sender;
  $scope.display = true;
  $scope.cancelReply = function(){
  	close();
  };
  $scope.messageReply = function(){
    $scope.replyActive = !($scope.replyActive);
  };

  $scope.sendMessage = function(){
    var id = $scope.friend._id;
    var message = {};
    message.subject = $scope.rSubject;
    message.message = $scope.rMessage;
    messageService.sendMessage(id, message).then(function(updated){
      if(updated === 'true'){
        swal("Sent!", "Your message was successfully sent.", "success");
        close();
      } else {
        swal("Oops...", "Something bad happened. Try again!", "error");
        close();
      }
    });
  };

  $scope.deleteMessage = function(){
    var id = message._id;
    swal({title: "Are you sure you want to delete this message?",   
    text: "You will not be able to recover this message after it is deleted!",   
    type: "warning",   
    showCancelButton: true,   
    confirmButtonColor: "#DD6B55",   
    confirmButtonText: "Be gone with it!",   
    cancelButtonText: "No! Keep the message.",   
    closeOnConfirm: false,   
    closeOnCancel: false }, function(isConfirm){
      if (isConfirm) { 
        messageService.delMessage(id).then(function(result){
          if(result === 'true'){
            swal("Boom!", "Message incinerated!", "success");
            close();
          } else {
            swal("Oh no!", "Something went wrong. Try again!", "error");
            close();
          }
        });
      } else { swal("Cancelled", "Your message is safe :)", "error"); } 
    });
  };
}]);