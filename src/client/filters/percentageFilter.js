fuckingRumorsApp.filter('percentageFilter', function() {
	return function(input, percentage) {
		if(!!percentage){
			var filteredPercentage = [];
			angular.forEach(input, function(item) {
				angular.forEach(item.rumors, function(rumor) {
					if (percentage && (rumor.percentage >= percentage)){
						filteredPercentage.push(item);
						return;
					}
				});
			});

			return filteredPercentage;
		}else{
			return input;
		}
		
	};
});