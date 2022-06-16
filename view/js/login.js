$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        var formData = {
            email: $("#loginForm input[name=email]").val(),
            password: $("#loginForm input[name=password]").val(),
        };
        $.ajax({
            type: "POST",
            url: backendPort + "/users/signin",
            data: formData,
            dataType: "json",
            encode: true,
            success: function(data) {
                //document.cookie = "token=" + data.token + "";
                $.cookie("token", data.token);
                $.cookie("username", data.username);
                setTimeout(() => {
                    window.location.href = window.location.href + '/dashboard';
                }, 1000);

            },
            error: function(xhr, status, error) {
                console.log(status);
                console.log(error);
            }
        });
        e.preventDefault();
    });
});