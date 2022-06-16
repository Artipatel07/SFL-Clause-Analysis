//fetch profile picture
let profilePic = {}
//var port2 = "http://localhost:8000/"
let user = "ObjectId('" + idofuser + "')"
getProfilePic();


async function updateUsername() {
  return new Promise(function (resolve, reject) {
    $.post(
      port2 + "UpdateUsername", {
        "usernameToChange": $('#changeUsername').val()
      },
      function (data) {
        //var res = data;
        if (data == 'Success, your username has been updated') {
          $('#username-error').html(data);
          $('#username-error').css({ 'color': 'green' }).show().delay(2000).slideUp();
        }
        else {
          $('#username-error').html(data);
          $('#username-error').show().delay(2000).slideUp();
        }
        resolve(data);
      }
    );
  });
}


async function getProfilePic() {
  profilePic = await profilePicture();
  if (profilePic.metadata != null) {
    $('#profileButton, #editProfilePic').attr("src", port2 + 'Pic/GetProfilePic/ObjectId("' + profilePic.metadata + '")');
  }
}



async function profilePicture() {
  return new Promise(function (resolve, reject) {
    $.get(
      port2 + "Pic/Profile/" + idofuser,
      function (data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}

function initUserCard() {

  $('#profileButton').click(function (e) {
    if ($('#profileCard').css('display') == 'none') {
      $('#profileCard').show();
      //$('#profileCard').css({ top: e.pageY + 3 + 'px', left: e.pageX - $('#profileCard').width() })
      $('#profileCard').css({ top: e.pageY + 3 + 'px' })
    }
    else {
      $('#profileCard').hide();
    }
  });


  $('#userCard').click(function () {
    $('#updateUser').slideDown();
    $('#profileCard').hide();
    var height = $(document).height();
    $('#overlay').css({ 'height': height + 'px' }).show();
  });

  $('#closeUpdateUser').click(function () {
    $('#updateUser').slideUp();
    $('#overlay').hide();
  });

  $('#closePasswordCard').click(function () {
    $('#changePasswordCard').hide();
    $('#overlay').hide();
    $('#changePassword').val('');
    $('#changeCPassword').val('');
    $('#oldPassword').val('')
  });

  $('#changePasswordOption').click(function () {
    $('#changePasswordCard').show();
    $('#overlay').show();
    $('#profileCard').hide();
  });

  $('#newPassword').keyup(function () {
    if ($(this).val() == null) {
      $(this).addClass('invalid')
      $(this).removeClass('valid')
    }
    else {
      $(this).removeClass('invalid');
      $(this).addClass('valid');
      $('#newPassword-error').hide();
    }
  })

  $('#changeUsername').keyup(function () {
    if ($(this).val() == null || $(this).val().length < 8) {
      $(this).addClass('invalid')
      $(this).removeClass('valid')
    }
    else {
      $(this).removeClass('invalid');
      $(this).addClass('valid');
      $('#changeUsername-error').hide();
    }
  })

  $('#UsernameUpdate').click(() => {
    if ($('#changeUsername').hasClass('valid')) {
      updateUsername();
    }
  })

  //valiate email change 
  // update email validation
  $('#updateEmail').validate({
    rules: {
      changeEmail: {
        required: true,
        email: true,
        minlength: 8
      }
    },
    //For custom messages
    messages: {
      changeEmail: {
        required: "Enter a password",
        email: "Wrong Format",
        minlength: "It must 8 characters long"
      }
    }, errorElement: 'div',
    errorPlacement: function (error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
  });

  //valiate username change 
  // update username validation
  $('#updateUsername').validate({
    rules: {
      changeUsername: {
        required: true,
        noSpace: true,
        minlength: 8
      }
    },
    //For custom messages
    messages: {
      changeEmail: {
        required: "Enter a password",
        email: "Wrong Format",
        minlength: "It must 8 characters long"
      }
    }, errorElement: 'div',
    errorPlacement: function (error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
  });

  $('#changeEmail').keyup(function () {
    if ($(this).val().length < 6) {
      $(this).addClass('invalid')
      $(this).removeClass('valid')
    }
    else {
      $(this).removeClass('invalid');
      $(this).addClass('valid');
      $('#changeEmail-error').hide();
    }
  })

  //validate password change 
  $('#passwordForm').validate({
    rules: {
      changePassword: {
        required: true,
        pwcheck: true,
        minlength: 8
      },
      changeCPassword: {
        required: true,
        equalTo: '#newPassword'
      }
    },
    //For custom messages
    messages: {
      changePassword: {
        required: "Enter a password",
        pwcheck: "Password must contain at least one digit and one lower case character",
        minlength: "It must 8 characters long"
      },
      changeCPassword: {
        equalTo: "Password does not match"
      }
    }, errorElement: 'div',
    errorPlacement: function (error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
  });

  //extra rules 
  $.validator.addMethod("pwcheck", function (value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
      && /[a-z]/.test(value) // has a lowercase letter
      && /\d/.test(value) // has a digit
  });

  $.validator.addMethod("noSpace", function (value, element) {
    return value.indexOf(" ") < 0 && value != "";
  }, "No space please and don't leave it empty");


}