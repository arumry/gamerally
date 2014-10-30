app.controller('gameTime', ['$scope', 'close', 'userSvc', function($scope, close, userSvc) {
  $scope.display = true;
  var title = userSvc.getCurGame();
  var d = new Date().setMinutes(0);
  $scope.starttime = d;
  $scope.endtime = d;
  $scope.hstep = 1;
  $scope.mstep = 15;
  $scope.title = title;
  $scope.submitTime = function(){
    $scope.display = false;
    var avail = {
      start: new Date($scope.starttime).getTime(),
      end: new Date($scope.endtime).getTime()
    }
    close(avail);
  };
  $scope.cancelGame = function(){
    close();
  };

}]);