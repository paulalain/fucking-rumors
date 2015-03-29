fuckingRumorsApp.controller('festivalListController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {
		$scope.festivals = [];
		$scope.waiting = true;
        $scope.currentPage = 1;
        $scope.total = 0;
        $scope.pageSize = 10;
        $scope.filterValue = "";

		$scope.$watch("filterValue", function (newValue){
        	$scope.total = $scope.festivals.filter(function(elem){ return elem.name.indexOf($scope.filterValue) > -1; }).length;
		});

		$scope.refresh = function(){
			$scope.waiting = true;
			$http.get('/festivals/list')
				.success(function(data) {
					$scope.festivals = data;
					$scope.waiting = false;
					$scope.total = $scope.festivals.length;
			});
		};

		$scope.deleteFestival = function(id){
			if(id){
				$http.get('/festival/supprimer/' + id)
					.success(function(data) {
						$scope.refresh();
					});
			}
		};

		$scope.updateFestival = function(id){
			$rootScope.$broadcast('openUpdateFestival', { id: id });
		};

		$scope.$on("refreshFestivalList", function (event, args) {
			$scope.refresh();
		});

		$scope.goToPage = function(page){
			$scope.currentPage = parseInt(page);
		};

		// get the list when page is loaded
		$scope.refresh();
	}]);