fuckingRumorsApp.directive("btnLoading", function() {
    // Return the directive configuration.
    return({
        restrict: "A",
        replace: true,
        transclude: true,
        template: "<div>" + 
                  "<div ng-show='!showWaitingButton' ng-transclude></div>" +
                  "<button ng-show='showWaitingButton' class='btn btn-sm btn-default disabled' type='submit'>" +
                    "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>" +
                    "<span>{{label}}</span>" +
                   "</button>" +
                  "</div>",
        link: function(scope, element, attrs){
           scope.label = (attrs.btnLabelLoading || "Chargement...");
           scope.$watch(attrs.btnLoading, function(newValue, oldValue) {
               scope.showWaitingButton = newValue;
           });
        }
    });

});