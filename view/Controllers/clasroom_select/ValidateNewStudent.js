$('#done').click(function () {
  window.location.reload();
});

$('#AddThisStudent').click(async function () {
  message = await addStudent();
  if (message == 'success') {
    $('#successAlert').html('This student has been added').show();
    $('#errorAlert').hide();
    $('#newStudent').val('')
  }
  else {
    $('#successAlert').hide();
    $('#errorAlert').html(message).show();
  }
});

