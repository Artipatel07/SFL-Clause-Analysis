function initAddStudentToClass() {
    $('.collection-item').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
        }
        else {
            $(this).addClass('active')
        }
    });
}

$('#AddStudentsToNewClassroom').click(function () {
    $('.collection-item.avatar.active').each(async function (i) {
        console.log($(this).index())
        indexOfStudent = $(this).index() - 1
        await addStudent(students[indexOfStudent].username)
    })
    $('#AddStudentsCrumb').addClass('is-complete').removeClass('is-active')
    $('#FinishedCrumb').addClass('is-complete')
    var $currentForm = $(this).closest('.js-form-step');
    showNextForm($currentForm);
    $('#newClassroom').css({ 'height': '245px' })
});

$('#done').click(function () {
    window.location.reload();
});

// get all student associateed with current user
async function getAssociatedStudents() {
    return new Promise(function (resolve, reject) {
        $.get(
            port2 + "Classroom/Select/getMyStudents",
            function (data) {
                //var res = data;
                resolve(data);
            }
        );
    });
}

async function addStudent(student_username) {

    return new Promise(async function (resolve, reject) {
        $.post(
            port2 + "Class/Teacher/addStudent/" + classroomToken, {
                'newStudent': student_username,
            },
            function (data) {
                resolve(data);
                console.log(data);
            }
        );
    })

}
