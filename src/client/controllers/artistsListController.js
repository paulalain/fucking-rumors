fuckingRumorsApp.controller('artistsListController', ['$rootScope', '$scope', '$http', 
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
			$http.get('/artistes/list')
				.success(function(data) {
					$scope.artists = data;
					$scope.waiting = false;
					$scope.total = $scope.artists.length;
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

		// get the list when page is loaded
		$scope.refresh();
	}]);