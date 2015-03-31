fuckingRumorsApp.controller('addRumorController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {

		$scope.waiting = true;
		$scope.displayError = false;
		$scope.error = "";
		$scope.artist = "";
		$scope.listArtists = [];
		$scope.artistChoosen = false;
		$scope.datePossible = true;
		$scope.rumors = [];
		$scope.official = false;

		$scope.loadArtist = function(){
			$http.get('/artistes/list')
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
			$scope.official = false;
			$scope.rumors = [];
			$scope.listArtists = [];
			$scope.artistChoosen = false;
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
			if(typed && typed != ""){
				$http.get('/artistes/search/' + typed)
				.success(function(data) {
					$scope.listArtists = data;
				})
				.error(function(data){
					$scope.error = data.error;
					$scope.displayError = true;
					$scope.waiting = false;
				});
			}else{
				$scope.loadArtist();
			}
		};

		$scope.addRumor = function(){
			if(!$scope.waiting){
				var validate = $scope.validateFields();
				if(validate){
					$http.post('/rumeurs/ajouter', { 
														idArtist: $scope.artist._id,
														idEdition : $scope.$parent.festival.editionInUse._id,
														rumors: $scope.rumors,
														official: $scope.official
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

		$scope.selectArtist = function(artist){
			console.log(artist.name);
			console.log(artist._id);
			$scope.artistChoosen = true;
		};

		$scope.addDate = function(){
			$scope.rumors.push({date: "", percentage: "", sources: ""});
		};

		$scope.listAvailableDates = function(){
			return ["bla", "bli", "blo"];
		};

		// load artists
		$scope.loadArtist();
	}]);