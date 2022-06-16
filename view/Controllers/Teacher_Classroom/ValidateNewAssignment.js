// New assignment Details verification

//determines which forms are complete 
var detailsAreComplete = false;


// datepicker init
var dateToday = new Date();
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {
        minDate: dateToday,
        format: 'dd-mmm-yyyy',
        container: 'body'
    });
});


$('#AssignmentDetsForm').validate({
    rules: {
        datepicker2: {
            check: true,
        },
    },
    //For custom messages
    messages: {
        datepicker2: {
            check: "Please pick a date that is after the starting date",
        }
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
        var placement = $(element).data('error');
        if (placement) {
            $(placement).append(error)
        } else {
            error.insertAfter(element);
        }
    }
});

$.validator.addMethod("check", function (value) {
    if ($('#datepicker1').val() < $('#datepicker2').val()) {
        return true
    } else {
        return false;
    }
});


// as user enters inputs, it is verified 
colorInvalidandBlankInputs();
function colorInvalidandBlankInputs() {
    $(document).ready(function () {

        $('#datepicker1').change(function () {
            if ($(this).val() == '') {
                $(this).addClass('invalid')
            }
            else {
                $(this).removeClass('invalid');
                $('#datepicker1-error').hide();
                $(this).addClass('valid')
            }
        });


        $('#datepicker2').change(function () {
            if ($(this).val() == '' || $('#datepicker1').val() > $('#datepicker2').val()) {
                $(this).addClass('invalid')
            }
            else {
                $(this).removeClass('invalid');
                $('#datepicker2-error').hide();
                $(this).addClass('valid')
            }
        });


        $('#AssignmentName').keyup(function () {
            if ($(this).val() == '' || $(this).val().length < 6) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $('#AssignmentName-error').hide();
                $(this).addClass('valid')
            }
        });

        $('#newAssignmentDets').keyup(function () {

            if ($(this).val() == '' || $(this).val().length < 6) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
                $('#newAssignmentDets-error').hide();
            }
        });

        $('.input-field input, .input-field textarea').keyup(function () {
            disableButton();
        })


    });
}

function disableButton() {
    if ($('#AssignmentName').hasClass('valid') && $('#datepicker1').hasClass('valid') && $('#datepicker2').hasClass('valid') && $('#newAssignmentDets').val().length > 5) {
        $('#submitAssignmentDetails').removeClass('disabled');
        $('#EditAssignmentDetails').removeClass('disabled');
        $('#AssignmentDetailsCrumb').removeClass('is-active').addClass('is-complete');
        detailsAreComplete = true;
    }
    else {
        $('#submitAssignmentDetails').addClass('disabled');
        $('#EditAssignmentDetails').addClass('disabled');
        $('#AssignmentDetailsCrumb').removeClass('is-complete').addClass('is-active');
        detailsAreComplete = false;
    }
}

function checkIfAssignInputsValid() {
    if (($('#AssignmentName').val().length >= 6) &&
        $('#newAssignmentDets').val().length >= 6 &&
        $('#datepicker1').val != '' && $('#datepicker1').val != '') {
        $('#AssignmentName').removeClass('invalid').addClass('valid');
        $('#newAssignmentDets').removeClass('invalid').addClass('valid');
        $('#datepicker1').removeClass('invalid').addClass('valid');
        $('#datepicker2').removeClass('invalid').addClass('valid');
        disableButton();
    }

    else {
        console.log('missing a value')
    }
}

var $body = $('body');
var $progressBar = $('progress');
var $animContainer = $('.animation-container');
var value = 0;
var transitionEnd = 'webkitTransitionEnd transitionend';


$('#submitAssignmentDetails').on('click', async function (event) {
    event.preventDefault();
    var $currentForm = $(this).parents('.js-form-step');
    showNextForm($currentForm);
    $('#AssignmentDetailsCrumb').removeClass('is-active').addClass('is-complete');
    if (detailsAreComplete && !(inputFileIsInputed)) {
        $('#UploadFileCrumb').removeClass('is-complete').addClass('is-active');
    }

    await postNewAssignment();
    $('#AssignmentList').html('');
    assignmentArray = [];
    assignmentArray = await getAssignmentInfo();
    //draftAssignment = await getDraftAssignmentInfo();
    classroom_table_contents.Assignments = assignmentArray;
    create_assignmentList();
    currentAssignment = classroom_table_contents.Assignments.length - 1;
    rowstoshow2();
    rowstoshow1();
    initaliseJqueries();
});

$('#EditAssignmentDetails').click(async function (event) {
    event.preventDefault();
    var $currentForm = $(this).parents('.js-form-step');
    showNextForm($currentForm);
    $('#AssignmentDetailsCrumb').removeClass('is-active').addClass('is-complete');
    if (detailsAreComplete && !(inputFileIsInputed)) {
        $('#UploadFileCrumb').removeClass('is-complete').addClass('is-active');
    }
    //send the current assignment data to be updated
    return new Promise(async function (resolve, reject) {

        $.post(
            port2 + "Class/Teacher/EditAssignment",
            {
                "Title": $('#AssignmentName').val(),
                "Start_Date": $('#datepicker1').val(),
                "Due_Date": $('#datepicker2').val(),
                "Description": $('#newAssignmentDets').val(),
                "Classroom": classroomid,
                "AssignmentId": classroom_table_contents.Assignments[currentAssignment]._id
            },
            function (data) {
                resolve(data);
            }
        );
    });
})






