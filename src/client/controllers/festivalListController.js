fuckingRumorsApp.controller('festivalListController', ['$scope', '$http', '$timeout',
	function ($scope, $http, $timeout) {
		$scope.data = [];
		$scope.waiting = true;
        $scope.currentPage = 1;
        $scope.total = 0;
        $scope.pageSize = 10;
        $scope.filterValue = "";

		function reCalculateTotal(newValue, oldValue, scope){
			console.log("toto");
        	$scope.total = $scope.data.filter(function(elem){ return elem.indexOf($scope.filterValue) > -1; }).length;
		};

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
				$http.get('/festivals/supprimer/' + id)
					.success(function(data) {
						$scope.refresh();
					});
			}
		}

		$scope.$on("refreshFestivalList", function (event, args) {
			$scope.refresh();
		});

		$scope.goToPage = function(page){
			$scope.currentPage = parseInt(page);
		}

		// get the list when page is loaded
		$scope.refresh();
        $scope.$watch($scope.filterValue, reCalculateTotal);

	}]);