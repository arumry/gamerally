app.controller('previewGamer', ['$scope', 'close', 'userSvc', function($scope, close, userSvc) { 
  var friend = userSvc.getCurFriend(); 
  $scope.display = true;
  $scope.friend = friend;
  $scope.closeGamer = function(){
    close();
  };
}]);