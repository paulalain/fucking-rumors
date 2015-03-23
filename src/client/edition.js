$("#addEditionButton").click(function() {
	$("#addEditionButton").addClass("disabled");
	$("#addEditionDiv").hide().removeClass('hide').slideDown();
});
 
$("#cancelAddEdition").click(function() {
	$("#addEditionButton").removeClass("disabled");
	$("#addEditionDiv").slideUp(); 
});
 
$("#addEditionForm").submit(function(){
	$("#addEditionButton").addClass("hidden");
	$("#addEditionButtonLoad").removeClass("hidden");
	$('#errorAddEditionDiv').addClass("hidden").removeClass("show");

	$.ajax({
	type: 'POST',
	url: '/editions/ajouterEdition',
	data: $(this).serialize(),
	success: function(data){
		// redirect to the page
		window.location.href = "/festivals/" + $("#idFestival").val();
	},
	error: function(data){
		if(data.responseJSON.error){
			$('#errorAddEdition').html(data.responseJSON.error);
		}else{
			$('#errorAddEdition').html("Une erreur s'est produite.");
		}
	    
	    $('#errorAddEditionDiv').removeClass("hidden").addClass("show");
	    $("#addEditionButton").removeClass("hidden");
	    $("#addEditionButtonLoad").addClass("hidden");
	},
	});
});

$(".delete-edition").click(function() {
	$.ajax({
	type: 'GET',
	url: $(this).attr("href"),
	success: function(data){
		// redirect to the same page
		window.location.reload();
	},
	error: function(data){
		//TODO
		if(data.responseJSON.error){
			$('#errorAddEdition').html(data.responseJSON.error);
		}else{
			$('#errorAddEdition').html("Une erreur s'est produite.");
		}
	},
	});
});
