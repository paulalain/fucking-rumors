$("#addEditionButton").click(function() {
	$("#addEditionButton").addClass("disabled");
	$("#addEditionDiv").hide().removeClass('hide').slideDown();
});
 
$("#cancelAddEdition").click(function() {
	$("#addEditionButton").removeClass("disabled");
	$("#addEditionDiv").slideUp(); 
});
 
$("#addEditionForm").submit(function(){
	$("#addEditionButtonSubmit").addClass("hidden");
	$("#addEditionButtonLoad").removeClass("hidden");
	$('#errorAddEditionDiv').addClass("hidden").removeClass("show");

	$.ajax({
		type: 'POST',
		url: '/editions/ajouterEdition',
		data: $(this).serialize(),
		success: function(data){
			// redirect to the page
			window.location.reload();
		},
		error: function(data){
			if(data.responseJSON.error){
				$('#errorAddEdition').html(data.responseJSON.error);
			}else{
				$('#errorAddEdition').html("Une erreur s'est produite.");
			}
		    
		    $("#errorAddEditionDiv").removeClass("hidden");
		    $("#addEditionButtonSubmit").removeClass("hidden");
		    $("#addEditionButtonLoad").addClass("hidden");
		}
	});
});
