$("#addFestivalButton").click(function() {
	$("#addFestivalButton").addClass("disabled");
	$("#addFestivalForm").hide().removeClass('hide').slideDown();
});
 
$("#cancelAddFestival").click(function() {
	$("#addFestivalButton").removeClass("disabled");
	$("#addFestivalForm").slideUp(); 
});
 