$("#addEditionButton").click(function() {
	$("#addEditionButton").addClass("disabled");
	$("#addEditionDiv").hide().removeClass('hide').slideDown();
});
 
$("#cancelAddEdition").click(function() {
	$("#addEditionButton").removeClass("disabled");
	$("#addEditionDiv").slideUp(); 
});
 
 //TODO
$("#addEditiofnForm").submit(function(){
	$("#addEditionButton").addClass("hidden");
	$("#addEditionButtonLoad").removeClass("hidden");
	$.ajax({
	type: 'POST',
	url: '/editions/ajouterEdition',
	data: $(this).serialize(),
	success: function(data){
	    $("#addEditionButton").removeClass("disabled");
		$("#addEditionDiv").slideUp(); 
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
