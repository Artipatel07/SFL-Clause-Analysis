// only appears when teacher is editing sfl, doesn't appear when they have not previously
// completed a sample answer
// they can view or edit sample answers
// This file is for teacher users only. 
let isEditing = false;
let answerArray = []; //stores all edited answers that will update the current solution when user is finished editing

$('#Sfl_teacher_settings').click(function (e) {

    if (!isEditing) {
        $('#mode').html('<i style="font-size:16px">(Edit Mode)</i>');
        $('#Sfl_teacher_settings').attr('data-tooltip', "Change to view mode to alter solutions without affecting the sample answer");
        $('#submitAssignmentAnswers').show();
        $('#returnToClassroom').hide();
        $('#sfl_teacher_set_icon').html('edit');
        isEditing = true;
        $('#save').show();
    }
    else {
        $('#mode').html('<i style="font-size:16px">(View Mode)</i>');
        $('#Sfl_teacher_settings').attr('data-tooltip', "Change to Edit mode to change the sample answer");
        $('#submitAssignmentAnswers').hide();
        $('#returnToClassroom').show();
        $('#sfl_teacher_set_icon').html('visibility');
        //save the edited solutions
        for (x in answerArray) {
            SaveAnswersInDB(answerArray[x]);
        }

        answerArray = [];
        isEditing = false;
        $('#save').hide();
    }

});

$('#Sfl_teacher_settings').hover(function (e) {
    $('#mode').slideDown();
},
    function () {
        $('#mode').slideUp();
    });

function initaliseSettings() {
    if (user.role == 'Teacher' && assignment.Complete == 'true') {
        $('#Sfl_teacher_settings').show();
        $('#submitAssignmentAnswers').hide();
        $('#returnToClassroom').show();
    }
    $('.tooltipped').tooltip();
}


// when user clicks view solution or submit
