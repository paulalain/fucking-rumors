fuckingRumorsApp.controller('addArtistController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {

		$scope.waiting = false;
		$scope.displayError = false;
		$scope.error = "";

		$scope.emptyFields = function(){
			$scope.name = "";
			$scope.img = "";
			$scope.website = "";
			$scope.facebook = false;
			$scope.twitter = false;
			$scope.instagram = false;

			$scope.displayError = false;
			$scope.error = "";
		};

		$scope.$on("emptyFieldsAddRumor", function (event, args) {
			$scope.emptyFields();
		});

		$scope.validateFields = function(){
			if(!$scope.name){
				$scope.error = "Le nom de l'artiste est obligatoire."
				return false;
			}

			return true;
		};


		$scope.submit = function(){
			if(!$scope.waiting){
				var validate = $scope.validateFields();
				if(validate){
					$http.post('/artistes/ajouter', { 
														name: $scope.name,
														website : $scope.website,
														facebook: $scope.facebook,
														instagram: $scope.instagram,
														twitter: $scope.twitter,
														img: $scope.img
													})
						.success(function(data) {
							$rootScope.$broadcast('toggleAddRumor');
							$rootScope.$broadcast('refreshListArtists');
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