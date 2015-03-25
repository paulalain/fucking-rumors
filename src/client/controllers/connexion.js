fuckingRumorsApp.controller('connexionController', ['$scope', '$http', '$window',
    function ($scope, $http, $window) {
	    // function login
	    $scope.doLogin = function(){
	    	 $scope.waiting = true;
	    	 if($scope.login && $scope.password){
	    	 	$http.post('/login', { pseudoInputLogin: $scope.login, passwordInputLogin : $scope.password})
	    	 		.success(function(data) {
				       //todo redirect
				        $window.location.href = "/"
				    })
				    .error(function(data){
				    	// todo display error
				    	$scope.waiting = false;
				    });
	    	 }
	    };
}]);