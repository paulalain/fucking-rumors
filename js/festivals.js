$("#addFestivalButton").click(function() {
	$("#addFestivalButton").prop('disabled', true);
	$("#addFestivalForm").hide().removeClass('hide').slideDown();
});
 
$("#cancelAddFestival").click(function() {
	$("#addFestivalButton").prop('disabled', false);
	$("#addFestivalForm").slideUp();
});
 