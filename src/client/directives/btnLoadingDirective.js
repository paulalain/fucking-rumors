fuckingRumorsApp.directive("btnLoading", function() {
    // Return the directive configuration.
    return({
        restrict: "E",
        replace: false,
        transclude: true,
        template: 
        "<button ng-show='!showWaitingButton' class='{{class}}' ng-transclude></button>" +
        "<button ng-show='showWaitingButton' class='{{class}} disabled' type='submit'>" +
                    "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>" +
                    "<span>{{label}}</span>" +
                   "</button>",
        link: function(scope, element, attrs){
           scope.label = (attrs.btnLabelLoading || "Chargement...");
           scope.class = (attrs.btnClassLoading || "btn");
           scope.$watch(attrs.btnLoading, function(newValue, oldValue) {
               scope.showWaitingButton = newValue;
           });
        }
    });

});