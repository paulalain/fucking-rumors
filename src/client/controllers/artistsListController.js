fuckingRumorsApp.controller('ArtistsListController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {
		$scope.artists = [];
		$scope.waiting = true;
        $scope.currentPage = 1;
        $scope.total = 0;
        $scope.pageSize = 10;
        $scope.filterValue = "";
        $scope.isVisibleAddArtist = false;

		$scope.$watch("filterValue", function (newValue){
        	$scope.total = $scope.artists.filter(function(elem){ return elem.name.indexOf($scope.filterValue) > -1; }).length;
		});

		$scope.toggleAddArtist = function(){
			if($scope.isVisibleAddArtist){
				$scope.isVisibleAddArtist = false;
			}else{
				$rootScope.$broadcast("emptyFieldsAddArtist");
				$scope.isVisibleAddArtist = true;
			}
		};

		$scope.$on("toggleAddArtist", function (newValue){
        	$scope.toggleAddArtist();
		});

		$scope.refresh = function(){
			$scope.waiting = true;

			// get artist list
			$http.get('/artistes/list')
				.success(function(data) {
					$scope.artists = data;
					$scope.total = $scope.artists.length;

					// get artist list subscriptions
					$http.get('/subscriptions/artistsSubscriptions')
						.success(function(data) {
							for(var i=0; i < $scope.artists.length; i++){
								console.log(data);
								if(data.indexOf($scope.artists[i]._id) != -1){
									$scope.artists[i].subscription = true;
									console.log($scope.artists[i].name + " true");
								}else{
									$scope.artists[i].subscription = false;
									console.log($scope.artists[i].name + " false");
								}
							}
							$scope.waiting = false;
						})
						.error(function(data) {
							$scope.waiting = false;
						});
			});
		};

		$scope.$on("refreshArtistsList", function (newValue){
        	$scope.refresh();
		});

		$scope.deleteArtist = function(id){
			if(id){
				$http.get('/artistes/supprimer/' + id)
					.success(function(data) {
						$scope.refresh();
					});
			}
		};

		$scope.updateArtist = function(id){
			$rootScope.$broadcast('openUpdateArtist', { id: id });
		};

		$scope.goToPage = function(page){
			$scope.currentPage = parseInt(page);
		};

		$scope.subscribeArtist = function(id){
			if(id){
				$http.get('/subscriptions/subscribeArtist/' + id)
					.success(function(data) {
						$scope.setSubscriptionValue(true, id);
					});
			}
		};

		$scope.unSubscribeArtist = function(id){
			if(id){
				$http.get('/subscriptions/unSubscribeArtist/' + id)
					.success(function(data) {
						$scope.setSubscriptionValue(false, id);
					});
			}
		};

		$scope.setSubscriptionValue = function(value, idArtist){
			for(var i=0; i < $scope.artists.length; i++){
				if($scope.artists[i]._id == idArtist){
					$scope.artists[i].subscription = value;
				}
			}
		};

		// get the list when page is loaded
		$scope.refresh();
	}]);