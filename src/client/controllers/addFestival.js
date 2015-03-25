fuckingRumorsApp.controller('addFestivalController', ['$scope', '$http',
    function ($scope, $http) {
       
       $scope.isVisible = false;

       $scope.toggle = function(){
       		if($scope.isVisible){
       			$scope.isVisible = false;
       		}else{
       			$scope.isVisible = true;
       		}
       }


}]);