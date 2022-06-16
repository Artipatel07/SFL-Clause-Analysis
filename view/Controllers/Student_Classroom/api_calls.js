async function getAssignmentInfo() {
  console.log(classroomid)
  return new Promise(function (resolve, reject) {
    $.get(
      port2 + "Class/Teacher/GetNonDraftAssignmentInfo/" + classroomid,
      function (data) {
        //var res = data;
        console.log(data)
        resolve(data);
      }
    );
  });
}