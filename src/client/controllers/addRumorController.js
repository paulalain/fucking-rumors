fuckingRumorsApp.controller('AddRumorController', ['$rootScope', '$scope', '$http', '$filter',
	function ($rootScope, $scope, $http, $filter) {

		$scope.waiting = true;
		$scope.displayError = false;
		$scope.error = "";
		$scope.artist = "";
		$scope.listArtists = [];
		$scope.artistChoosen = false;
		$scope.datePossible = true;
		$scope.rumors = [];
		$scope.official = false;
		$scope.listAvailableDates = [];
		$scope.calendarDates = [];

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
			$scope.listAvailableDates = [];
			$scope.calendarDates = [];
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

			//check for each rumors
			for(var i = 0; i < $scope.rumors.length; i++){
				var rumor = $scope.rumors[i];
				if(!rumor.date){
					$scope.error = "Toutes les dates des rumeurs sont obligatoires."
					return false;
				}

				if(!rumor.percentage){
					$scope.error = "Toutes les pourcentages des rumeurs sont obligatoires."
					return false;
				}
			}

			return true;
		};

		$scope.updateListArtists = function(typed){
			if(typed && typed != "" && typed != null){
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

		function convertDate(){
			var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
			
			for(var i=0; i<$scope.rumors.length; i++){
				$scope.rumors[i].date = new Date($scope.rumors[i].date.replace(pattern,'$3-$2-$1'));
			}
		}

		$scope.addRumor = function(){
			if(!$scope.waiting){
				var validate = $scope.validateFields();
				if(validate){
					//convert string dates to Date
					convertDate();
					$http.post('/rumeurs/ajouter', { 
														idArtist: $scope.artist._id,
														idEdition : $scope.$parent.festival.editionInUse._id,
														rumors: $scope.rumors,
														official: $scope.official
													})
						.success(function(data) {
							$rootScope.$broadcast('toggleAddRumor');
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
			$scope.artistChoosen = true;
			$scope.artist = artist;
			$scope.calendarDates = $scope.calendarRumors();
		};

		$scope.addDate = function(){
			//used dates not displayed
			var usedDates = [];
			for(var i = 0; i < $scope.rumors.length; i++){
				usedDates.push($scope.rumors[i].date);
			}
			// dates

			//set the last rumor to disabled
			if($scope.rumors.length > 0){
				$scope.rumors[$scope.rumors.length-1].disabled = true;
			}

			$scope.rumors.push(
				{
					listAvailableDates: listAvailableDatesCalculate($scope.$parent.festival.editionInUse.date.start, $scope.$parent.festival.editionInUse.date.end, usedDates),
					date: "",
					percentage: 50,
					sources: "",
					disabled: false
				});
		};

		listAvailableDatesCalculate = function(startDate, endDate, usedDates){
			//get possibles dates from festival edition dates
			var listDates = []
			for (var d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
			    if(usedDates.indexOf($filter('date')(d, "dd/MM/yyyy")) == -1){
			    	listDates.push(new Date(d));
			    }
			}

			return listDates;
		};

		$scope.calendarRumors = function(){
			var rumors = [];
			var dateStart = new Date($scope.$parent.festival.editionInUse.date.start);
			dateStart.setDate(dateStart.getDate() - 10);
			var dateEnd = new Date($scope.$parent.festival.editionInUse.date.end);
			dateEnd.setDate(dateEnd.getDate() + 10);

			if(!!$scope.artist){
				for(var i=0;i<$scope.artist.rumors.length;i++){
					var rumor = $scope.artist.rumors[i];
					for(var j=0;j<rumor.rumors.length;j++){
						//get date only if date is ten days before or after festival
						if(new Date(rumor.rumors[j].date) > dateStart && new Date(rumor.rumors[j].date) < dateEnd){
							var rumorToAdd = rumor.rumors[j];
							rumorToAdd.festival = rumor.festival;
							rumorToAdd.edition = rumor.edition;
							rumorToAdd.official = rumor.official;
							rumors.push(rumorToAdd);
						}
						
					}
				}
			}

			return rumors;
		}

		// load artists
		$scope.loadArtist();
		
	}]);