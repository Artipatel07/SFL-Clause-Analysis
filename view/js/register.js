$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
        var password = $("#registerForm input[name=password]").val();
        var confirm = $("#registerForm input[name=confirm]").val();
        if (password === confirm) {
            var formData = {
                username: $("#registerForm input[name=username]").val(),
                email: $("#registerForm input[name=email]").val(),
                fullName: $("#registerForm input[name=fullName]").val(),
                password: $("#registerForm input[name=password]").val(),
                confirm: $("#registerForm input[name=confirm]").val(),
            };
            $.ajax({
                type: "POST",
                url: backendPort + "/users/signup",
                data: formData,
                dataType: "json",
                encode: true,
                success: function(data) {
                    //document.cookie = "token=" + data.token + "";
                    $.cookie("token", data.token);
                    $.cookie("username", data.username);
                    setTimeout(() => {
                        window.location.href = '/views/dashboard';
                    }, 1000);

                },
                error: function(xhr, status, error) {
                    console.log(status);
                    console.log(error);
                }
            });
        } else {
            $('#errorDisplay').html('password didnot match');
        }
        e.preventDefault();
    });
});