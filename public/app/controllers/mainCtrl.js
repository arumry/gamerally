app.controller('mainctrl', function($scope, $location){
	var cssClass = 'steam-back';
	$scope.isActive = function() {
		return $location.path() === '/login';
	};
	$scope.bgimage = function(){
		if($location.path() === '/login') return cssClass;
	}
});