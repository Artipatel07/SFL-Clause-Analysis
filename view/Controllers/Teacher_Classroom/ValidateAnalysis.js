$('#AnalysisTheFile').click(function () {
    Analyse(true);
});

$('#anaylse').click(function () {
    Analyse(false)
})

async function Analyse(isNewAssignment) {
    assignmentArray = await getAssignmentInfo();

    sendThisAssignment = assignmentArray[currentAssignment]


    return new Promise(async function (resolve, reject) {
        $.post(
            port2 + "SFL_Draw/",
            {
                "Assignment": sendThisAssignment,
                "ClassroomToken": classroomid,
            },
            function (data) {
                resolve(data);
            },
            window.location.href = ('/SFL_Draw')
        );
    })
}

function checkIfAnalysed() {
    console.log($('#IndentifyClusesCrumb').hasClass('is-complete'))
    console.log(!(classroom_table_contents.Assignments[currentAssignment].Complete))
    if (classroom_table_contents.Assignments[currentAssignment].Complete) {
        $('#AnalysisCrumb').removeClass('is-active').addClass('is-complete');
    }
    else if (!(classroom_table_contents.Assignments[currentAssignment].Complete) && $('#IndentifyClusesCrumb').hasClass('is-complete')) {
        $('#AnalysisCrumb').removeClass('is-complete').addClass('is-active');
    }
    else {
        $('#AnalysisCrumb').removeClass('is-active').removeClass('is-complete');
    }
}