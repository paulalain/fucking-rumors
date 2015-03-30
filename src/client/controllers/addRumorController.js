fuckingRumorsApp.controller('addRumorController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {

		$scope.waiting = true;
		$scope.displayError = false;
		$scope.error = "";
		$scope.artist = "";
		$scope.listArtists = [];

		$scope.loadArtist = function(){
			$http.get('/artists/')
				.success(function(data) {
					$scope.listArtists = data;
					$scope.waiting = false;
				})
				.error(function(data){
					$scope.error = data.error;
					$scope.displayError = true;
					$scope.waiting = false;
				});
		}

		$scope.emptyFields = function(){
			$scope.artist = "";
			$scope.displayError = false;
			$scope.error = "";
		};

		$scope.$on("emptyFieldsAddRumor", function (event, args) {
			$scope.emptyFields();
		});

		$scope.validateFields = function(){
			if(!$scope.artist){
				$scope.error = "L'artiste est obligatoire."
				return false;
			}

			return true;
		};

		$scope.updateListArtists = function(typed){
			$http.get('/artists/search/' + typed)
				.success(function(data) {
					$scope.listArtists = data;
				})
				.error(function(data){
					$scope.error = data.error;
					$scope.displayError = true;
					$scope.waiting = false;
				});
		}


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

		// load artists
		$scope.loadArtist();
	}]);