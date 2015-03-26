fuckingRumorsApp.controller('festivalListController', ['$scope', '$http',
	function ($scope, $http) {
		
		$http.get('/festivals/list')
			.success(function(data) {
				$scope.festivals = data;
			});

		$scope.refresh = function(){
			$http.get('/festivals/list')
				.success(function(data) {
					$scope.festivals = data;
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

	}]);