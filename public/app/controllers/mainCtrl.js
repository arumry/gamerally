app.controller('mainctrl', function($scope, $location){
	$scope.isActive = function() {
		return $location.path() === '/login';
	};
	$scope.bgimage = function(){
		return $location.path() === '/login';
	};

	$scope.bg = function(){
		return $location.path() === '/findgamer';
	};
});