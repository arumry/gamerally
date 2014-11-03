app.controller('mainctrl', function($scope, $location){
	$scope.isActive = function() {
    	return $location.path() === '/login';
	};
});