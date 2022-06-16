let classroom_id;

$(document).ready(function () {
  initUserCard();
  $('.tabs').tabs();
  //$('.tooltipped').tooltip();
  $("[id^=card_menu]").menu();
  $('[id^=card_menu]').hide();

  //tell user that they can add/create a classroom
  if (classroom_array.length == 0) {
    $('#overlay2').css({ "height": $(document).height() }).show();
    $('#modal1').show().css({ 'top': '50px', 'right': '20px', 'z-index': '998' });
  }


  $('#acknowledged1').click(function () {
    $('#modal1').hide()
    $('#overlay2').hide();
    $('.panelHeader').css({ 'z-index': '0' })
  });

  $('#addClassroom').click(function () {
    $('#newClassroom').slideDown();
    var height = $(document).height();
    $('#overlay').css({ 'height': height + 'px' }).show();
  });

  $('#closeNewClassroom').click(function () {
    $('#newClassroom').slideUp();
    $('#overlay').hide();
  });

  $('[id^=editClassroomButton]').click(function () {
    loadEditForm();
    $('[id^="card_menu"]').hide();
    $('#editClassroom').slideDown();
    $(this).parent().hide();
    var height = $(document).height();
    $('#overlay').css({ 'height': height + 'px' }).show();
  });

  $('#closeEditClassroom').click(function () {
    $('#editClassroom').slideUp();
    $('#overlay').hide();
  });

  $('[id=deleteClassroom]').click(function () {
    $('#confirmDeleteClassroom').slideDown();
    $('[id^="card_menu"]').hide();
    var height = $(document).height();
    $('#overlay').css({ 'height': height + 'px' }).show();
  });

  $('#closeDeleteCard, #CancelConfirmPassword').click(function () {
    $('#confirmDeleteClassroom').slideUp();
    $('#overlay').hide();
  });


  $('[id^=deleteClassroomButton]').click(function () {
    $.ajax({
      type: "DELETE",
      "url": '/Classroom/Select/Delete/' + classroom_id,
      success: function (response) {
        alert('Deleting Classroom');
        window.location.href = '/Classroom/Select';

      },
      error: function (err) {
        console.log(err);
      }
    });

  });

  $('[id=ClassroomOption]').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    var id = $(this).attr('id');
    var menu = $(this).parent().parent().parent().parent().parent().find('[id^=card_menu]');


    var cardClassroom = $(this).parent().parent().parent();
    classroom_id = cardClassroom.attr('id').replace('classroom', '');
    $('#editClassroomForm').attr('action', '/Classroom/Select/Edit/' + classroom_id);
    $('#classroomPicForm').attr('action', '/Pic/ClassroomPic/' + classroom_id);
    if (menu.css('display') == 'none') {
      var posx = e.pageX;
      var posy = e.pageY;
      $(menu).css({ 'position': 'absolute', 'width': '150px', 'min-height': '100px', 'left': posx + 'px', "top": (posy + 5) + 'px', 'margin-right': '30px' });
      menu.slideDown();
    }
    else {
      menu.slideUp();
    }
  });




  $('.gallery-item .description, .description ,.ui-menu-item').hover(function () {
    if ($(this).attr('class') == 'ui-menu-item') {
      $(this).parent().prev().find('.description').css({ 'opacity': '1', 'font-size': '14px' });
    }
    else if ($(this).attr('class') == '.gallery-item') {
      $(this).find('.description').css({ 'opacity': '1', 'font-size': '14px' });
    }
    else {
      $(this).css({ 'opacity': '1', 'font-size': '14px' });
    }

  }, function () {
    $('.description').css({ 'opacity': '0' });
  });
  isTeacher();


  /*Student ver has some elements hidden/changed*/


});

function isTeacher() {
  if (role == 'Student') {
    $('#newClassroom').html("<span style='left:10px; top: 10px; font: 400 24px Roboto; position: absolute;'>New Classroom</span><a href='#'><i id='closeNewClassroom' class='material-icons' style='font-size: 2.2rem; display: inline-block; float: right; margin-right: 10px;margin-top: 5px'>close</i></a><form method = 'POST' action = '/Classroom/Select/Add/'><div class=' input-field newClassroomInput' ><input type='text' name='newClassroom' id='newClassroomName' required='required'/><label for='newClassroomName'>Class Code</label><div class='bar'></div></div></div> <button type='submit' id='ConfirmCreateClassroom' class='button' style='float:right; margin:20px;' >Add Classroom</button><form>");
    $('#ConfirmCreateClassroom').css({ 'top': '76px' })
    $('#closeNewClassroom').css({ 'font-size': '1.5rem' })
    $('#newClassroom').css({ 'height': '154px' });
    $('#closeNewClassroom').click(function () {
      $('#newClassroom').slideUp();
      $('#overlay').hide();
    });
    $('[id="ClassroomOption"]').hide();
    $('#registerStudents').hide();

  }
}

function getClassroomId() {
  return classroom_id;
}

// gets the wanted classroom object from classroom id
function getClassroom() {
  var chosenClassroom;
  classroom_array.forEach(function callback(classroom) {
    if (classroom._id == classroom_id) {
      chosenClassroom = classroom;

    }
  });

  return chosenClassroom;

}

// Load Edit Form

async function loadEditForm() {
  classroom_array = await getClassroomsInfo();
  let classroom = getClassroom();
  $('#Module').val(classroom.Subject);
  $('#ClassroomName').val(classroom.Classroom_name);
  let descript = classroom.Description ///.split(/\r?\n/)
  $('#ClassroomDescript').val(descript);
  M.textareaAutoResize($('#ClassroomDescript'));
  M.updateTextFields();
  if (classroom.Picture != null)
    $('#editClassroomPic').attr('src', port2 + 'Pic/GetClassroomPic/' + classroom.Token);
  else
    $('#editClassroomPic').attr('src', '/css/classroom_selector/card_background.png');
}


getClassroomPic();

//used when a new classroom is created (ejs hasn't found it as it doesn't refresh)
async function getClassroomsInfo() {
  return new Promise(function (resolve, reject) {
    $.get(
      port2 + "Classroom/Select/getMyClassrooms",
      function (data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}

async function getClassroomPic() {
  //console.log(classroom_array)
  for (x in classroom_array) {

    classroomPic = await classroomPicture(classroom_array[x].Token);
    //console.log("classroomPicture")
    if (classroom_array[x].Picture != null && classroom_array[x].Picture != '') {
      // console.log(classroom_array[x].Picture)
      $('#' + classroom_array[x].Token).attr("src", port2 + 'Pic/GetClassroomPic/' + classroom_array[x].Token);
    }

  }

}


async function classroomPicture(idOfClassroom) {
  return new Promise(function (resolve, reject) {
    $.get(
      port2 + "Pic/ClassroomPic/ObjectId('" + idOfClassroom + "')",
      function (data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}
