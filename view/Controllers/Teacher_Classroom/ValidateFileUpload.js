var inputFileIsInputed = false;

var fileToUpload = {
    "Name": '',
    "Contents": '',
    "Clauses": []
}
if ($('#AssignmentName').hasClass('valid') && $('#datepicker1').hasClass('valid') && $('#datepicker2').hasClass('valid') && $('#newAssignmentDets').val().length > 6) {
    $('#submitAssignmentDetails').removeClass('disabled');
    $('#AssignmentDetailsCrumb').removeClass('is-active').addClass('is-complete');
    detailsAreComplete = true;
}


function checkFileUploadIsNotEmpty() {
    if (classroom_table_contents.Assignments[currentAssignment].Files != null) {
        $('#EditFileForAnalysis').removeClass('disabled');
        inputFileIsInputed = true;
        $('#UploadFileCrumb').removeClass('is-active').addClass('is-complete');
        $('#IndentifyClusesCrumb').removeClass('is-complete').addClass('is-active');
    }
    else {
        $('#EditFileForAnalysis').addClass('disabled');
        inputFileIsInputed = false;
        $('#UploadFileCrumb').addClass('is-active').removeClass('is-complete');
        $('#IndentifyClusesCrumb').removeClass('is-complete').removeClass('is-active');
    }
}


// Navigate between tabs/form crumbs
$('#AssignmentDetailsCrumb, #UploadFileCrumb, #IndentifyClusesCrumb, #AnalysisCrumb').click(function (e) {
    if ($(this).hasClass('is-active') || $(this).hasClass('is-complete')) {
        index = $(this).index();
        var $getcurrentForm = $(this).parent().next().find('.js-form-step');
        $currentForm = $getcurrentForm[index];
        showThisForm($currentForm, index);

        var top = $('body').height();

        //depending on the panel, the form will change height
        if (e.target.id == 'AssignmentDetailsCrumb' || e.target.id == 'UploadFileCrumb') {
            $('#newAssignmentCard').css({ 'height': '512px' });
            top = top - 512;
        }
        else if (e.target.id == 'IndentifyClusesCrumb') {
            $('#newAssignmentCard').css({ 'height': '720px' });
            top = top - 720;
        }
        else {
            $('#newAssignmentCard').css({ 'height': '375px' });
            top = top - 375;
        }

        top = top / 2;
        //$('#newAssignmentCard').css({'top':top+'px'});


    }
});

$('#EditFileForAnalysis').on('click', function (event) {
    event.preventDefault();
    var $currentForm = $(this).parents('.js-form-step');
    showNextForm($currentForm);
    $('#UploadFileCrumb').removeClass('is-active').addClass('is-complete');
    if (inputFileIsInputed && !(aClauseIsMarked)) {
        $('#IndentifyClusesCrumb').removeClass('is-complete').addClass('is-active');
    }
    var element = $('#OnefileContents');
    element.attr('contenteditable', 'true');
    //element.html(fileToUpload.Contents)
    enable = true;
    setClause(element, "OnefileContents");
    
    console.log(classroom_table_contents.Assignments[currentAssignment])
    //send the current assignment data to be updated
    return new Promise(async function (resolve, reject) {

        $.post(
            port2 + "Class/Teacher/EditAssignment/File",
            {
                "File": fileToUpload,
                "AssignmentId": classroom_table_contents.Assignments[currentAssignment]._id
            },
            function (data) {
                resolve(data);
            }
        );
    });


});