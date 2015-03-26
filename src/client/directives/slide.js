fuckingRumorsApp
.directive("bnSlideShow", function() {
    function link(scope, element, attributes ) {
        var expression = attributes.bnSlideShow;
        var duration = (attributes.slideShowDuration || "fast");

        if (!scope.$eval(expression)) {
            element.hide();
        }

        scope.$watch(expression, function(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            if (newValue) {
                element.stop(true, true).slideDown(duration);
            } else {
                element.stop(true, true).slideUp( duration );
            }
        });
    }

    // Return the directive configuration.
    return({
        link: link,
        restrict: "A"
    });

});