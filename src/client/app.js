
$("#signupForm").submit(function(){
    $("#signupButton").addClass("hidden");
    $("#signupButtonLoad").removeClass("hidden");
	$.ajax({
    type: 'POST',
    url: '/signup',
    data: $(this).serialize(),
    success: function(data){
    	window.location.href = "/";
    },
    error: function(data){
        $('#errorSignup').html(data.responseJSON.error);
       	$('#errorSignupDiv').removeClass("hidden").addClass("show");
        $("#signupButton").removeClass("hidden");
        $("#signupButtonLoad").addClass("hidden");
    },
	});
});


$("#loginForm").submit(function(){
    $("#loginButton").addClass("hidden");
    $("#loginButtonLoad").removeClass("hidden");
    $.ajax({
    type: 'POST',
    url: '/login',
    data: $(this).serialize(),
    success: function(data){
        window.location.href = "/";
    },
    error: function(data){
        $('#errorSignup').html(data.responseJSON.error);
        $('#errorSignupDiv').removeClass("hidden").addClass("show");
        $("#loginButton").removeClass("hidden");
        $("#loginButtonLoad").addClass("hidden");
    },
    });
});
