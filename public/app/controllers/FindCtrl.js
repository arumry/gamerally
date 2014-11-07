app.controller('FindCtrl', function($scope, matchedGamer, userData, matchService){
	$scope.user = userData;
	$scope.matchedGamer = matchedGamer;
});