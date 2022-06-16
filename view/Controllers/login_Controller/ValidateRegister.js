$('#RegisterForm').validate({
    rules: {
        Password: {
            required: true,
            pwcheck: true,
            minlength: 8
        },
        Password2: {
            required: true,
            equalTo: '#Password'
        }
    },
    //For custom messages
    messages: {
        Password: {
            required: "Enter a password",
            pwcheck: "Password must contain at least one digit, one Upper case and one lower case character",
            minlength: "It must 8 characters long"
        },
        Password2: {
            equalTo: "Password does not match"
        }
    },
}); $.validator.addMethod("pwcheck", function (value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /[A-Z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
});

// as user enters inputs, it is verified 
colorInvalidandBlankInputs();
function colorInvalidandBlankInputs() {
    $(document).ready(function () {

        $('#Name').keyup(function () {
            if ($(this).val() == '' || $(this).val().length < 6) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
                $('#Name-error').hide();
            }
        });


        $('#Email').keyup(function () {
            if ($(this).val() == '' || $(this).val().length < 6) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $('#Email-error').hide();
                $(this).addClass('valid')
            }
        });

        $('#Password').keyup(function () {
            //at least 1 : lowercase, uppercase, numeric, one special character, 
            //length 8
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            if ($(this).val() == '' || $(this).val().length < 6 || !($(this).val().match(/^[A-Za-z0-9\d=!\-@._*]+$/))) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
                $('#Password-error').hide();
            }
        });

        $('#Password2').keyup(function () {

            if ($(this).val() == '' || $(this).val().length < 6 || $('#Password2').val() != $('#Password').val()) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
                $('#Password2-error').hide();
            }
        });

        $('#University').keyup(function () {

            if ($(this).val() == '' || $(this).val().length < 6) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
                $('#University-error').hide();
            }
        });


        $('#RegisterForm input').keyup(function () {
            disableButton();
        })


    });
}

function disableButton() {
    if ($('#Name').hasClass('valid') && $('#Email').hasClass('valid') && $('#Password').hasClass('valid') && $('#Password2').hasClass('valid') && $('#University').hasClass('valid')) {
        $('#SignUpButton').removeClass('disabled');
    }
    else {
        $('#SignUpButton').addClass('disabled');
    }
}


