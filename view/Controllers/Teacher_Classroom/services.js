// hides and unhides assignment from students.
async function toggleAssignmentVisibility() {
    return new Promise(function (resolve, reject) {
        $.post(
            port2 + "Class/Teacher/toggleAssignmentVisibility/",
            { AssignmentId: classroom_table_contents.Assignments[currentAssignment]._id },
            function (data) {
                resolve(data);
                window.location.replace(port2 + 'Class/Teacher/' + classroomid)
            }
        );
    });
}

// hides and unhides assignment answers from students.
async function toggleAnswerVisibility() {
    return new Promise(function (resolve, reject) {
        $.post(
            port2 + "Class/Teacher/toggleAnswerVisibility/",
            { AssignmentId: classroom_table_contents.Assignments[currentAssignment]._id },
            function (data) {
                resolve(data);
                window.location.replace(port2 + 'Class/Teacher/' + classroomid)
            }
        );
    });
}

async function postNewAssignment() {
    //send the current assignment data to be updated
    return new Promise(async function (resolve, reject) {

        $.post(
            port2 + "Class/Teacher/NewAssignment",
            {
                "Title": $('#AssignmentName').val(),
                "Start_Date": $('#datepicker1').val(),
                "Due_Date": $('#datepicker2').val(),
                "Description": $('#newAssignmentDets').val(),
                "Classroom": classroomid
            },
            function (data) {

                resolve(data);
            });
    });

}

async function resetThisPassword() {
    return new Promise(function (resolve, reject) {
        $.post(
            port2 + "Class/Teacher/resetPassword/",
            { userid: classroom_table_contents.Students[currentStudent]._id },
            function (data) {
                resolve(data);
                $('#successAlertMessages').html(data).slideDown().delay(2000).slideUp();
            }
        );
    });
}