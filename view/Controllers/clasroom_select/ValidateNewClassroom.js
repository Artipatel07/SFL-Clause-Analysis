// New assignment Details verification

//determines which forms are complete 
var detailsAreComplete = false;

/*
// datepicker init
var dateToday = new Date(); 
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {
        minDate: dateToday,
        format : 'dd/mmm/yyyy',
        container: 'body'
    });
  });
*/

$('#newClassroomForm').validate({
    rules: {

    },
    //For custom messages
    messages: {

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


// as user enters inputs, it is verified 
colorInvalidandBlankInputs();
function colorInvalidandBlankInputs() {
    $(document).ready(function () {

        $('#newClassroomName').keyup(function () {
            if ($(this).val() == '' || $(this).val().length < 6) {
                $(this).addClass('invalid')
            }
            else {
                $(this).removeClass('invalid');
                $('#newClassroomName-error').hide();
            }
        });


        $('#newClassroomSubject').keyup(function () {
            if ($(this).val() == '' || $(this).val().length < 3) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $('#newClassroomSubject-error').hide();
                $(this).addClass('valid')
            }
        });

        $('#newClassroomDescription').keyup(function () {

            if ($(this).val() == '' || $(this).val().length < 6) {
                $(this).addClass('invalid')
                $(this).removeClass('valid')
            }
            else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
                $('#newClassroomDescription-error').hide();
            }
        });

        $('.input-field input, .input-field textarea').keyup(function () {
            disableButton();
        })


    });
}

function disableButton() {
    if ($('#newClassroomName').hasClass('valid') && $('#newClassroomSubject').hasClass('valid') && $('#newClassroomDescription').hasClass('valid')) {
        $('#ConfirmCreateClassroom').removeClass('disabled');
        $('#ClassroomDetailsCrumb').removeClass('is-active').addClass('is-complete');
        detailsAreComplete = true;
    }
    else {
        $('#ConfirmCreateClassroom').addClass('disabled');
        $('#ClassroomDetailsCrumb').removeClass('is-complete').addClass('is-active');
        detailsAreComplete = false;
    }
}
/*
function checkIfAssignInputsValid(){
	if(($('#AssignmentName').val().length >= 6) && 
	$('#newAssignmentDets').val().length >= 6 &&
	$('#datepicker1').val != '' && $('#datepicker1').val != '' ){
		$('#AssignmentName').removeClass('invalid').addClass('valid');
		$('#newAssignmentDets').removeClass('invalid').addClass('valid');
		$('#datepicker1').removeClass('invalid').addClass('valid');
		$('#datepicker2').removeClass('invalid').addClass('valid');
		disableButton();
	}

	else{
		console.log('missing a value')
	}
}*/

var $body = $('body');
var $progressBar = $('progress');
var $animContainer = $('.animation-container');
var value = 0;
var transitionEnd = 'webkitTransitionEnd transitionend';
let students = []

$('#ConfirmCreateClassroom').on('click', async function (event) {
    event.preventDefault();
    await postNewClassroom();

    if (classroomToken != null) {
        var $currentForm = $(this).parents('.js-form-step');
        showNextForm($currentForm);
        $('#ClassroomDetailsCrumb').removeClass('is-active').addClass('is-complete');
        $('#AddStudentsCrumb').removeClass('is-complete').addClass('is-active');
        $('#newClassroom').css({ "height": "375px" })
        $('#classroomHeading').html($('#newClassroomName').val() + ' -> Add Students');
        $('#newClassroom').css({ 'height': '570px', 'left': '30%', 'top': '4%', 'width': '555px' });
        // create student list
        students = await getAssociatedStudents();
        makeStudentList()
    }
    else {
        $('#error-classroom').show();
    }


});

async function postNewClassroom() {
    //send the current assignment data to be updated
    return new Promise(async function (resolve, reject) {

        $.post(
            port2 + "Classroom/Select",
            {
                "newClassroomName": $('#newClassroomName').val(),
                "newClassroomSubject": $('#newClassroomSubject').val(),
                "newClassroomDescription": $('#newClassroomDescription').val(),
            },
            function (data) {
                resolve(data);
                classroomToken = data;
                $('#successClassroomMessage').slideDown().delay(2000).slideUp()
            });
    });

}





