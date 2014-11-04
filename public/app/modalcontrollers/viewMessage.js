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
}]);