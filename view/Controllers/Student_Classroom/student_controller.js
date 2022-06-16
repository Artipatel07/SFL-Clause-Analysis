var currentFile = 0;
var currentAssignment = 0;
let currentStudent = 0;
var assignmentFiles = [];
let students = []//names of students in classroom
let mark_clause_assignment = false // if the assignment requires student to mark clauses = true
var currentFirstEntry1 = 0;
var currentFirstEntry2 = 0;
var end2 = 0;//last entry allowed in student table at given time.
var end1 = 0; //assignment table
var Assignment = [];
let elem;
let instance;
init();


//init once 
/*
var height = $("nav .navWide .wideDiv a").height();
var width = $("nav .navWide .wideDiv a").outerWidth() - 40;
var posx = $("nav .navWide .wideDiv a").position().left;
var posy = $("nav .navWide .wideDiv a").position().top + height - 10;

$('nav .navWide .wideDiv span').css({ "top": posy + "px", "left": posx + "px", "width": width + 'px' });

$("nav .navWide .wideDiv a").click(function (e) {
  e.stopPropagation();
  var xcoord = $(this).data("xcoord");

  $("nav .navWide .wideDiv span").stop().animate({ marginLeft: xcoord }, 100, "easeInOutExpo");
  $(this).addClass("active");
  $("nav .navWide .wideDiv ").not(this).removeClass("active");

});
*/
function initaliseJqueries() {
  $(document).ready(function () {
    elem = $('.tabs');

    elem.tabs();
    instance = M.Tabs.getInstance(elem);
    instance.updateTabIndicator();
    $('.panelWrapper').panelSlider();
    $('.tooltipped').tooltip();
    initUserCard();

    $('.panelNav').hover(function () {
      $(this).next('#description').slideDown();
    },
      function () {
        $('[id = description]').slideUp();
      });

    $('#ExMatButton').click(function () {
      $('#AssignmentPanel').slideUp();
      $('#studentPanel').slideDown();
      $('#StudentGradePanel').slideUp(); // 

    });

    $('.returnToDash').attr('href', port2 + 'Classroom/Select');

    $('#ParticipantsButton').click(function (e) {
      e.stopPropagation();

      if ($('#ParticipantsList').css('display') == 'none') {
        $('#ParticipantsList').show();
        //$('#profileCard').css({ top: e.pageY + 3 + 'px', left: e.pageX - $('#profileCard').width() })
        $('#ParticipantsList').css({ top: e.pageY + 10 + 'px' })
      }
      else {
        $('#ParticipantsList').hide();
      }
    })

    $(document).on('click', function (e) {
      if (!$(e.target).is('#ParticipantsList')) {
        $('#ParticipantsList').hide();
      }
      // Do whatever you want; the event that'd fire if the "special" element has been clicked on has been cancelled.
    });

    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.collapsible');
      var instances = M.Collapsible.init(elems, options);
    });

    // Or with jQuery

    $(document).ready(function () {
      $('.collapsible').collapsible();
    });

    //$('nav .navWide .wideDiv span').css({"top":posy+"px","left":posx+"px", "width":width+'px'})
    $('.tabs').tabs();
    $('#assignmentButton').click(function () {
      $('#studentPanel').slideUp();
      $('#AssignmentPanel').slideDown();
      $('#StudentGradePanel').slideUp();
      instance.updateTabIndicator();
    });

    $('#closeNewAssignCard,#overlay').click(function () {
      if ($('#newFileCard').css('display') == 'none') {
        $('#newAssignmentCard').slideUp();
        $('#overlay').hide();
        $('#editSubcriptCard').hide();
      }
    });

    $('li[id=AssignmentId]').click(function (e) {
      e.stopPropagation();
      currentAssignment = $(this).index();
      $('#EditOneFileCard').slideDown();
      $('[id=menu-1]').hide();
      $('#OnefileContents').html(classroom_table_contents.Assignments[currentAssignment].Files.Contents);
      $('#AssignmentPreviewDescript').html(classroom_table_contents.Assignments[currentAssignment].Description);
      $('#PreviewAssignmentTitle').html(classroom_table_contents.Assignments[currentAssignment].Title);

      //only show the clauses marked
      $('.two').each(function (i) {
        //first erase previous one file content innerhtml
        if (i == 0) {
          $('#OnefileContents').html('');
        }
        $('#OnefileContents').append($(this).html())
      });


      $('#EditClauses').hide();
      //$('#EditOneClauses').show();

      if ($('#SaveEditedAssignment').css('display') == 'none' || $('#newFileCard').css('display') == 'none') {
        $('#setAnswers').show();
      }
      else {

        $('#setAnswers').hide();
      }

      $('#SetThisClause').hide();
      $('#SaveOneClauses').hide();

      //$('#OnefileContents').html(fileWithClauseContents);
      $('#PreviewAssignmentTitle').html(assignmentArray[currentAssignment].Title)
      $('#assignmentSelected').html(assignmentArray[currentAssignment].Title)
      var height = $('body').height();
      $('#overlay').css({ 'height': height + 'px' }).show();
    })

    $('#closeNewAssignCard, #overlay').click(function () {
      if ($('#newFileCard').css('display') == 'none') {
        $('#newAssignmentCard span').html('New Assignment');
        $('#newAssignmentCard').slideUp();
        $('#overlay').hide();

      }
    });

    // when viewing one student's grades, reuse assignment panel, filtered to one student
    $('#studentButton').click(function () {
      $('#StudentGradePanel').slideDown();
      $('#studentPanel').slideUp();
      $('#AssignmentPanel').slideUp();
      instance.updateTabIndicator();
    });


    $('.small-group label, .group label').click(function () {
      $(this).prev('input').focus();
    });

    $('#returnToStudents').click(function () {
      $('#StudentGradePanel').slideUp();
      $('#studentPanel').slideDown();
    });

    $('[id = gradeForAssignment]').click(function () {
      currentAssignment = $(this).closest('li').index();
      rowstoshow1();
    });


    $('#closeEditOneFileCard, #overlay').click(function () {
      if ($('#newFileCard').css('display') == 'none') {
        //$('#EditOneClauses').show() ///// This is the guy you want to show if they want to indentify clauses
        $('#SaveOneClauses').hide();
        $('#EditOneFileCard').hide();
        $('#overlay').hide();
        if (mark_clause_assignment) {
          $('#EditClauses').show();
        }
        else {
          $('#EditClauses').hide();
        }
        $('#setAnswers').show();
      }
    });


    $('#closeNewFileCard, #overlay').click(function () {
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


    // More option menus//
    $('[id=AssignmnetOptions],[id=FileOptions],[id=StudentOptions]').on("click", function (e) {
      e.stopPropagation();
      var id = $(this)[0].id;

      if (id == 'AssignmnetOptions') {
        var menu = $(this).parent().parent().find('#menu-1')
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

        menu.css({ "left": ($(this).position().left - 130) + 'px', "top": ($(this).position().top + 20) + 'px' });
        menu.slideDown();

      }
      else {
        menu.slideUp();
      }
    });

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


async function init() {

  assignmentArray = await getAssignmentInfo();
  if (assignmentArray.length == undefined || assignmentArray.length == null) {
    tempAssignArray = [];
    tempAssignArray.push(assignmentArray);
    assignmentArray = tempAssignArray
  }
  filterAssignments = []
  for (x = 0; x < assignmentArray.length; x++) {
    if (!assignmentArray[x].Hidden) {
      filterAssignments.push(assignmentArray[x])
      classroom_table_contents.Assignments.push(assignmentArray[x])
    }
  }
  assignmentArray = filterAssignments;
  solutions = await getAllSolution();
  students = await getStudentInfo() // student info
  studentAnswers = await getAttempts();
  createStudents();
  create_StudentList();
  create_assignmentList();
  rowstoshow2();
  rowstoshow1();
  initaliseJqueries();
  classroominfo = await getClassroomInfo();
  $(document).attr("title", 'Student ' + classroominfo.Classroom_name)
  $('#classroomName').html(classroominfo.Classroom_name)

}


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



function create_StudentList() {

  var studentList = document.getElementById("studentList");
  for (x in students) {
    studentList.innerHTML += "<div class= 'Students'>" + students[x].name + " </div>";
  }
}

function create_assignmentList() {
  var assignmentList = document.getElementById("AssignmentList");
  var y = 0;
  for (x in classroom_table_contents.Assignments) {
    y++;
    //change format of start and end dates
    var sd = getCorrectDateFormat(classroom_table_contents.Assignments[x].Start_Date)
    var ed = getCorrectDateFormat(classroom_table_contents.Assignments[x].Due_Date)

    // show grade button if the assignment is not hidden
    if ((!classroom_table_contents.Assignments[x].Hidden) && classroom_table_contents.Assignments[x].AnswerVisibility == true) {
      assignmentList.innerHTML += "<li id = 'AssignmentId' ><a href='javascript:void(0)' >" + classroom_table_contents.Assignments[x].Title + "<span id='StudentOptions' class='' style='display: inline-block; float:right; margin-right: 30px; color: #707070; '> <i panelTarget='" + y + "' id='gradeForAssignment' style='cursor:pointer' title='Grade' class='material-icons panelNav' style='z-index: 2'> <img src='../../css/Icons/grade.png' style='width:18px;height:18px; box-shadow: none'> </i></span><div id = 'calendar' style='display:inline-block; float:right; margin-right: 30%' ><span class='' style=' margin-right:20px; color: #707070'> <i class='material-icons'>calendar_today</i>  Start Date: " + sd + "</span> <span class='' style='color: #707070'><i class='material-icons'>calendar_today</i>  Due Date: " + ed + "</span></div></a><div id='description' style='display: none; margin-left: 10px; color:#707070'>Description: " + classroom_table_contents.Assignments[x].Description + "<br></div></li>";
    }
    else if (!classroom_table_contents.Assignments[x].Hidden && classroom_table_contents.Assignments[x].AnswerVisibility == false) {
      assignmentList.innerHTML += "<li id = 'AssignmentId' ><a href='javascript:void(0)' >" + classroom_table_contents.Assignments[x].Title + "<span class='' style='display: inline-block; float:right; margin-right: 30px; color: #707070'> <i   style='cursor:pointer; ' title='Grade' class='material-icons panelNav' style='z-index: 2'> <img src='../../css/Icons/grade.png' style='width:18px;height:18px;visibility:hidden'> </i> </span><div id = 'calendar' style='display:inline-block; float:right; margin-right: 30%' ><span class='' style=' margin-right:20px; color: #707070'> <i class='material-icons'>calendar_today</i>  Start Date: " + sd + "</span> <span class='' style='color: #707070'><i class='material-icons'>calendar_today</i>  Due Date: " + ed + "</span></div></a><div id='description' style='display: none; margin-left: 10px; color:#707070'>Description: " + classroom_table_contents.Assignments[x].Description + "<br></div></li>";
    }
  }
  if (classroom_table_contents.Assignments.length == 0) {
    assignmentList.innerHTML = '<div class="alert-block alert-danger">There are currently no assignments. Please check back when assignments are available. </div>'
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
            'href': '#',
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
    $("#myTable #accordion_trigger1").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      $(".accordion").hide();
    });
  });

  $("#search2").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#accordion_trigger3, #accordion_trigger4, .accordion5").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
    if (value == '') {
      $('.accordion5').hide();
    }
  });
});



function populateNewFileList() {
  var newfileList = document.getElementById('uploadedFilesHere');
  newfileList.innerHTML = ''
  for (f in assignmentFiles) {
    newfileList.innerHTML += "<li id='uniqueFileId" + assignmentFiles[f].Name + "'><a style='cursor: pointer'>" + assignmentFiles[f].Name + "</br><span style ='color: #707070; margin-left: 10px'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti... </span></a></li>";
    //uniquefileid pressed

  }
  removeDuplicates(assignmentFiles, 'Name');
}



var fileWithClauseContents = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Fusce tellus. Nullam at arcu a est sollicitudin euismod. Fusce tellus. Maecenas lorem. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Nullam at arcu a est sollicitudin euismod. Nunc auctor. Maecenas aliquet accumsan leo. Et harum quidem rerum facilis est et expedita distinctio. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Pellentesque arcu. Aliquam erat volutpat. Pellentesque arcu. Aliquam in lorem sit amet leo accumsan lacinia. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris tincidunt sem sed arcu. Donec iaculis gravida nulla. Aenean id metus id velit ullamcorper pulvinar.</p>';

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

function Analyse() {
  //send the current assignment data to be updated
  return new Promise(async function (resolve, reject) {
    $.post(
      port2 + "SFL_Draw/",
      {
        "Assignment": classroom_table_contents.Assignments[currentAssignment],
        "ClassroomToken": classroomid,
        "currentFile": currentFile
      },
      function (data) {
        resolve(data);
      },
      window.location.href = port2 + 'SFL_Draw'
    );
  })
}
