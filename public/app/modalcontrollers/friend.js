app.controller('friend', ['$scope', 'close', 'userSvc', function($scope, close, userSvc) {
  $scope.display = true;
  var friend = userSvc.getCurFriend();
  $scope.friend = friend.friend;
  $scope.closeFriend = function(){
    $scope.display = false;
    close();
  };
  $scope.delFriend = function(){
    $scope.display = false;
    close() //boolean whether to delete friend
  }
}]);