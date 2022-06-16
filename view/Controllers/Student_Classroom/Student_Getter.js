async function getStudentInfo() {
  return new Promise(function (resolve, reject) {
    $.get(
      port2 + "Class/Teacher/GetStudentInfo/" + classroomid,
      function (data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}

getAttempts = function () {
  return new Promise(function (resolve, reject) {
    $.post(
      port2 + "Class/Student/getMyAnswer", {
        ClassroomId: classroomid
      },

      function (data) {
        resolve(data);
      }
    );
  });
}

getAllSolution = function () {
  return new Promise(function (resolve, reject) {
    $.post(
      port2 + "SFL_Draw/getAllSolutions", {
        ClassroomId: classroomid
      },

      function (data) {
        resolve(data);
      }
    );
  });
}