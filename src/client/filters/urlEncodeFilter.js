fuckingRumorsApp.filter('urlEncode', function() {
	return function(input) {
  		return encodeURIComponent(input.replace(new RegExp(' ', 'g'), '-'));
  	}
});