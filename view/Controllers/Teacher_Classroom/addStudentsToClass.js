let associatedStudents = []
$('#AddStudentsToThisClassroom').click(async function () {
    $('.collection-item.avatar.active').each(async function (i) {
        console.log($(this).index())
        indexOfStudent = $(this).index()
        await addStudent(associatedStudents[indexOfStudent].username)
        // console.log(associatedStudents[i].username)
        students = await getStudentInfo() // student info
        createStudents();
        studentList.innerHTML = ''
        create_StudentList();
        initaliseJqueries();
    })
    $('#AddedStudentMessage').show().delay(3000).hide();
    $('#addStudent').hide();
    $('#overlay').fadeOut();

});


$('#existingStudents1').click(async function () {
    associatedStudents = await getAssociatedStudents();
    makeStudentList2()
});


function makeStudentList2() {
    $('.collection').html('')
    for (s in associatedStudents) {
        $('.collection').append('<a class="collection-item avatar"><i class="material-icons circle">person</i><span class="title">Name : ' + associatedStudents[s].name + '<br>Username : ' + associatedStudents[s].username + '</span></a>')
    }
    initAddStudentToClass()
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
