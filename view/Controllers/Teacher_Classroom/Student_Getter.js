async function getStudentInfo() {
  return new Promise(function (resolve, reject) {
    $.get(
      port2 + "Class/Teacher/GetStudentInfo/" + classroomid,
      function (data) {
        //var res = data;
        resolve(data);
        console.log(data)
      }
    );
  });
}

getAttempts = function () {
  return new Promise(function (resolve, reject) {
    $.post(
      port2 + "Class/Teacher/getAllAttempts", {
        ClassroomId: classroomid
      },

      function (data) {
        resolve(data);
      }
    );
  });
}