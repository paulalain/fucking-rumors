fuckingRumorsApp.controller('festivalListController', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('/festivals/list').success(function(data) {
            $scope.festivals = data;
    });
}]);