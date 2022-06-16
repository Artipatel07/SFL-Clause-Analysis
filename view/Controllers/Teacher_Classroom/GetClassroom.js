
async function getClassroomInfo() {
    return new Promise(function(resolve, reject) {
      $.get(
        port2 + "Classroom/Select/getThisClassroom/"+classroomid,
        function(data) {
          //var res = data;
          resolve(data);
        }
      );
    });
  }

