fuckingRumorsApp.controller('addFestivalController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {

		$scope.isVisible = false;
		$scope.waiting = false;
		$scope.displayError = false;
		$scope.error = "";
		$scope.isUpdate = false;
		$scope.name = "";
		$scope.city = "";
		$scope.country = "";
		$scope.website = "";
		$scope.facebook = "";
		$scope.twitter = "";

		emptyFields = function(){
			$scope.name = "";
			$scope.city = "";
			$scope.country = "";
			$scope.website = "";
			$scope.facebook = "";
			$scope.twitter = "";
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

		validateFieldsAddFestival = function(){
			if(!$scope.name){
				$scope.error = "Le nom du festival est obligatoire."
				return false;
			}
			if(!$scope.city){
				$scope.error = "La ville du festival est obligatoire."
				return false;
			}
			if(!$scope.country){
				$scope.error = "Le pays du festival est obligatoire."
				return false;
			}

			return true;
		};

		validateFieldsUpdateFestival = function(){
			if(!$scope.idFestival){
				$scope.error = "L'id du festival est obligatoire."
				return false;
			}
			

			return validateFieldsAddFestival();
		};

		$scope.submit = function(){
			if(!$scope.isUpdate){
				$scope.addFestival();
			}else{
				$scope.launchUpdateFestival();
			}
		};

		$scope.addFestival = function(){
			if(!$scope.waiting){
				var validate = validateFieldsAddFestival();
				if(validate){
					$http.post('/festival/ajouter', { 
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
							$rootScope.$broadcast('refreshFestivalList');
							emptyFields();
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
		
		$scope.$on("openUpdateFestival", function (event, args) {
			$scope.openUpdateFestival(args.id);
		});

		$scope.openUpdateFestival = function(id){
			$scope.idFestival = id;
			$scope.isUpdate = true;
			$http.get('/festival/id/' + $scope.idFestival)
				.success(function(fest) {
					if(!!fest.location){
						$scope.city = fest.location.city;
						$scope.country = fest.location.country;
					}else{
						$scope.city = "";
						$scope.country = "";
					}
					$scope.website = fest.website;
					$scope.facebook = fest.facebook;
					$scope.twitter = fest.twitter;
					$scope.name = fest.name;

					//open form
					$scope.isVisible = true;
				})
				.error(function(data){
					//redirect 404
				});
		};

		$scope.launchUpdateFestival = function(){
			if(!$scope.waiting){
				var validate = validateFieldsUpdateFestival();
				if(validate){
					$http.post('/festival/modifier', { 
														inputIdFestival: $scope.idFestival,
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
							$rootScope.$broadcast('refreshFestivalList');
							emptyFields();
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