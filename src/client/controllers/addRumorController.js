fuckingRumorsApp.controller('addRumorController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {

		$scope.waiting = false;
		$scope.displayError = false;
		$scope.error = "";

		$scope.emptyFields = function(){
			$scope.inputYear = "";
			$scope.inputDateStart = "";
			$scope.inputDateEnd = "";
			$scope.inputInUse = false;
			$scope.displayError = false;
			$scope.error = "";
		};

		$scope.$on("emptyFieldsAddRumor", function (event, args) {
			$scope.emptyFields();
		});

		$scope.validateFields = function(){
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


		$scope.addRumor = function(){
			if(!$scope.waiting){
				var validate = $scope.validateFields();
				if(validate){
					$http.post('/editions/ajouterEdition', { 
														inputYear: $scope.inputYear,
														inputDateStart : $scope.inputDateStart,
														inputDateEnd: $scope.inputDateEnd,
														inputInUse: $scope.inputInUse,
														idFestival: $scope.festival._id
													})
						.success(function(data) {
							$rootScope.$broadcast('toggleAddEdition');
							$rootScope.$broadcast('refreshFestival');
							$scope.waiting = false;
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