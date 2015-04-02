fuckingRumorsApp.filter('urlEncode', function() {
	return function(input) {
		if(!!input){
			return encodeURIComponent(input.replace(new RegExp(' ', 'g'), '-'));
		}else{
			return "";
		}
  		
  	}
});