fuckingRumorsApp.controller('festivalController', ['$scope', '$http', 
	function ($scope, $http) {
		$scope.id = "";
		$scope.festival = "";
		$scope.waiting = true;

		var urlSplitted = window.location.pathname.split("/");

		$scope.refresh = function(){
			$scope.waiting = true;
			$http.get('/festival/id/' + $scope.id)
				.success(function(fest) {
					$scope.festival = fest;
					$scope.waiting = false;
				})
				.error(function(data){
					//redirect 404
				});
		};

		$scope.deleteFestival = function(){
			if($scope.id){
				$http.get('/festival/supprimer/' + $scope.id)
					.success(function(data) {
						//goto festivals
					});
			}
		}

		$scope.$on("refreshFestival", function (event, args) {
			$scope.refresh();
		});

		$scope.goToPage = function(page){
			$scope.currentPage = parseInt(page);
		}

		// get the list when page is loaded
		if(urlSplitted.length > 1 && urlSplitted[2]){
			$scope.id = urlSplitted[2];
			$scope.refresh();
		}else{
			//redirect 404
		}
	}]);