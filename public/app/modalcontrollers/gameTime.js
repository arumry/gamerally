app.controller('gameTime', ['$scope', 'close', 'userSvc', function($scope, close, userSvc) {
  $scope.display = true;
  var title = userSvc.getCurGame();
  $scope.title = title;
  $scope.close = function() {
    $scope.display = false;
 	  close();
  };

}]);