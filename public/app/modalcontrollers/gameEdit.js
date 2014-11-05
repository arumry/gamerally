app.controller('gameEdit', ['$scope', 'close', 'userSvc', function($scope, close, userSvc) {
  $scope.display = true;
  var game = userSvc.getCurGame();
  var d = new Date().setMinutes(0);
  $scope.starttime = d;
  $scope.endtime = d;
  $scope.hstep = 1;
  $scope.mstep = 15;
  $scope.game = game;
  $scope.submitGame = function(){
    $scope.display = false;
    var avail = {
      start: new Date($scope.starttime).getTime(),
      end: new Date($scope.endtime).getTime()
    };
    game.platform = $scope.platform;
    game.avail = avail;   
    close(game);
  };
  $scope.cancelGame = function(){
    close();
    console.log($scope.platform);
  };

}]);