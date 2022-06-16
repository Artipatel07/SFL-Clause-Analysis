// combine all students in classroom with their answer to create an array of student objects
function createStudents() {
  var Students2 = []
  //for each student in classroom
  for (var i = 0; i < students.length; i++) {
    if (students[i].role != 'Teacher') {
      // get their table, tree, clauses,grades
      //var tables = [];
      var trees = [];
      var clauses = [];
      var indivGrades = [];
      var indivMark = [];
      var assignmentNumbers = [];
      var clauseNumbers = [];
      var averageGrade = 0;
      var averageMark = 0;
      numAssignAttempts = 0;
      numMarked = 0;

      for (var j = 0; j < studentAnswers.length; j++) {
        if (studentAnswers[j].User == students[i]._id) {
          trees.push(studentAnswers[j].Answers.Tree);

          clauses.push(studentAnswers[j].Answers.Clause);
          assignmentNumbers.push(studentAnswers[j].AssignmentId)
          clauseNumbers.push(studentAnswers[j].Answers.ClauseNumber)
          if (studentAnswers[j].Grade != null && studentAnswers[j].Grade[0] != null) {
            indivGrades.push(studentAnswers[j].Grade[0].TABLE_GRADE)
            numAssignAttempts++;
            averageGrade += parseInt(studentAnswers[j].Grade[0].TABLE_GRADE);
          }
          if (studentAnswers[j].Mark != null) {
            indivMark.push(studentAnswers[j].Mark)
            averageMark += parseInt(studentAnswers[j].Mark)
            numMarked++;
          }
          else {
            indivMark.push(0)
          }

        }
      }

      var student = {
        "Name": students[i].name,
        "Username": students[i].username,
        "_id": students[i]._id,
        "Role": students[i].role,
        "TotalGrades": averageGrade / numAssignAttempts,
        "IndivGrades": indivGrades,
        "IndivMarks": indivMark,
        "TotalMarks": averageMark / numMarked,
        "Clauses": clauses,
        "ClauseNumbers": clauseNumbers,
        "Tables": tables = ['<img src="css/compareTables.png" alt="compared Table">', '<img src="css/compareTables.png" alt="compared Table">'],
        "Trees": trees,
        "AssignmentNumbers": assignmentNumbers
      }
      //console.log(student)
      Students2.push(student);
    }
  }
  classroom_table_contents.Students = Students2;
}