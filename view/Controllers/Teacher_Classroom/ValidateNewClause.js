var aClauseIsMarked = false;
var anAnswerIsSubmited = false;
// enables and disables delete and link buttons
function clauseButtonEnable() {
    $("input[type='checkbox']").change(function() {
        if ($("input:checked").length > 0) {
            $('#deleteClause').removeClass('disabled')
            $('#linkClause').removeClass('disabled')
        } else {
            $('#deleteClause').addClass('disabled')
            $('#linkClause').addClass('disabled')
        }
    });
};


$('#deleteClause').click(function() {

    //when delete, delete left window clause. First get the value of the checked clause, then replace from left window
    $('input[type=checkbox]').each(function() {
        if ($(this).is(':checked')) {

            var clauseToDelete = $(this).closest('td').next('td').html();
            var clauseText = $(this).closest('td').next('td').text();
            console.log(clauseToDelete)
            if ($('#OnefileContents').html().indexOf('<span class="two">' + clauseToDelete + '</span><br>') > -1)
                newText = $('#OnefileContents').html().replace('<span class="two">' + clauseToDelete + '</span><br>', clauseText.substring(clauseText.indexOf(')') + 1, clauseText.length));
            else
                newText = $('#OnefileContents').html().replace('<span class="two">' + clauseToDelete + '</span>', clauseText.substring(clauseText.indexOf(')') + 1, clauseText.length));
            console.log(newText)
            $('#OnefileContents').html(newText)
        }

    });



    $('input[id^="isAnalysed"][type="checkbox"]:checked').closest("tr").remove();
    $('#deleteClause').addClass('disabled')
    $('#linkClause').addClass('disabled')
    enableOrDisableClauseButtons();
})


// enables and disables submit clause button
function submitClauseEnable() {
    if ($('#clauseTable tr').length > 0) {
        $('#EditsubmitClauses').removeClass('disabled');
        aClauseIsMarked = true;
    } else {

        $('#EditsubmitClauses').addClass('disabled')
        aClauseIsMarked = false;
    }
}

function enableOrDisableClauseButtons() {
    clauseButtonEnable();
    submitClauseEnable();
}



// edit assignment clauses

//new assignment clauses
$('#EditsubmitClauses').on('click', async function(event) {
    event.preventDefault();

    alertDuplicate();

    //if no dupicates

    if ($('#duplicateClauseCard').css('display') == 'none') {
        console.log($('#duplicateClauseCard').css('display'))
        var $currentForm = $(this).parents('.js-form-step');
        showNextForm($currentForm);
        $('#IndentifyClusesCrumb').removeClass('is-active').addClass('is-complete');
        if (aClauseIsMarked && !(anAnswerIsSubmited)) {
            $('#AnalysisCrumb').removeClass('is-complete').addClass('is-active');
        }




        fileToUpload.Contents = $('#OnefileContents').html();
        fileToUpload.Clauses = [];
        $('.two').each(function() {
            fileToUpload.Clauses.push($(this).html());
        });
        //send the current assignment data to be updated
        return new Promise(async function(resolve, reject) {

            $.post(
                port2 + "Class/Teacher/EditAssignment/File", {
                    "File": fileToUpload,
                    "AssignmentId": classroom_table_contents.Assignments[currentAssignment]._id
                },
                function(data) {
                    resolve(data);
                }
            );
        });
    }

});


function checkClausesAreNotEmpty() {

    if (classroom_table_contents.Assignments[currentAssignment].Files != null && classroom_table_contents.Assignments[currentAssignment].Files.Clauses != null && classroom_table_contents.Assignments[currentAssignment].Files.Clauses.length > 0) {
        $('#IndentifyClusesCrumb').removeClass('is-active').addClass('is-complete');
        console.log(classroom_table_contents.Assignments[currentAssignment].Files.Contents)
        $('#OnefileContents').html(classroom_table_contents.Assignments[currentAssignment].Files.Contents);
        var element = $('#OnefileContents');
        element.attr('contenteditable', 'true');
        //element.html(fileToUpload.Contents)
        enable = true;
        setClause(element, "OnefileContents");

        $('#clauseTable').html('')
        $('#OnefileContents').find('.two').each(function() {
            $('#clauseTable').append('<tr><td><p><label><input style="opacity:1; position:relative; pointer-events:unset" type="checkbox" /></label></p></td><td>' + $(this).html() + '</td></tr>')
        });
        enableOrDisableClauseButtons();

    }
}