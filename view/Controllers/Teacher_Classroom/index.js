var currentFile = 0;
var currentAssignment = 0;
let currentStudent = 0;
var assignmentFiles = [];
let students = []//names of students in classroom
let studentAnswers = [] // attempts of assignments by students
var isCreateNewAssignment = false;
var hasPopUpShownPrevious = false
let elem;
let instance;
//port2 = "http://localhost:8000/"
init();

//only need to init once
/*var height = $("nav .navWide .wideDiv a").height();
var width = $("nav .navWide .wideDiv a").outerWidth();
var posx = $("nav .navWide .wideDiv a").position().left;
var posy = $("nav .navWide .wideDiv a").position().top + height - 10;

$('nav .navWide .wideDiv span').css({ "top": posy + "px", "left": (posx - 25) + "px", "width": width + 'px' });

$("nav .navWide .wideDiv a").click(function (e) {
  e.stopPropagation();
  var xcoord = $(this).data("xcoord");
  $("nav .navWide .wideDiv span").stop().animate({ marginLeft: xcoord }, 100, "easeInOutExpo");
  $('#studentButton, #assignmnetButton').removeClass("active");
  $(this).addClass("active");
  $("nav .navWide .wideDiv ").not(this).removeClass("active");

});
*/

initUserCard();
function initaliseJqueries() {
  $(document).ready(function () {
    elem = $('.tabs');

    elem.tabs();
    var instance = M.Tabs.getInstance(elem);
    instance.updateTabIndicator();
    $('.tooltipped').tooltip();
    $("#menu-1").menu();
    $("#F_menu-1").menu();
    $('#S_menu-1').menu();

    $('#Done').click(function () {
      $('#overlay').hide();
      $('#newAssignmentCard').hide();
    })
    $('.sorting_asc, .averageGradeSort1').click(function (e) { sortNamesInTable1(e, 'myTable'); });

    $('.panelWrapper').panelSlider();
    $('.returnToDash').attr('href', port2 + 'Classroom/Select');

    $('.panelNav').hover(function () {
      $(this).next('#description').slideDown();
    },
      function () {
        $('[id = description]').slideUp();
      });

    $('#studentButton').click(function () {
      $('#AssignmentPanel').slideUp();
      $('#studentPanel').slideDown();

      instance.updateTabIndicator();
      if (classroom_table_contents.Students.length == 0) {
        $('#modal1').show().css({ 'top': '120px', 'right': '20px', 'z-index': '998' });
        $('#instructions-heading').html('Add Student');
        $('#instructions').html('Click the add person icon to add students. Click the star to show grades.');
        $('.panelHeader').css({ 'z-index': '997' });
        $('#overlay2').show().css({ 'z-index': 899 });
        var height = $(document).height()
        $('#overlay3').show().css({ 'height': height, 'z-index': 899 });
      }

    });

    $('#assignmentButton').click(function () {
      $('#studentPanel').slideUp();
      $('#AssignmentPanel').slideDown();
      $('#StudentGradePanel').slideUp();
      instance.updateTabIndicator();
    });

    $('#addAssignment').click(function () {
      isCreateNewAssignment = true;
      $('#newAssignmentCard').slideDown();
      var height = $(document).height()
      $('#editClausesButton').hide();
      $('#setClauses').show();
      $('#overlay').css({ 'height': height + 'px' }).show();
      cleanUpNewAssignForm();
      $('#newAssignmentCard span').html('New Assignment');
      assignmentFiles = [];
      $(".list-files2")[0].innerHTML = "";
      $("#footer2")[0].classList.remove("hasFiles");
      $(".importar2")[0].classList.remove("active");
      setTimeout(function () {
        $("#drop2")[0].classList.remove("hidden");
      }, 500);
      $('#AnalysisCrumb').removeClass('is-complete').removeClass('is-active');
      $('#IndentifyClusesCrumb').removeClass('is-complete').removeClass('is-active');
      $('#UploadFileCrumb').removeClass('is-complete').removeClass('is-active');
      $('#AssignmentDetailsCrumb').removeClass('is-complete').addClass('is-active');
      $('.is-active')[0].click();
      // show the correct buttons. They change depending on whether you are working on a new assignment or draft.
      $('#EditAssignmentDetails').hide();
      $('#submitAssignmentDetails').show();
    });

    $('#closeNewAssignCard').click(async function () {
      isCreateNewAssignment = false;
      if ($('#newFileCard').css('display') == 'none') {
        $('#newAssignmentCard').slideUp();
        $('#overlay').hide();
        $('#editSubcriptCard').hide();
        $('#keypadWrapper').hide();
        $('#AssignmentList').innerHTML = '';
        assignmentArray = [];
        assignmentArray = await getAssignmentInfo();
        //draftAssignment = await getDraftAssignmentInfo();
        //console.log(assignmentArray)
        classroom_table_contents.Assignments = assignmentArray;
        create_assignmentList();

        rowstoshow2();
        rowstoshow1();
        initaliseJqueries();
        initUserCard(); // it deactivates the jquery so must reactivate.
      }


    });

    $('[id = userCard]').click(function () {
      $('#updateUser').slideDown();
      $('#profileCard').hide();
      var height = $(document).height();
      $('#overlay').css({ 'height': height + 'px' }).show();
    });

    $('#closeUpdateUser').click(function () {
      $('#updateUser').slideUp();
      $('#overlay').hide();
    });


    $('#viewGradeButton').click(function (e) {
      e.stopPropagation();
      $('[id=F_menu-1]').hide();
      $('#EditOneFileCard').hide();
    });

    $('#addStudentButton').click(async function () {
      $('#addStudent').slideDown();
      associatedStudents = await getAssociatedStudents()
      makeStudentList2();
      var height = $(document).height()
      $('#overlay').css({ 'height': height + 'px' }).show();
    });

    $('#closeAddStudent').click(function () {
      if ($('#newFileCard').css('display') == 'none') {
        $('#addStudent').slideUp();
        $('#overlay').hide();
      }
    });

    $('#cancelSetAnswers, #closeSetAnswersCard').click(async function () {
      $('#setAnswersCard').hide();
      $('#overlay').hide();
      assignmentArray = [];
      $('#AssignmentList').innerHTML = '';
      assignmentArray = []
      $('#messages').html('')
      assignmentArray = await getAssignmentInfo();
      classroom_table_contents.Assignments = assignmentArray;
      create_assignmentList();
      rowstoshow2();
      rowstoshow1();
      initaliseJqueries();
    });

    $('#cancelSetAnswers2, #closeSetAnswersCard2').click(async function () {
      $('#EditOneFileCard').hide();
      $('#newAssignmentCard').hide();
      $('#fileUplaod').val('');
      $('#newFileCard').hide();
      $('#overlay').hide();

      // refresh list of assignments
      assignmentArray = [];
      $('#AssignmentList').innerHTML = '';
      assignmentArray = []
      $('#messages').html('')
      assignmentArray = await getAssignmentInfo();
      classroom_table_contents.Assignments = assignmentArray;
      create_assignmentList();
      rowstoshow2();
      rowstoshow1();
      initaliseJqueries();
    });

    $('#setAnswersConfirm, [id = setAnswers], #setAnswersConfirm2').click(function () {
      Analyse();
    });

    $('#acknowledged1').click(function () {
      $('#modal1').hide()
      $('#overlay2, #overlay3').hide();
      $('.panelHeader').css({ 'z-index': '0' })
    });

    $('#SaveEditedAssignment').click(function () {
      $('#newFileCard').hide();
      $('#newAssignmentCard').hide();
      $('#setAnswersCard').show();
    });

    $('[id = DeleteAssignment]').click(function (e) {
      e.stopPropagation();
      $('#DeleteConfirmation').slideDown();
      $('#newAssignmentCard').hide();
      var height = $(document).height()
      $('#overlay').css({ 'height': height + 'px' }).show();
      $('[id = menu-1]').hide();
    });

    $('[id = ResetPassword]').click(function (e) {
      e.stopPropagation();
      $('#ResetPasswordConfirmation').slideDown();
      $('#newAssignmentCard, #DeleteConfirmation').hide();
      var height = $(document).height()
      $('#overlay').css({ 'height': height + 'px' }).show();
      $('[id = s_menu-1]').hide();
    });

    $('[id = DeleteFileButton]').click(function () {
      $('#DeleteConfirmationFile').slideDown();
      var height = $(document).height()
      $('#overlay').css({ 'height': height + 'px' }).show();
      $('[id=F_menu-1]').hide();
    });

    $('#closeDeleteConfirmation, #cancelResetPassword').click(function () {
      $('#DeleteConfirmation').hide();
      $('#overlay').hide();
    })

    $('#closeResetPassword, #cancelDeleteConfirmation').click(function () {
      $('#ResetPasswordConfirmation').hide();
      $('#DeleteConfirmation').hide();
      $('#overlay').hide();
    })

    $('#closeDeleteConfirmationFile, #overlay, #cancelDeleteFileConfirmation').click(function () {
      if ($('#newFileCard').css('display') == 'none') {
        $('#DeleteConfirmationFile').slideUp();
        $('#overlay').hide();
      }
      /*
            $('#profileButton').click(function () {
              if ($('#profileCard').css('display') == 'none') {
                $('#profileCard').show();
              }
              else {
                $('#profileCard').hide();
              }
            });
      */
    });

    $('[id = EditAssignment]').click(function (e) {
      e.stopPropagation();
      $('[id=menu-1]').hide();
      // cleanUpNewAssignForm(); // erases any inputs existing in the forms; 
      ///Shows new assignment card but changes the heading/ button/ placeholders 
      $('#newAssignmentCard').slideDown();
      var height = $(document).height()
      $('#overlay').css({ 'height': height + 'px' }).show();
      loadAssignemnt()
      M.updateTextFields();
      checkIfAssignInputsValid();
      checkFileUploadIsNotEmpty();
      checkClausesAreNotEmpty();
      checkIfAnalysed()


    });


    $('#closeNewAssignCard').click(function () {
      if ($('#newFileCard').css('display') == 'none') {
        $('#newAssignmentCard span').html('New Assignment');
        $('#newAssignmentCard').slideUp();
        $('#overlay').hide();

      }
    });

    // when viewing one student's grades, reuse assignment panel, filtered to one student
    $('#viewAllGrades').click(function () {
      $('#StudentGradePanel').slideDown();
      $('#studentPanel').slideUp();
      currentFirstEntry2 = 0;
      end2 = 0;
      rowstoshow2();
    });

    $('.Students').click(function () {
      $('#StudentGradePanel').slideDown();
      $('#studentPanel').slideUp();
      currentStudent = $(this).index();
      create_StudentViewTable2(currentStudent);
      toggleStudentTreeLayer();
      toggleStudentFirstLayer();
      toggleStudentTableLayer();
      toggleStudentZeroLayer();
    });

    $('.small-group label, .group label').click(function () {
      $(this).prev('input').focus();
    });


    $('#returnToStudents').click(function () {
      $('#StudentGradePanel').slideUp();
      $('#studentPanel').slideDown();
    });

    $('[id = GradesForAssignment]').click(function (e) {
      currentAssignment = $(this).parent().parent().closest('li').index();
      rowstoshow1();
      $('#EditOneFileCard').hide();
      $('#overlay').hide();
      $('[id=menu-1]').hide();
      $('#assignmentSelected').html(assignmentArray[currentAssignment].Title)
    });

    $('.ShowToStudents').click(function (e) {
      e.stopPropagation();
      currentAssignment = $(this).parent().parent().closest('li').index();
      $('#EditOneFileCard').hide();
      $('#overlay').hide();
      $('[id=menu-1]').hide();
      toggleAssignmentVisibility();
    });

    $('.ReleaseAnswers').click(function (e) {
      e.stopPropagation();
      currentAssignment = $(this).parent().parent().closest('li').index();
      $('#EditOneFileCard').hide();
      $('#overlay').hide();
      $('[id=menu-1]').hide();
      toggleAnswerVisibility();
    })

    $('li[id=AssignmentId]').click(function (e) {
      if (e.target.id != 'GradesForAssignment') {
        e.stopPropagation();
        currentAssignment = $(this).index();
        $('#EditOneFileCard').slideDown();
        $('[id=menu-1]').hide();

        //fileWithClauseContents = classroom_table_contents.Assignments[currentAssignment].Files[uniqueFileid].Content;
        $('#EditClauses').hide();
        $('#EditOneClauses').show();

        if ($('#SaveEditedAssignment').css('display') == 'none' || $('#newFileCard').css('display') == 'none') {
          $('#setAnswers').show();
        }
        else {

          $('#setAnswers').hide();
        }

        $('#SetThisClause').hide();
        $('#SaveOneClauses').hide();
        $('#PreviewContents').html(assignmentArray[currentAssignment].Files.Contents);
        $('#PreviewContents span').removeClass('two');
        $('#PreviewAssignmentTitle').html(assignmentArray[currentAssignment].Title)
        $('#AssignmentPreviewDescript').html(assignmentArray[currentAssignment].Description);

        var height = $(document).height()
        $('#overlay').css({ 'height': height + 'px' }).show();
      }

    });

    $('li[id=DraftAssignment]').click(function (e) {
      isCreateNewAssignment = true;
      $('#newAssignmentCard').slideDown();
      var height = $(document).height()
      $('#overlay').css({ 'height': height + 'px' }).show();

      currentAssignment = $(this).index();

      loadAssignemnt();
      // show the correct buttons. They change depending on whether you are working on a new assignment or draft.
      $('#EditAssignmentDetails').show();
      $('#submitAssignmentDetails').hide();

      M.updateTextFields();
      checkIfAssignInputsValid();
      checkFileUploadIsNotEmpty();
      checkClausesAreNotEmpty();
      checkIfAnalysed();
      $('#assignmentSelected').html(assignmentArray[currentAssignment].Title)
      $('.is-active')[0].click();

    });

    $(' #closeEditOneFileCard').click(function () {

      if ($('#EditOneFileCard').css('display') != 'none') {
        $('#EditOneClauses').show();

        if ($('#SaveEditedAssignment').css('display') == 'none' || $('#newFileCard').css('display') == 'none') {
          $('#setAnswers').show();
        }
        else {
          $('#setAnswers').hide();
        }

        $('#SaveOneClauses').hide();
        $('#EditOneFileCard').hide();
      }
      //if editonefile card is single file editor, hide overlay! Otherwise in assignment editor keep it
      if ($('#newFileCard').css('display') == 'none') {
        $('#overlay').hide();
      }

    });


    $('#closeNewFileCard').click(function () {
      isCreateNewAssignment = false;
      if ($('#newFileCard').css('display') != 'none') {
        $('#QuitAssignmentConfirmation').show();
      }
    });

    $('#cancelNewAssign, #closeQuitAssignmentConfirmation').click(function () {
      $('#QuitAssignmentConfirmation').hide();
    });

    $('#quitNewAssign').click(function () {
      $('#newFileCard').hide();
      $('#overlay').hide();
      $('#QuitAssignmentConfirmation').hide();
      $('#newAssignform').trigger('reset');
      $('.importar').click();
      $('#newAssignmentCard').hide();
    });

    $('#returnToNewAssignForm').click(function () {
      $('#newFileCard').hide();
      $('#newAssignmentCard').show();
      $('#overlay').show();
    });

    $('[id = DeleteAssignmentConfirm]').click(function () {
      //console.log(port2+ "DeleteAssignment/" + classroom_table_contents.Assignments[currentAssignment]._id)
      //window.location.replace(port2+ "Class/Teacher/DeleteAssignment/" + classroom_table_contents.Assignments[currentAssignment]._id);
      $.ajax({
        type: "DELETE",
        "url": '/Class/Teacher/DeleteAssignment/' + classroom_table_contents.Assignments[currentAssignment]._id,
        success: function (response) {
          alert('Deleting Assignment');
          window.location.href = '/Class/Teacher/' + classroomid;

        },
        error: function (err) {
          console.log(err);
        }
      });
    })

    $('[id = ResetConfirm]').click(async function () {
      resetThisPassword();
      $('#overlay').fadeOut();
      $('#ResetPasswordConfirmation').slideUp();
      $('#S_menu-1').hide()
    })

    $('[id = DeleteFileConfirm]').click(function () {
      //console.log(port2+ "DeleteAssignment/" + classroom_table_contents.Assignments[currentAssignment]._id)
      window.location.replace(port2 + "Class/Teacher/DeleteFile/" + classroom_table_contents.Assignments[currentAssignment]._id + '/' + classroom_table_contents.Assignments[currentAssignment].Files.Name);

    })


    // More option menus//
    $('[id=AssignmentOptions],[id=FileOptions],[id=StudentOptions]').on("click", function (e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      var id = $(this)[0].id;


      if (id == 'AssignmentOptions') {
        var menu = $(this).parent().parent().find('#menu-1');
        currentAssignment = ($(this).parent().parent().index())
      }
      else if (id == 'FileOptions') {
        var menu = $(this).parent().parent().find('#F_menu-1')

      }
      else if (id == 'StudentOptions') {
        var menu = $(this).parent().parent().find('#S_menu-1')
      }
      //else if(id == 'profileButton'){
      //var menu = $(this).parent().parent().find('#U_menu-1')
      // }

      if (menu.css('display') == 'none') {

        $('[id=menu-1]').hide();
        $('[id=F_menu-1]').hide();
        $('[id=S_menu-1]').hide();

        if (menu[0].id == 'menu-1') {
          menu.css({ "left": ($(this).position().left - 150) + 'px', "top": ($(this).position().top + 20) + 'px' });
        }
        menu.css({ "left": ($(this).position().left - 130) + 'px', "top": ($(this).position().top + 20) + 'px' });
        menu.slideDown();

      }
      else {
        menu.slideUp();
      }
    });

    $('#overlay').click(function () {
      $('#newFileCard ,#newAssignmentCard ,#modal1  ,#updateUser ,#addStudent  ,#setAnswersCard ,#DeleteConfirmation ,#ResetPasswordConfirmation ,#QuitAssignmentConfirmation').hide();
    })

  });
}

(function ($) {
  $.fn.panelSlider = function (options) {


    return this.each(function () {

      var $this = $(this);

      var $panels = $this.find('#panels');

      var $depth = 0;
      var $mainW, $mainH;

      function setWidth() {
        $mainW = $this.width();
        $mainH = $this.parent().outerHeight();
        $('#sidebar').css('height', $mainH - 2);
        $panels.css('left', ($mainW * $depth) * -1);
        $z = $panels.find('.panel').length;
        $lPos = $mainW * $z;
        $panels.find('.panel').each(function () {
          $(this).css('z-index', $z);
          $(this).css('left', ($lPos - ($mainW * $z)));
          $z--;
        });

      }

      setWidth();


      $(window).resize(setWidth);


      $('.panelNav').click(function () {
        $('#AssOptionPanel').hide();
        $target = $(this).attr('panelTarget');
        $parent = $(this).parents('.panel').next();
        $depth = $parent.attr('depth');
        $targetSection = $parent.find('.panelSection[panelLanding="' + $target + '"]');
        $parent.find('.panelSection').each(function () {
          $(this).css('z-index', 0);
        });
        $targetSection.css('z-index', 100);
        $panels.animate({
          left: '-=' + $mainW
        }, 300, 'easeInOutSine');
      });

      $('.panelBack').click(function () {
        $panels.animate({
          left: '+=' + $mainW
        }, 300, 'easeInOutSine');
      });

    });

  };
})(jQuery);

$('button').mousedown(function (e) {
  var target = e.target;
  var rect = target.getBoundingClientRect();
  var ripple = target.querySelector('.ripple');
  $(ripple).remove();
  ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
  target.appendChild(ripple);
  var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
  var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
  ripple.style.top = top + 'px';
  ripple.style.left = left + 'px';
  return false;
});


var currentFirstEntry1 = 0;
var currentFirstEntry2 = 0;
var end2 = 0;//last entry allowed in student table at given time.
var end1 = 0; //assignment table
var Assignment = [];


var classroom_table_contents = {
  "Students": [],
  "Assignments": []
}


$('[id=clause-table-header],[class = accordion1], [id = accordion-content1],[class = accordion2], [id = accordion-content2]').hide();
var switch1 = true;



$('.search-toggle').on("click", function () {
  if ($('.hiddensearch').css('display') == 'none')
    $('.hiddensearch').slideDown();
  else
    $('.hiddensearch').slideUp();
});

$('.search-toggle2').on("click", function () {
  if ($('.hiddensearch2').css('display') == 'none')
    $('.hiddensearch2').slideDown();
  else
    $('.hiddensearch2').slideUp();
});


//table 
function toggleFirstLayer() {
  $("[id=accordion_trigger0]").on("click",
    function () {
      var accordionRow = $(this).next().next(".accordion1");
      if (!accordionRow.is(":visible")) {
        $(this).nextUntil('#accordion_trigger0').not('.accordion2').show();
      }
      else {
        accordionRow.hide();
        $(this).nextUntil('#accordion_trigger0').hide();
      }
    });
}

function toggleTableLayer() {
  $("[id=accordion_trigger1]").on("click",
    function () {
      var accordionRow = $(this).next(".accordion2");
      if (!accordionRow.is(":visible")) {
        //accordionRow.find(".accordion-content2").html('<img src="css/compareTables.png" alt="compared Tree">');
        accordionRow.show().find(".accordion-content2").slideDown();
      } else {
        accordionRow.find(".accordion-content2").slideUp(function () {
          if (!$(this).is(':visible')) {
            accordionRow.hide();
          }
        });
      }
    });
}
//tree

function toggleTreeLayer() {
  $("[id=accordion-tree1]").on("click",
    function () {
      var accordionRow = $(this).parent().next(".accordion2");
      if (!accordionRow.is(":visible")) {
        //accordionRow.find(".accordion-content2").html('<img src="css/treecompare3.png" alt="compared Tree">');
        accordionRow.show().find(".accordion-content2").slideDown();
      } else {
        accordionRow.find(".accordion-content2").slideUp(function () {
          if (!$(this).is(':visible')) {
            accordionRow.hide();
          }
        });
      }
    });
}

//Student table 
function toggleStudentZeroLayer() {
  $("[id=accordion_trigger3]").on("click",
    function () {
      var accordionRow = $(this).next().next(".accordion5");
      if (!accordionRow.is(":visible")) {
        $(this).nextUntil('#accordion_trigger3').not('.accordion4, .accordion3, #clause-table-header').show();
      }
      else {
        accordionRow.hide();
        $(this).nextUntil('#accordion_trigger3').hide();
      }
    });
}

function toggleStudentFirstLayer() {
  $("[id=accordion_trigger4]").on("click",
    function () {
      var accordionRow = $(this).next().next(".accordion3");
      if (!accordionRow.is(":visible")) {
        $(this).nextUntil('#accordion_trigger4, #accordion_trigger3').not('.accordion4').show();
      }
      else {
        accordionRow.hide();
        $(this).nextUntil('#accordion_trigger4, #accordion_trigger3').hide();
      }
    });
}

function toggleStudentTableLayer() {
  $("[id=accordion_trigger4]").on("click",
    function () {
      var accordionRow = $(this).next(".accordion4");
      if (!accordionRow.is(":visible")) {
        accordionRow.show().find(".accordion-content4").slideDown();
      } else {
        accordionRow.find(".accordion-content4").slideUp(function () {
          if (!$(this).is(':visible')) {
            accordionRow.hide();
          }
        });
      }
    });
}
//tree

function toggleStudentTreeLayer() {
  $("[id=accordion-tree5]").on("click",
    function () {
      var accordionRow = $(this).next(".accordion4");

      if (!accordionRow.is(":visible")) {
        //accordionRow.find(".accordion-content4").html('<img src="css/treecompare3.png" alt="compared Tree">');
        accordionRow.show().find(".accordion-content4").slideDown();
      } else {
        accordionRow.find(".accordion-content4").slideUp(function () {
          if (!$(this).is(':visible')) {
            accordionRow.hide();
          }
        });
      }
    });
}


async function init() {

  assignmentArray = await getAssignmentInfo();
  solutions = await getAllSolution();
  students = await getStudentInfo() // student info
  studentAnswers = await getAttempts();
  createStudents();
  for (x = 0; x < assignmentArray.length; x++) {
    if (assignmentArray[x].Files != null && assignmentArray[x].Files.Clauses != null) {
      let clauseNum = [...Array(assignmentArray[x].Files.Clauses.length).keys()]
      assignmentArray[x].ClauseNumber = clauseNum
    }

  }
  classroom_table_contents.Assignments = assignmentArray;
  create_StudentList();
  create_assignmentList();

  rowstoshow2();
  rowstoshow1();
  initaliseJqueries();

  classroominfo = await getClassroomInfo();
  $(document).attr("title", 'Teacher ' + classroominfo.Classroom_name)
  $('#classroomName').html(classroominfo.Classroom_name)

}

function create_StudentList() {

  var studentList = document.getElementById("studentList");
  for (x in classroom_table_contents.Students) {
    if (classroom_table_contents.Students[x].Role != 'Teacher') {
      studentList.innerHTML += "<li class= 'Students'> <a href='javascript:void(0)'>" + classroom_table_contents.Students[x].Name + "  <span id='StudentOptions' class='' style='display: inline-block; float:right; margin-right: 30px; color: #707070'><i class='material-icons'>more_horiz</i></span> </a> <ul id = 'S_menu-1' style='position:absolute; display: none;width: 160px; min-height: 100px; float:right; margin-right: 30px'><li><a href = 'javajavascript:void(0)' id='viewStudentGrades'>View Grades</a></li><li id='DeleteStudent'><a href = 'javajavascript:void(0)'>Delete Student</a></li><li id='ResetPassword'><a href = 'javajavascript:void(0)'>Reset password</a></li></ul></li>";
    }
  }


  // allow teacher to delete student 
  $('li[id = DeleteStudent]').click((e) => {
    e.preventDefault();
    e.stopImmediatePropagation()
    e.stopPropagation();
    currentStudent = $(e.target).closest('.Students').index(); // teacher is the first user
    idOfStudent = classroom_table_contents.Students[currentStudent]._id;
    classroom_table_contents.Students.splice(currentStudent, 1)
    studentList.innerHTML = ''
    create_StudentList();

    initaliseJqueries();
    //post the updated file contents to the database
    return new Promise(function (resolve, reject) {
      $.post(
        port2 + "Class/Teacher/DeleteStudent/" + classroomid + "/" + idOfStudent,
        function (data) {
          resolve(data);
        }
      );
    });
  });

}


function create_assignmentList() {
  var assignmentList = document.getElementById("AssignmentList");
  var y = 0;
  assignmentList.innerHTML = '';

  if (classroom_table_contents.Assignments.length > 0) {
    for (x in classroom_table_contents.Assignments) {
      y++;
      //change format of start and end dates
      var sd = getCorrectDateFormat(classroom_table_contents.Assignments[x].Start_Date)
      var ed = getCorrectDateFormat(classroom_table_contents.Assignments[x].Due_Date)
      //complete and not hidden

      if (!classroom_table_contents.Assignments[x].Complete) {
        assignmentList.innerHTML += "<li id = 'DraftAssignment' ><a href='javascript:void(0)' >" + classroom_table_contents.Assignments[x].Title + "<i style='margin-left:20px; color: #707070;'>Draft</i><span id='AssignmentOptions' class='' style='display: inline-block;  float:right; margin-right:7px ; color: #707070'><i class='material-icons'>more_horiz</i></span><div id = 'calendar' style='display:inline-block; float:right; margin-right: 30%' ><span class='' style=' margin-right:20px; color: #707070'> <i class='material-icons'>calendar_today</i>  Start Date: " + sd + "</span> <span class='' style='color: #707070'><i class='material-icons'>calendar_today</i>  Due Date: " + ed + "</span></div></a><div id='description' style='display: none; margin-left: 10px; color:#707070'>Description: " + classroom_table_contents.Assignments[x].Description + "<br></div><ul id = 'menu-1' style='position:absolute; display: none;width: 150px; float:right; margin-right: 30px'><li><a id='EditDraftAssignment' href = 'javajavascript:void(0)'>Edit</a></li><li><a id='DeleteAssignment' href = 'javajavascript:void(0)'>Delete</a></li></ul></li>";
      }
      // complete but hidden
      else if (classroom_table_contents.Assignments[x].Complete && classroom_table_contents.Assignments[x].Hidden) {
        assignmentList.innerHTML += "<li id = 'AssignmentId' ><a href='javascript:void(0)' >" + classroom_table_contents.Assignments[x].Title + "<i style='margin-left:20px; color: #707070;'>Hidden from students</i><span id='AssignmentOptions' class='' style='display: inline-block; float:right; margin-right:7px ; color: #707070'><i class='material-icons'>more_horiz</i></span><div id = 'calendar' style='display:inline-block; float:right; margin-right: 30%' ><span class='' style=' margin-right:20px; color: #707070'> <i class='material-icons'>calendar_today</i>  Start Date: " + sd + "</span> <span class='' style='color: #707070'><i class='material-icons'>calendar_today</i>  Due Date: " + ed + "</span></div></a><div id='description' style='display: none; margin-left: 10px; color:#707070'>Description: " + classroom_table_contents.Assignments[x].Description + "<br></div><ul id = 'menu-1' style='position:absolute; display: none;width: 171px; float:right; margin-right: 30px'><li class='panelNav' panelTarget='" + y + "'><a id='GradesForAssignment' href = 'javajavascript:void(0)'>Assignment Grades</a></li><li><a  class='ShowToStudents' href = 'javajavascript:void(0)'>Unhide Assignment</a></li><li><a id='EditAssignment' href = 'javajavascript:void(0)'>Edit Assignment</a></li><li><a id='DeleteAssignment' href = 'javajavascript:void(0)'>Delete Assignment</a></li></ul></li>";
      }
      //complete, not hidden, but answers are hidden from the students
      else if (classroom_table_contents.Assignments[x].Complete && !classroom_table_contents.Assignments[x].Hidden && !classroom_table_contents.Assignments[x].AnswerVisibility) {
        assignmentList.innerHTML += "<li id = 'AssignmentId' ><a href='javascript:void(0)' >" + classroom_table_contents.Assignments[x].Title + "<i style='margin-left:20px; color: #707070;'>Answers are hidden</i><span id='AssignmentOptions' class='' style='display: inline-block; float:right; margin-right:7px ; color: #707070'><i class='material-icons'>more_horiz</i></span><div id = 'calendar' style='display:inline-block; float:right; margin-right: 30%' ><span class='' style=' margin-right:20px; color: #707070'> <i class='material-icons'>calendar_today</i>  Start Date: " + sd + "</span> <span class='' style='color: #707070'><i class='material-icons'>calendar_today</i>  Due Date: " + ed + "</span></div></a><div id='description' style='display: none; margin-left: 10px; color:#707070'>Description: " + classroom_table_contents.Assignments[x].Description + "<br></div><ul id = 'menu-1' style='position:absolute; display: none;width: 171px;  float:right; margin-right: 30px'><li class='panelNav' panelTarget='" + y + "'><a id='GradesForAssignment' href = 'javajavascript:void(0)'>Assignment Grades</a></li><li><a  class='ShowToStudents' href = 'javajavascript:void(0)'>Hide Assignment</a></li><li><a class='ReleaseAnswers' href = 'javajavascript:void(0)'>Release Answers</a></li><li><a id='EditAssignment' href = 'javajavascript:void(0)'>Edit Assignment </a></li><li><a id='DeleteAssignment' href = 'javajavascript:void(0)'>Delete Assignment</a></li></ul></li>";
      }
      //complete, visible and answers are released to the students
      else {
        assignmentList.innerHTML += "<li id = 'AssignmentId' ><a href='javascript:void(0)' >" + classroom_table_contents.Assignments[x].Title + "<span id='AssignmentOptions' class='' style='display: inline-block; float:right; margin-right:7px ; color: #707070'><i class='material-icons'>more_horiz</i></span><div id = 'calendar' style='display:inline-block; float:right; margin-right: 30%' ><span class='' style=' margin-right:20px; color: #707070'> <i class='material-icons'>calendar_today</i>  Start Date: " + sd + "</span> <span class='' style='color: #707070'><i class='material-icons'>calendar_today</i>  Due Date: " + ed + "</span></div></a><div id='description' style='display: none; margin-left: 10px; color:#707070'>Description: " + classroom_table_contents.Assignments[x].Description + "<br></div><ul id = 'menu-1' style='position:absolute; display: none;width: 171px; float:right; margin-right: 30px'><li class='panelNav' panelTarget='" + y + "'><a id='GradesForAssignment' href = 'javajavascript:void(0)'>Assignment Grades</a></li><li><a  class='ShowToStudents' href = 'javajavascript:void(0)'>Hide Assignment</a></li><li><a class='ReleaseAnswers' href = 'javajavascript:void(0)'>Hide Answers</a></li><li><a id='EditAssignment' href = 'javajavascript:void(0)'>Edit Assignment</a></li><li><a id='DeleteAssignment' href = 'javajavascript:void(0)'>Delete Assignment</a></li></ul></li>";
      }
    }
  }

  else if (hasPopUpShownPrevious == false) {
    hasPopUpShownPrevious = true;
    //pos = $('#addAssignment').position();
    $('#modal1').show().css({ 'top': '108px', 'right': '27px', 'z-index': '998' });
    //$('#overlay').show();
    $('.panelHeader').css({ 'z-index': '997' });
    $('#overlay2').show().css({ 'z-index': 899 });
    var height = $(document).height()
    $('#overlay3').show().css({ 'height': height, 'z-index': 899 });

  }

}


var attach = function (container, buttons) {
  var i, ien, node, button;
  var clickHandler = function (e) {
    e.preventDefault();
    if (!$(e.currentTarget).hasClass('disabled')) {
      api.page(e.data.action).draw(false);
    }
  };

  for (i = 0, ien = buttons.length; i < ien; i++) {
    button = buttons[i];

    if ($.isArray(button)) {
      attach(container, button);
    } else {
      btnDisplay = '';
      btnClass = '';

      switch (button) {

        case 'first':
          btnDisplay = lang.sFirst;
          btnClass = button + (page > 0 ?
            '' : ' disabled');
          break;

        case 'previous':
          btnDisplay = '<i class="material-icons">chevron_left</i>';
          btnClass = button + (page > 0 ?
            '' : ' disabled');
          break;

        case 'next':
          btnDisplay = '<i class="material-icons">chevron_right</i>';
          btnClass = button + (page < pages - 1 ?
            '' : ' disabled');
          break;

        case 'last':
          btnDisplay = lang.sLast;
          btnClass = button + (page < pages - 1 ?
            '' : ' disabled');
          break;

      }

      if (btnDisplay) {
        node = $('<li>', {
          'class': classes.sPageButton + ' ' + btnClass,
          'id': idx === 0 && typeof button === 'string' ?
            settings.sTableId + '_' + button : null
        })
          .append($('<a>', {
            'href': 'javajavascript:void(0)',
            'aria-controls': settings.sTableId,
            'data-dt-idx': counter,
            'tabindex': settings.iTabIndex
          })
            .html(btnDisplay)
          )
          .appendTo(container);

        settings.oApi._fnBindAction(
          node, {
            action: button
          }, clickHandler
        );

        counter++;
      }
    }
  }
};

// IE9 throws an 'unknown error' if document.activeElement is used
// inside an iframe or frame. 
var activeEl;

try {
  // Because this approach is destroying and recreating the paging
  // elements, focus is lost on the select button which is bad for
  // accessibility. So we want to restore focus once the draw has
  // completed
  activeEl = $(document.activeElement).data('dt-idx');
} catch (e) { }

$(document).ready(function () {

  $("#search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable #accordion_trigger0").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      $(".accordion").hide();
    });
  });

  $("#search2").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable2 #accordion_trigger3").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      $(".accordion5").hide();
    });
  });
});

/*rows to show 2 determines which rows should be loaded into the student table
  The default is 10 entries per page but the user can select 20/30/40/50/all entries per page*/
$('#next_dataset1, #prev_dataset1').click(function () {
  rowstoshow1(this);
});

$('#rpp1').change(function () {
  currentFirstEntry1 = 0;
  var rpp = $('#rpp1').val()
  if (rpp != -1) { end1 = rpp; }
  else { end1 = classroom_table_contents.Students.length }

  $('#next_dataset1').click();
  rowstoshow1();
  $('.sorting_asc, .averageGradeSort1').click(function (e) { sortNamesInTable1(e, 'myTable'); });

}) //if users selects a different row per page value, update table

/*determines which rows that should be shown in the table.*/
function rowstoshow1(event) {
  let wasPrevStepNext = true;
  var rowsPerPage1 = $('#rpp1').val(); //student table
  var numberOfStudents = 0;
  rowsPerPage1 = parseInt(rowsPerPage1);
  var isStudentView = true;
  /*its the student view of search bar says Enter a student name here*/
  if ($('#search').attr('placeholder') != "Enter a student name...") { isStudentView = false; }

  if (isStudentView) { numberOfStudents = classroom_table_contents.Students.length }
  else if (classroom_table_contents.Assignments[currentAssignment] != null && classroom_table_contents.Assignments[currentAssignment].Files != null && classroom_table_contents.Assignments[currentAssignment].Files.Clauses != null) {
    numberOfStudents = classroom_table_contents.Assignments[currentAssignment].Files.Clauses.length;
  }
  else {
    numberOfStudents = 0;
  }

  //no entries
  if (numberOfStudents <= 0) {
    $('#datatable_info').html('0 of 0');
    $('#next_dataset1').hide();
    $('#prev_dataset1').hide();
  }

  if (rowsPerPage1 == -1) {
    currentFirstEntry1 = 0;
    end1 = numberOfStudents;
    $('#next_dataset1').hide();
    $('#prev_dataset1').hide();
    if (isStudentView) { create_StudentViewTable(); }
    else { create_ClauseViewTable(); }
  }


  else {

    //if at the start of the dataset, disable the prev_dataset option
    if (event == null) {
      currentFirstEntry1 = 0;
      $('#prev_dataset1').hide();
      //if at the start of the page and theres not enough entries to move to the next dataset
      if (numberOfStudents - rowsPerPage1 < 0) {
        $('#next_dataset1').hide()
      }
      else {
        $('#next_dataset1').show()
      }
      end1 = currentFirstEntry1 + rowsPerPage1;
      if (numberOfStudents < rowsPerPage1) { end1 = numberOfStudents }

      if (isStudentView) { create_StudentViewTable(); }
      else { create_ClauseViewTable(); }

      $('#datatable_info').html(currentFirstEntry1 + '-' + end1 + ' of ' + numberOfStudents);
      currentFirstEntry1 = currentFirstEntry1 + rowsPerPage1;
    }


    //if next is clicked
    else if (event == null || event.id == 'next_dataset1') {
      if (!wasPrevStepNext) {
        end1 = currentFirstEntry1 + (rowsPerPage1 * 2);
      }
      else {
        end1 = currentFirstEntry1 + rowsPerPage1;
      }

      wasPrevStepNext = true;
      // when the list of students comes to an end and the entries are lower than allowed entries
      if (end1 >= numberOfStudents) {
        end1 = numberOfStudents;
        $('#next_dataset1').hide();
      }

      //when the list as more entries than allowed on the page
      else {
        $('#next_dataset1').show();
        $('#prev_dataset1').show();
      }
      if (currentFirstEntry1 != 0) {
        $('#prev_dataset1').show();
      }
      if (isStudentView) { create_StudentViewTable(); }
      else { create_ClauseViewTable(); }


      $('#datatable_info').html(currentFirstEntry1 + '-' + (end1) + ' of ' + numberOfStudents);
      currentFirstEntry1 = currentFirstEntry1 + rowsPerPage1;
    }

    //if previous is clicked
    else if (event.id == 'prev_dataset1') {
      if (wasPrevStepNext) {
        currentFirstEntry1 = currentFirstEntry1 - (rowsPerPage1 * 2);
      }
      else {
        currentFirstEntry1 -= rowsPerPage1;
      }


      // when the list of students comes to an end2 and the entries are lower than allowed entries
      if (currentFirstEntry1 == 0) {
        $('#prev_dataset1').hide();
        $('#next_dataset1').show();
        end1 = rowsPerPage1;
        if (isStudentView) { create_StudentViewTable(); }
        else { create_ClauseViewTable(); }
      }

      //when the list as more entries than allowed on the page
      else if (currentFirstEntry1 > 0) {
        $('#next_dataset1').show();
        end1 = currentFirstEntry1 + rowsPerPage1;
        if (isStudentView) { create_StudentViewTable(); }
        else { create_ClauseViewTable(); }
      }
      //console.log(currentFirstEntry1 +'-'+end1+' of ' + numberOfStudents);
      $('#datatable_info').html(currentFirstEntry1 + '-' + (end1) + ' of ' + numberOfStudents);
      if (wasPrevStepNext) {
        currentFirstEntry1 += rowsPerPage1;
      }
      wasPrevStepNext = false;
    }
  }
  toggleFirstLayer();
  toggleTableLayer();
  toggleTreeLayer();

}



/*rows to show 2 determines which rows should be loaded into the student table
  The default is 10 entries per page but the user can select 20/30/40/50/all entries per page*/
$('#next_dataset2, #prev_dataset2').click(function () {
  rowstoshow2(this);
});
$('#rpp2').change(function () {
  currentFirstEntry2 = 0;
  var rpp = $('#rpp2').val()
  if (rpp != -1) { end1 = rpp; }
  else { end2 = classroom_table_contents.Students.length }

  rowstoshow2();
  $('.sorting_asc, .averageGradeSort2').click(function (e) { sortNamesInTable1(e, 'myTable2'); });
}) //if users selects a different row per page value, update table

/*determines which rows that should be shown in the table.*/
function rowstoshow2(event) {
  let wasPrevStepNext = true;
  var rowsPerPage2 = $('#rpp2').val(); //student table
  var numberOfStudents = classroom_table_contents.Students.length;


  if (numberOfStudents <= 0) {
    $('datatable_info2').html('0 of 0');
    $('#next_dataset2').hide();
    $('#prev_dataset2').hide();
  }

  rowsPerPage2 = parseInt(rowsPerPage2);

  if (rowsPerPage2 == -1) {
    currentFirstEntry2 = 0;
    end2 = numberOfStudents;
    $('#next_dataset2').hide();
    $('#prev_dataset2').hide();
    create_StudentViewTable2();
  }

  else {
    //if at the start of dataset disable previous dataset button
    //if at the start of the dataset, disable the prev_dataset option
    if (event == null) {
      currentFirstEntry2 = 0;
      $('#prev_dataset2').hide();
      //if at the start of the page and theres not enough entries to move to the next dataset
      if (numberOfStudents - rowsPerPage2 < 0) {
        $('#next_dataset2').hide()
      }
      else {
        $('#next_dataset2').show()
      }
      end2 = currentFirstEntry2 + rowsPerPage2;
      if (numberOfStudents < rowsPerPage2) { end2 = numberOfStudents }

      create_StudentViewTable2();


      $('#datatable_info').html(currentFirstEntry2 + '-' + end2 + ' of ' + numberOfStudents);
      currentFirstEntry2 = currentFirstEntry2 + rowsPerPage2;
    }


    //if next is clicked
    else if (event == null || event.id == 'next_dataset2') {
      if (!wasPrevStepNext) {
        end2 = currentFirstEntry2 + (rowsPerPage2 * 2);
      }
      else {
        end2 = currentFirstEntry2 + rowsPerPage2;
      }

      wasPrevStepNext = true;
      // when the list of students comes to an end and the entries are lower than allowed entries
      if (end2 >= numberOfStudents) {
        end2 = numberOfStudents;
        $('#next_dataset2').hide();
      }

      //when the list as more entries than allowed on the page
      else {
        $('#next_dataset2').show();
        $('#prev_dataset2').show();
      }
      if (currentFirstEntry2 != 0) {
        $('#prev_dataset2').show();
      }
      create_StudentViewTable2();


      $('#datatable_info').html(currentFirstEntry2 + '-' + (end2) + ' of ' + numberOfStudents);
      currentFirstEntry2 = currentFirstEntry2 + rowsPerPage2;
    }


    //if previous is clicked
    else if (event.id == 'prev_dataset2') {
      if (wasPrevStepNext) {
        currentFirstEntry2 = currentFirstEntry2 - (rowsPerPage2 * 2);
      }
      else {
        currentFirstEntry2 -= rowsPerPage2;
      }


      // when the list of students comes to an end2 and the entries are lower than allowed entries
      if (currentFirstEntry2 == 0) {
        $('#prev_dataset2').hide();
        $('#next_dataset2').show();
        end2 = rowsPerPage2;
        create_StudentViewTable2();

      }

      //when the list as more entries than allowed on the page
      else if (currentFirstEntry2 > 0) {
        $('#next_dataset2').show();
        end2 = currentFirstEntry2 + rowsPerPage2;
        create_StudentViewTable2();
      }
      //console.log(currentFirstEntry2 +'-'+end2+' of ' + numberOfStudents);
      $('#datatable_info').html(currentFirstEntry2 + '-' + (end2) + ' of ' + numberOfStudents);
      if (wasPrevStepNext) {
        currentFirstEntry2 += rowsPerPage2;
      }
      wasPrevStepNext = false;
    }
  }
  toggleStudentTreeLayer();
  toggleStudentFirstLayer();
  toggleStudentTableLayer();
  toggleStudentZeroLayer();
  $('.sorting_asc2, .averageGradeSort').click(function (e) { sortNamesInTable2(e, 'myTable2'); });
}




/*sort table of students by name or average grade*/
$('.sorting_asc2, .averageGradeSort').click(function (e) { sortNamesInTable2(e, 'myTable2'); });



//var $ = document.querySelector.bind(document);


function populateNewFileList() {
  var newfileList = document.getElementById('uploadedFilesHere');
  newfileList.innerHTML = ''
  for (f in assignmentFiles) {
    newfileList.innerHTML += "<li id='uniqueFileId" + assignmentFiles[f].Name + "'><a style='cursor: pointer'>" + assignmentFiles[f].Name + "</br><span style ='color: #707070; margin-left: 10px'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti... </span></a></li>";
    //uniquefileid pressed

  }
  removeDuplicates(assignmentFiles, 'Name');
}





// trigger input
$("[id='triggerFile2']")[0].addEventListener("click", function (evt) {
  evt.preventDefault();
  $("#fileUpload").click();
});

// drop events
$("#drop2")[0].ondragleave = function (evt) {
  $("#drop2")[0].classList.remove("active");
  evt.preventDefault();
};
$("#drop2")[0].ondragover = $("#drop2").ondragenter = function (evt) {
  $("#drop2")[0].classList.add("active");
  evt.preventDefault();
};
$("#drop2")[0].ondrop = function (evt) {
  $("fileUpload").files = evt.dataTransfer.files;
  $("#footer2")[0].classList.add("hasFiles");
  $("#drop2")[0].classList.remove("active");
  evt.preventDefault();
};


//upload more

$(".importar2")[0].addEventListener("click", function () {
  $(".list-files2")[0].innerHTML = "";
  $("#footer2")[0].classList.remove("hasFiles");
  $(".importar2")[0].classList.remove("active");
  setTimeout(function () {
    $("#drop2")[0].classList.remove("hidden");
  }, 500);
  $('#fileUpload').val('')
});



$('#closeDuplicateClause, #Manually').click(function () {
  $('#duplicateClauseCard').hide();
  $('#overlay').css({ 'z-index': '899' });
  //$('#SaveClauses').show();
  $('#OnefileContents').attr('contenteditable', 'true')
});




var enable = true;
var el = ''; //subscript element, if empty enter new subscipt, else edit it


$('#EditOneClauses').click(function () {

  $('#setOneAnswers').hide();
  $('#EditOneClauses').hide();
  $('#setAnswers').hide();
  $('#SaveOneClauses').show();
  var element = $('#OnefileContents');
  element.attr('contenteditable', 'true');
  enable = true;
  setClause(element, "OnefileContents");
});



$('[id=SaveClauses]').click(function () {
  alertDuplicate();

  if ($('#duplicateClauseCard').css('display') == 'none') {


    if ($(this).attr('id') == 'SaveClauses') {
      var Allclauses = document.getElementById("fileContents").getElementsByClassName("two")
      var clauses = [];
      for (clauseInd = 0; clauseInd < Allclauses.length; clauseInd++) {
        clauses.push(Allclauses[clauseInd].innerHTML)
      }
      classroom_table_contents.Assignments[currentAssignment].Files.Clauses = clauses;
      $('#EditClauses').show();
      $('#SaveClauses').hide();
      $('#setAnswers').show();
      $('#fileContents').attr('contenteditable', 'false');
      enable = false;
      $('#editSubcriptCard').hide();
      classroom_table_contents.Assignments[currentAssignment].Files.Content = $('#fileContents').html()
    }
    //Update file clauses by making a ajax request

  }


});
$('#closeEditFileCard').click(function () {
  $('#EditFileCard').hide();
  $('#keypadWrapper').hide();
  $('#fileContents').attr('contenteditable', 'false');
  enable = false;
  $('#editSubcriptCard').hide();
});

$('#CalculatorCancel').click(function () {
  $('#keypadWrapper').hide();
});


function sneakPreview(str) {

  str = str.replace(new RegExp('\<span class="subscript">', "g"), '').replace(/<span class="two">/g, '').replace(/<\/span>/, "").replace(new RegExp('\( \d \)'), "g", "");
  str = str.substring(0, 40) + "...";
  //remove any tags within it 
  return str;
}

function getCorrectDateFormat(date) {
  var dateObj = new Date(date)

  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate() + 1;

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  var sd = (dateObj.getFullYear()) + '-' + (month) + '-' + day;


  return sd
}
function cleanUpNewAssignForm() {
  $('#AssignmentName').val('').removeClass('validate valid');
  $('#datepicker1').val('').removeClass('validate valid');
  $('#datepicker2').val('').removeClass('validate valid');
  $('#newAssignmentDets').val('').removeClass('validate valid');
  $('#submitAssignmentDetails').addClass('disabled')
  $('#fileUpload').val('');
  $('#EditFileForAnalysis').addClass('disabled');
  $('#clauseTable').html('');
  $('#OnefileContents').html('');
}

function loadAssignemnt() {

  $('#AssignmentName').val(classroom_table_contents.Assignments[currentAssignment].Title)
  var sd = getCorrectDateFormat(classroom_table_contents.Assignments[currentAssignment].Start_Date)
  var ed = getCorrectDateFormat(classroom_table_contents.Assignments[currentAssignment].Due_Date)

  $('#datepicker1').val(sd);
  $('#datepicker2').val(ed);
  $('#newAssignmentDets').val(classroom_table_contents.Assignments[currentAssignment].Description)
  $('#clauseTable').html('')
  if (classroom_table_contents.Assignments[currentAssignment].Files != null) {
    $("#drop2")[0].classList.add("hidden");
    $("#footer2")[0].classList.add("hasFiles");
    $(".importar2")[0].classList.add("active");
    setTimeout(function () {
      //console.log(classroom_table_contents.Assignments[currentAssignment].Files.Name)
      $(".list-files2")[0].innerHTML = '<div class=\"file file--" + file + "\">\n     <div class=\"name\"><span>" ' + classroom_table_contents.Assignments[currentAssignment].Files.Name + "</span></div>\n     <div class=\"progress active\"></div>\n     <div class=\"done\">\n\t<a href=\"\" target=\"_blank\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1000 1000\">\n\t\t<g><path id=\"path\" d=\"M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,967.7C241.7,967.7,32.3,758.3,32.3,500C32.3,241.7,241.7,32.3,500,32.3c258.3,0,467.7,209.4,467.7,467.7C967.7,758.3,758.3,967.7,500,967.7z M748.4,325L448,623.1L301.6,477.9c-4.4-4.3-11.4-4.3-15.8,0c-4.4,4.3-4.4,11.3,0,15.6l151.2,150c0.5,1.3,1.4,2.6,2.5,3.7c4.4,4.3,11.4,4.3,15.8,0l308.9-306.5c4.4-4.3,4.4-11.3,0-15.6C759.8,320.7,752.7,320.7,748.4,325z\"</g>\n\t\t</svg>\n\t\t\t\t\t\t</a>\n     </div>\n    </div>"
    }, 1000);
    fileToUpload = classroom_table_contents.Assignments[currentAssignment].Files

    if (classroom_table_contents.Assignments[currentAssignment].Files.Contents != null) {
      $('#OnefileContents').html(classroom_table_contents.Assignments[currentAssignment].Files.Contents)
      var element = $('#OnefileContents');
      element.attr('contenteditable', 'true');
      enable = true;
      setClause(element, "OnefileContents");
    }
  }
}