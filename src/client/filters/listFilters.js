fuckingRumorsApp.filter('slice', function() {
  return function(arr, start, limit) {
    return (arr || []).slice(start, start + limit);
  };
});