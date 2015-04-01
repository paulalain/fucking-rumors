fuckingRumorsApp.controller('festivalController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {
		$scope.id = "";
		$scope.festival = "";
		$scope.waiting = true;

		$scope.isVisibleAddEdition = false;
		$scope.isVisibleAddRumor = false;
		$scope.isVisibleUpdateFestival = false;

		var urlSplitted = window.location.pathname.split("/");

		$scope.classButtonsDisabled = function(){
			return ($scope.isVisibleAddEdition || $scope.isVisibleUpdateFestival || $scope.isVisibleAddRumor);
		}

		$scope.toggleAddEdition = function(){
			if($scope.isVisibleAddEdition){
				$scope.isVisibleAddEdition = false;
			}else{
				$rootScope.$broadcast("emptyFieldsAddEdition");
				$scope.isVisibleAddRumor = false;
				$scope.isVisibleUpdateFestival = false;
				$scope.isVisibleAddEdition = true;
			}
		};

		$scope.$on("toggleAddEdition", function (event, args) {
			$scope.toggleAddEdition();
		});

		$scope.toggleAddRumor = function(){
			if($scope.isVisibleAddRumor){
				$scope.isVisibleAddRumor = false;
			}else{
				$rootScope.$broadcast("emptyFieldsAddRumor");
				$scope.isVisibleAddEdition = false;
				$scope.isVisibleUpdateFestival = false;
				$scope.isVisibleAddRumor = true;
			}
		};

		$scope.$on("toggleAddRumor", function (event, args) {
			$scope.toggleAddRumor();
		});

		$scope.toggleUpdateFestival = function(){
			//broadcast empty fields
/*			if($scope.isVisibleUpdateFestival){
				$scope.isVisibleUpdateFestival = false;
			}else{
				$scope.isVisibleUpdateFestival = true;
			}*/
		};

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
		};

		$scope.$on("refreshFestival", function (event, args) {
			$scope.refresh();
		});

		$scope.goToPage = function(page){
			$scope.currentPage = parseInt(page);
		};

		// get the list when page is loaded
		if(urlSplitted.length > 1 && urlSplitted[2]){
			$scope.id = urlSplitted[2];
			$scope.refresh();
		}else{
			//redirect 404
		}
	}]);