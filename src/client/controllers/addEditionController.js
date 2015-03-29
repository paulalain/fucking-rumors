fuckingRumorsApp.controller('addEditionController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {

		$scope.isVisible = false;
		$scope.waiting = false;
		$scope.displayError = false;
		$scope.error = "";

		emptyFields = function(){
			$scope.inputYear = "";
			$scope.inputDateStart = "";
			$scope.inputDateEnd = "";
			$scope.inputInUse = false;
		};

		$scope.toggle = function(){
			emptyFields();
			if($scope.isVisible){
				$scope.isVisible = false;
				$scope.displayError = false;
				$scope.error = "";
			}else{
				$scope.isVisible = true;
			}
		};

		validateFields = function(){
			if(!$scope.inputYear){
				$scope.error = "Le libellé de l'édition est obligatoire."
				return false;
			}
			
			if(!$scope.inputDateStart){
				$scope.error = "La date de début de l'édition est obligatoire."
				return false;
			}
			
			if(!$scope.inputDateEnd){
				$scope.error = "La date de fin de l'édition est obligatoire."
				return false;
			}

			return true;
		};


		$scope.addEdition = function(){
			if(!$scope.waiting){
				var validate = validateFields();
				if(validate){
					$http.post('/editions/ajouterEdition', { 
														inputYear: $scope.inputYear,
														inputDateStart : $scope.inputDateStart,
														inputDateEnd: $scope.inputDateEnd,
														inputInUse: $scope.inputInUse,
														idFestival: $scope.festival._id
													})
						.success(function(data) {
							$scope.waiting = false;
							$scope.displayError = false;
							$scope.error = "";
							$scope.isVisible = false;
							emptyFields();
							$rootScope.$broadcast('refreshFestival');
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