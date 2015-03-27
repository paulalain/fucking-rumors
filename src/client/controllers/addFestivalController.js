fuckingRumorsApp.controller('addFestivalController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {

		$scope.isVisible = false;
		$scope.waiting = false;
		$scope.displayError = false;
		$scope.error = "";

		$scope.toggle = function(){
			if($scope.isVisible){
				$scope.isVisible = false;
				$scope.displayError = false;
				$scope.error = "";
			}else{
				$scope.isVisible = true;
			}
		};

		validateFields = function(){
			if(!$scope.name){
				$scope.error = "Le nom du festival est obligatoire."
				return false;
			}

			return true;
		};

		emptyFields = function(){
			$scope.name = "";
			$scope.city = "";
			$scope.country = "";
			$scope.website = "";
			$scope.facebook = "";
			$scope.twitter = "";
		};

		$scope.addFestival = function(){
			if(!$scope.waiting){
				var validate = validateFields();
				if(validate){
					$http.post('/festivals/ajouterFestival', { 
														inputName: $scope.name,
														inputCity : $scope.city,
														inputCountry: $scope.country,
														inputWebsite: $scope.website,
														inputFacebook: $scope.facebook,
														inputTwitter: $scope.twitter
													})
						.success(function(data) {
							$scope.waiting = false;
							$scope.displayError = false;
							$scope.error = "";
							$scope.isVisible = false;
							emptyFields();
							$rootScope.$broadcast('refreshFestivalList');
						})
						.error(function(data){
							$scope.error = data.error;
							$scope.displayError = true;
							$scope.waiting = false;
						});
				}else{
					$scope.waiting = false;
					$scope.displayError = true;
				}
			}
		};
	}]);