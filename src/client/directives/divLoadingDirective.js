fuckingRumorsApp.directive('divLoading', function () {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div>' + 
                '<div ng-show="!showLoading" ng-transclude></div>' +
                '<div ng-show="showLoading" class="loading">' +
                   '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>' +
                   '<span>{{label}}</span>' +
                '</div>' +
              '</div>',
    link: function (scope, element, attrs) {
      scope.label = (attrs.divLoadingLabel || "Chargement...");
      
      scope.$watch(attrs.divLoading, function (val) {
        if (val){
          scope.showLoading = true;
        }else{
          scope.showLoading = false;
        }
      });
    }
  }
});