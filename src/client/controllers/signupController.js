fuckingRumorsApp.controller('SignupController', ['$scope', '$http', '$window',
    function ($scope, $http, $window) {
	   
	    $scope.waiting = false;

	    // function validate
	    $scope.validation = function(){
	   		if(!$scope.pseudo){
	   			$scope.displayError = true;
	   			$scope.error = "Aucun pseudo n'est rentré."
	   			return false;
	   		}else if(!$scope.mail){
	   			$scope.displayError = true;
	   			$scope.error = "Aucune adresse mail n'est rentrée."
	   			return false;
	   		}else if(!$scope.password){
	   			$scope.displayError = true;
	   			$scope.error = "Aucun mot de passe n'est rentré."
	   			return false;
	   		}else if(!$scope.passwordConfirmation){
	   			$scope.displayError = true;
	   			$scope.error = "Aucune confirmation de mot de passe n'est rentrée."
	   			return false;
	   		}

	   		return true;
	   };

	    // function signup
	    $scope.doSignup = function(){
	    	 $scope.waiting = true;
	    	 $scope.displayError = false;

	    	 // do form validation
	    	 var validate = $scope.validation();

	    	 if(validate){
	    	 	$http.post('/signup', { inputPseudoInscription: $scope.pseudo, 
	    	 							inputEmailInscription : $scope.mail,
	    	 							inputPasswordInscription : $scope.password,
	    	 							inputPasswordInscriptionConfirmation : $scope.passwordConfirmation
	    	 						})
	    	 		.success(function(data) {
				        $window.location.href = "/"
				    })
				    .error(function(data){
				    	$scope.error = data.error;
				    	$scope.displayError = true;
				    	$scope.waiting = false;
				    });
	    	 }else{
	    	 	$scope.waiting = false;
	    	 }
	    };
}]);

