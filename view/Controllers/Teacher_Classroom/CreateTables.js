function create_ClauseViewTable() {
  $('#myTable').html('');
  document.getElementsByTagName("thead")[0].innerHTML = '<tr role="row"><th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Clause: activate to sort column descending" aria-sort="ascending">Clause</th><th class="sorting averageGradeSort1" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending">Grade</th><th>Similarity</th></tr>';
  if (classroom_table_contents.Assignments[currentAssignment] == null || classroom_table_contents.Assignments[currentAssignment].Files == null || classroom_table_contents.Assignments[currentAssignment].Files.Clauses == null) {
    var numberOfStudents = 0;
  }
  else {
    var numberOfStudents = classroom_table_contents.Assignments[currentAssignment].Files.Clauses.length;
  }
  let tableEntry = 0;
  document.getElementById('myTable').innerHTML = '';
  for (var x = currentFirstEntry1; x < end1; x++) {


    var clause = document.createElement("tr");
    clause.id = "accordion_trigger0";
    clause.className = 'odd';
    clause.setAttribute('role', 'row');

    var clause_td = document.createElement('td');
    clause_td.setAttribute('class', 'sorting_2');

    clause_td.innerHTML = classroom_table_contents.Assignments[currentAssignment].Files.Clauses[x];

    var Tmark = document.createElement('td');
    Tmark.innerHTML = '--'
    Tmark.className = 'markOfClauseInAssign'

    var Tgrade = document.createElement('td');
    Tgrade.innerHTML = '--'
    Tgrade.setAttribute('colspan', 4);
    Tgrade.className = 'gradeOfClauseInAssign'

    document.getElementById('myTable').appendChild(clause);
    clause.appendChild(clause_td);
    clause.appendChild(Tmark)
    clause.appendChild(Tgrade);



    var second_header = document.createElement('tr');
    second_header.id = 'clause-table-header';
    var blank_header = document.createElement('th');
    var blank_header2 = document.createElement('th');
    blank_header2.setAttribute('colspan', 2)
    var name_header = document.createElement('th');
    name_header.innerHTML = 'Name';
    var mark_header = document.createElement('th');
    mark_header.innerHTML = 'Grade';
    var grade_header = document.createElement('th');
    grade_header.innerHTML = 'Similarity';


    document.getElementById('myTable').appendChild(second_header);
    second_header.appendChild(blank_header);
    second_header.appendChild(name_header);
    second_header.appendChild(mark_header);
    second_header.appendChild(grade_header);
    second_header.appendChild(blank_header2);

    averageGradeOfThisAssign = 0;
    averageMarkOfThisAssign = 0;
    //have a func that returns the array of clauses this students has annotated
    for (y in classroom_table_contents.Students) {
      //ensure that the teacher is not in the list

      if (classroom_table_contents.Students[y].Role != 'Teacher') {
        var first_acc = document.createElement('tr');
        first_acc.setAttribute('class', 'accordion1');
        first_acc.id = 'accordion_trigger1';
        //var content1 = document.createElement('div');
        // content1.setAttribute('class','accordion-content1');
        var blank = document.createElement('td');
        var blank2 = document.createElement('td');
        blank2.setAttribute('colspan', "2")
        //blank.style.cssText= 'display : table-row;' ;
        var student = document.createElement('td');
        student.innerHTML = classroom_table_contents.Students[y].Name;
        //student.style.cssText= 'display : table-row;' ;

        var indexofGrade = -1;
        var grade = document.createElement('td');
        for (grade1 in studentAnswers) {
          if (studentAnswers[grade1].AssignmentId == classroom_table_contents.Assignments[currentAssignment]._id &&
            classroom_table_contents.Assignments[currentAssignment].ClauseNumber != null &&
            studentAnswers[grade1].Answers.ClauseNumber == classroom_table_contents.Assignments[currentAssignment].ClauseNumber[x] &&
            studentAnswers[grade1].User == classroom_table_contents.Students[y]._id) {

            if (classroom_table_contents.Students[y].IndivGrades[grade1] != null) {
              grade.innerHTML = classroom_table_contents.Students[y].IndivGrades[grade1] + '%';
              averageGradeOfThisAssign += parseInt(classroom_table_contents.Students[y].IndivGrades[grade1]);
            }
            var indexofGrade = grade1;
            break;
          }
        }

        var mark = document.createElement('td');
        if (studentAnswers[indexofGrade] != null && studentAnswers[indexofGrade].Mark != null) {
          mark.innerHTML = studentAnswers[indexofGrade].Mark + '%';
          averageMarkOfThisAssign += parseInt(studentAnswers[indexofGrade].Mark)
        }
        else {
          mark.innerHTML = 0 + '%';
        }


        document.getElementById('myTable').appendChild(first_acc);
        first_acc.appendChild(blank);
        first_acc.appendChild(student);
        first_acc.appendChild(mark)
        first_acc.appendChild(grade);
        first_acc.appendChild(blank2)

        var second_acc = document.createElement('tr');
        second_acc.setAttribute('class', 'accordion2');
        var td_4 = document.createElement('td');
        td_4.setAttribute('colspan', 6);
        var content2 = document.createElement('div');
        content2.setAttribute('class', 'accordion-content2');

        //teacher table (first find it)
        indexOfSol = 0
        for (sol in solutions) {
          if (classroom_table_contents.Assignments[currentAssignment].ClauseNumber != null && solutions[sol].AssignmentId == classroom_table_contents.Assignments[currentAssignment]._id && solutions[sol].Answers.ClauseNumber == classroom_table_contents.Assignments[currentAssignment].ClauseNumber[x]) {
            indexOfSol = sol;
            break;
          }
        }
        //One strand

        // remove these strings from it to remove last row 
        if (studentAnswers[indexofGrade] != null && studentAnswers[indexofGrade].Answers != null && solutions[sol] != null && solutions[sol].Answers != null && studentAnswers[indexofGrade].Finished) {

          content2.innerHTML = makeCompareTabs(indexofGrade, sol, 0, x, y);
          content2.innerHTML += makeTeacherComment(indexofGrade, sol, 0, x, y)
        }
        //student did not complete the assignment yet. 
        else {
          content2.innerHTML = '<span id="tableOwner" class="not_complete">' + classroom_table_contents.Students[y].Name + ' has not submitted this assignment yet</span>'
        }
        document.getElementById('myTable').appendChild(second_acc);
        second_acc.appendChild(td_4);
        td_4.appendChild(content2);
      }
    }
    document.getElementsByClassName('gradeOfClauseInAssign')[tableEntry].innerHTML = averageGradeOfThisAssign / (classroom_table_contents.Students.length) + '%';
    document.getElementsByClassName('markOfClauseInAssign')[tableEntry].innerHTML = averageMarkOfThisAssign / (classroom_table_contents.Students.length) + '%'
    tableEntry++;
  }
  $('[class = accordion-content2],[id = clause-table-header],[class = accordion1],[class = accordion2], [id=comments]').hide();
  $('.tabs').tabs();
  initComments()
}


function create_StudentViewTable() {
  document.getElementsByTagName("thead")[0].innerHTML = '<tr role="row"><th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column descending" aria-sort="ascending">Name</th><th class="sorting averageGradeSort1" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending">Grade</th><th>Similarity</th></tr>';
  var numberOfStudents = classroom_table_contents.Students.length;
  $('#myTable').html('');
  let tableEntry = 0;
  //for(x in classroom_table_contents.Students){
  for (var x = currentFirstEntry1; x < end1; x++) {
    if (classroom_table_contents.Students[x].Role != 'Teacher') {
      var name = document.createElement("tr");
      name.id = "accordion_trigger0";
      name.className = 'odd';
      name.setAttribute('role', 'row');

      var name_td = document.createElement('td');
      name_td.setAttribute('class', 'sorting_1');
      name_td.innerHTML = classroom_table_contents.Students[x].Name;

      var Tmark = document.createElement('td');
      Tmark.innerHTML = '--'
      Tmark.className = 'AverageMarkOfAssign'

      var Tgrade = document.createElement('td');
      Tgrade.innerHTML = '--'
      Tgrade.className = 'gradeOfClauseInAssign'
      Tgrade.setAttribute('colspan', 4);

      document.getElementById('myTable').appendChild(name);
      name.appendChild(name_td);
      name.appendChild(Tmark)
      name.appendChild(Tgrade);

      var second_header = document.createElement('tr');
      second_header.id = 'clause-table-header';
      var blank_header = document.createElement('th');
      var blank_header2 = document.createElement('th');
      blank_header2.setAttribute('colspan', '2')

      var clause_header = document.createElement('th');
      clause_header.innerHTML = 'Clause';
      var mark_header = document.createElement('th');
      mark_header.innerHTML = 'Grade';
      var grade_header = document.createElement('th');
      grade_header.innerHTML = 'Similarity';


      document.getElementById('myTable').appendChild(second_header);
      second_header.appendChild(blank_header);
      second_header.appendChild(clause_header);
      second_header.appendChild(mark_header);
      second_header.appendChild(grade_header);
      second_header.appendChild(blank_header2);


      averageMarkFromAllClausesInAssign = 0;
      numberOfAssignmentsMarked = 0;
      //have a func that returns the array of clauses this students has annotated
      for (y in classroom_table_contents.Students[x].Clauses) {
        averageGradeFromAllClausesInAssign = 0;

        if (classroom_table_contents.Students[x].AssignmentNumbers[y] == classroom_table_contents.Assignments[currentAssignment]._id) {
          var first_acc = document.createElement('tr');
          first_acc.setAttribute('class', 'accordion1');
          first_acc.id = 'accordion_trigger1';
          //var content1 = document.createElement('div');
          // content1.setAttribute('class','accordion-content1');
          var blank = document.createElement('td');
          var blank2 = document.createElement('td');
          blank2.setAttribute('colspan', '2')
          var clause = document.createElement('td');
          clause.innerHTML = classroom_table_contents.Students[x].Clauses[y];
          //clause.style.cssText= 'padding : 20px;' ;
          var grade = document.createElement('td');
          grade.innerHTML = '--'
          if (classroom_table_contents.Students[x].IndivGrades[y]) {
            grade.innerHTML = classroom_table_contents.Students[x].IndivGrades[y] + '%';
            averageGradeFromAllClausesInAssign += parseInt(classroom_table_contents.Students[x].IndivGrades[y]);
          }

          var mark = document.createElement('td');
          mark.innerHTML = '--';
          indexOfAnswer = -1;
          for (ans in studentAnswers) {
            if (studentAnswers[ans].AssignmentId == classroom_table_contents.Assignments[currentAssignment]._id &&
              studentAnswers[ans].Answers.ClauseNumber == classroom_table_contents.Students[x].ClauseNumbers[y] &&
              studentAnswers[ans].User == classroom_table_contents.Students[x]._id) {
              indexOfAnswer = ans;
              break;
            }
          }
          if (studentAnswers[ans].Mark != null) {
            mark.innerHTML = studentAnswers[ans].Mark + '%';
            averageMarkFromAllClausesInAssign += parseInt(studentAnswers[ans].Mark);
            numberOfAssignmentsMarked++;
          }

          document.getElementById('myTable').appendChild(first_acc);
          //first_acc.appendChild(content1);
          first_acc.appendChild(blank);
          first_acc.appendChild(clause);
          first_acc.appendChild(mark);
          first_acc.appendChild(grade);
          first_acc.appendChild(blank2)

          var second_acc = document.createElement('tr');
          second_acc.setAttribute('class', 'accordion2');
          var td_4 = document.createElement('td');
          td_4.setAttribute('colspan', 6);
          var content2 = document.createElement('div');
          content2.setAttribute('class', 'accordion-content2');

          //teacher table (first find it)
          indexOfSol = 0;
          for (sol in solutions) {
            if (solutions[sol].AssignmentId == classroom_table_contents.Assignments[currentAssignment]._id && solutions[sol].Answers.ClauseNumber == classroom_table_contents.Students[x].ClauseNumbers[y]) {
              indexOfSol = sol;
              break;
            }
          }

          if (studentAnswers[ans].Answers.TST != null && solutions[indexOfSol].Answers.TST != null) {
            content2.innerHTML = makeCompareTabs(ans, indexOfSol, 1, x, y);
            content2.innerHTML += makeTeacherComment(ans, indexOfSol, 1, x, y)
          }

          document.getElementById('myTable').appendChild(second_acc);
          second_acc.appendChild(td_4);
          td_4.appendChild(content2);
          //td_4.appendChild(comment);
        }
      }
      document.getElementsByClassName('gradeOfClauseInAssign')[tableEntry].innerHTML = averageGradeFromAllClausesInAssign / classroom_table_contents.Assignments[currentAssignment].Files.Clauses.length + '%'
      document.getElementsByClassName('AverageMarkOfAssign')[tableEntry].innerHTML = averageMarkFromAllClausesInAssign / numberOfAssignmentsMarked + '%'
      if (document.getElementsByClassName('AverageMarkOfAssign')[tableEntry].innerHTML == 'NaN%') {
        document.getElementsByClassName('AverageMarkOfAssign')[tableEntry].innerHTML = '--'
      }
      tableEntry++;
    }
  }

  $('[class = accordion-content2],[id = clause-table-header],[class = accordion1],[class = accordion2], [id=comments]').hide();
  $('.tabs').tabs();
  initComments()
}


function create_StudentViewTable2(ParticularStudent) {
  document.getElementsByTagName("thead")[1].innerHTML = '<tr role="row"><th class="sorting sorting_asc2" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column descending" aria-sort="ascending">Name</th><th class="sorting averageGradeSort" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending">Grade</th><th>Similarity</th></tr>';
  document.getElementById('myTable2').innerHTML = '';
  var numberOfStudents = classroom_table_contents.Students.length;
  var start = currentFirstEntry2;
  var endOfTable = end2
  if (ParticularStudent != null) {
    start = ParticularStudent;
    endOfTable = ParticularStudent + 1;
  }
  for (var x = start; x < endOfTable; x++) {
    if (classroom_table_contents.Students[x].Role != 'Teacher') {
      /*student names*/
      var name = document.createElement("tr");
      name.id = "accordion_trigger3";
      name.className = 'odd';
      name.setAttribute('role', 'row');

      var name_td = document.createElement('td');
      name_td.setAttribute('class', 'sorting_1');
      name_td.innerHTML = classroom_table_contents.Students[x].Name;

      var Tmark = document.createElement('td');
      Tmark.innerHTML = '--';
      if (classroom_table_contents.Students[x].TotalMarks)
        Tmark.innerHTML = classroom_table_contents.Students[x].TotalMarks + '%';

      var Tgrade = document.createElement('td');
      Tgrade.innerHTML = '--';
      if (classroom_table_contents.Students[x].TotalGrades)
        Tgrade.innerHTML = classroom_table_contents.Students[x].TotalGrades + '%';
      Tgrade.setAttribute('colspan', 5);

      document.getElementById('myTable2').appendChild(name);
      name.appendChild(name_td);
      name.appendChild(Tmark);
      name.appendChild(Tgrade);

      var third_header = document.createElement('tr');
      third_header.id = 'assignment-table-header';
      var fake_header = document.createElement('th');
      var assignment_header = document.createElement('th');
      assignment_header.innerHTML = 'Assignment';
      var Amark_header = document.createElement('th');
      Amark_header.innerHTML = 'Average Grade';
      var Agrade_header = document.createElement('th');
      Agrade_header.innerHTML = 'Average Similarity';
      var fake_header_2 = document.createElement('th');
      fake_header_2.setAttribute('colspan', 3);

      document.getElementById('myTable2').appendChild(third_header);
      third_header.appendChild(fake_header);
      third_header.appendChild(assignment_header);
      third_header.appendChild(Amark_header);
      third_header.appendChild(Agrade_header);
      third_header.appendChild(fake_header_2);


      for (z in classroom_table_contents.Assignments) {
        /*assignments*/
        var averageGradeOfThisAssign = 0;

        var assignment_name = document.createElement("tr");
        assignment_name.id = "accordion_trigger4";
        //assignment_name.setAttribute('class', 'accordion5');
        assignment_name.className = 'accordion5';
        assignment_name.setAttribute('role', 'row');

        var assignment_name_td = document.createElement('td');
        assignment_name_td.setAttribute('class', 'sorting_2');
        assignment_name_td.innerHTML = classroom_table_contents.Assignments[z].Title;

        var blank_2 = document.createElement('td');
        var blank_3 = document.createElement('td')
        blank_3.setAttribute('colspan', 3);

        document.getElementById('myTable2').appendChild(assignment_name);
        assignment_name.appendChild(blank_2);
        assignment_name.appendChild(assignment_name_td);


        var second_header = document.createElement('tr');
        second_header.id = 'clause-table-header';
        var blank_header = document.createElement('th');
        blank_header.setAttribute('colspan', 2);
        var blank_header2 = document.createElement('th');
        blank_header2.setAttribute('colspan', 2);
        var clause_header = document.createElement('th');
        clause_header.innerHTML = 'Clause';
        var mark_header = document.createElement('th');
        mark_header.innerHTML = 'Grade';
        var grade_header = document.createElement('th');
        grade_header.innerHTML = 'Similarity';


        document.getElementById('myTable2').appendChild(second_header);
        second_header.appendChild(blank_header);
        second_header.appendChild(clause_header);
        second_header.appendChild(mark_header);
        second_header.appendChild(grade_header);
        second_header.appendChild(blank_header2);


        var countAssignments = 0;
        var numberOfMarkedAssignments = 0;
        var averageMarkInThisAssignment = 0;
        //have a func that returns the array of clauses this students has annotated
        for (y in classroom_table_contents.Students[x].Clauses) {

          if (classroom_table_contents.Students[x].AssignmentNumbers[y] == classroom_table_contents.Assignments[z]._id) {
            countAssignments++;

            var first_acc = document.createElement('tr');
            first_acc.setAttribute('class', 'accordion3');
            first_acc.id = 'accordion-tree5';
            //var content1 = document.createElement('div');
            // content1.setAttribute('class','accordion-content1');
            var blank = document.createElement('td');
            blank.setAttribute('colspan', 2);
            var blank2 = document.createElement('td');
            blank2.setAttribute('colspan', 2);
            var clause = document.createElement('td');
            clause.innerHTML = classroom_table_contents.Students[x].Clauses[y];
            //clause.style.cssText= 'padding : 20px;' ;
            var mark = document.createElement('td');
            mark.innerHTML = '--';

            if (classroom_table_contents.Students[x].IndivMarks[y] != null) {
              mark.innerHTML = classroom_table_contents.Students[x].IndivMarks[y] + '%';
              averageMarkInThisAssignment += parseInt(classroom_table_contents.Students[x].IndivMarks[y]);
              numberOfMarkedAssignments++;
            }


            var grade = document.createElement('td');
            grade.innerHTML = '--'
            if (classroom_table_contents.Students[x].IndivGrades[y]) {
              grade.innerHTML = classroom_table_contents.Students[x].IndivGrades[y] + '%';
              averageGradeOfThisAssign += parseInt(classroom_table_contents.Students[x].IndivGrades[y]);
            }




            document.getElementById('myTable2').appendChild(first_acc);
            first_acc.appendChild(blank);
            first_acc.appendChild(clause);
            first_acc.appendChild(mark)
            first_acc.appendChild(grade);
            first_acc.appendChild(blank2);


            var second_acc = document.createElement('tr');
            second_acc.setAttribute('class', 'accordion4');
            var td_4 = document.createElement('td');
            td_4.setAttribute('colspan', 7);
            var content2 = document.createElement('div');
            content2.setAttribute('class', 'accordion-content4');
            //content2.innerHTML = '<img src="css/compareTables.png" alt="compared Table">'


            indexOfAnswer = 0;
            for (ans in studentAnswers) {
              if (studentAnswers[ans].AssignmentId == classroom_table_contents.Assignments[z]._id &&
                studentAnswers[ans].Answers.ClauseNumber == classroom_table_contents.Students[x].ClauseNumbers[y]
                && classroom_table_contents.Students[x]._id == studentAnswers[ans].User) {
                indexOfAnswer = ans;
                break;
              }
            }

            //teacher table (first find it)
            indexOfSol = -1;
            for (sol1 in solutions) {
              if (solutions[sol1].AssignmentId == classroom_table_contents.Assignments[z]._id && solutions[sol1].Answers.ClauseNumber == classroom_table_contents.Students[x].ClauseNumbers[y]) {
                indexOfSol = sol1;
                break;
              }
            }
            if (solutions[indexOfSol] != null && solutions[indexOfSol].Answers.OST != null && studentAnswers[indexOfAnswer].Answers.OST != null) {
              content2.innerHTML = makeCompareTabs(indexOfAnswer, indexOfSol, 2, x, y);
              content2.innerHTML += makeTeacherComment(indexOfAnswer, indexOfSol, 2, x, y)

            }
            document.getElementById('myTable2').appendChild(second_acc);
            second_acc.appendChild(td_4);
            td_4.appendChild(content2);
          }
        }

        var Amark = document.createElement('td');
        Amark.innerHTML = '--'
        if (numberOfMarkedAssignments != 0)
          Amark.innerHTML = averageMarkInThisAssignment / numberOfMarkedAssignments;
        assignment_name.appendChild(Amark);

        var Agrade = document.createElement('td');
        Agrade.innerHTML = '--'
        if (countAssignments != 0 && averageGradeOfThisAssign != null)
          Agrade.innerHTML = averageGradeOfThisAssign / countAssignments;
        assignment_name.appendChild(Agrade);
        assignment_name.appendChild(blank_3);
      }
    }
  }

  $('[class = accordion3],[class = accordion4],[class = accordion5],[id=assignment-table-header],[id=clause-table-header],[id = accordion-content4]').hide();
  $('.tabs').tabs();
  initComments();
  M.textareaAutoResize($('[id^=comment]'));
  M.updateTextFields();
}

function switchView() {
  document.getElementById('myTable').innerHTML = '';
  document.getElementsByTagName('thead')[0].innerHTML = '';

  rowsPerPage = $('#rpp1').val()
  if (rowsPerPage != -1) {
    end1 -= rowsPerPage;
    currentFirstEntry1 -= rowsPerPage;
  }

  if (switch1) {
    $('#search').attr('placeholder', 'Enter a student name...'); //used in row to show to determine which view is active
    $('#theSwitchViewButton').html('Student View').slideDown().delay(1500).slideUp();
    rowstoshow1();
    switch1 = false;
  }
  else {
    $('#search').attr('placeholder', 'Enter a clause...'); //used in row to show to determine which view is active
    $('#theSwitchViewButton').html('Clause View').slideDown().delay(1500).slideUp();
    rowstoshow1();
    switch1 = true;
  }

  $('.sorting_asc, .averageGradeSort1').click(function (e) { sortNamesInTable1(e, 'myTable'); });
  $('[id=clause-table-header],[class = accordion1], [id = accordion-content1],[class = accordion2], [id = accordion-content2]').hide();

}


function sortNamesInTable2(event, tableid) {
  if ($(event.target).hasClass('sorting_asc2')) {
    classroom_table_contents.Students = _.sortBy(classroom_table_contents.Students, "Name");
  }
  else if ($(event.target).hasClass('averageGradeSort')) {
    classroom_table_contents.Students = _.sortBy(classroom_table_contents.Students, "TotalGrades").reverse();
  }
  $('#myTable2').html('');
  currentFirstEntry2 = 0;
  rowstoshow2();

  $('.sorting_asc2, .averageGradeSort').click(function (e) { sortNamesInTable2(e, 'myTable2'); });
}

/*sorting table of assignment by name or average grade*/

$('.sorting_asc, .averageGradeSort1').click(function (e) { console.log("3"); sortNamesInTable1(e, 'myTable'); });

function sortNamesInTable1(event, tableid) {

  // ! switch = student view
  if ($(event.target).hasClass('sorting_asc') && !switch1) {
    classroom_table_contents.Students = _.sortBy(classroom_table_contents.Students, "Name")
    studentAnswers = _.sortBy(studentAnswers, "User_name");
    //reverse
  }
  if ($(event.target).hasClass('sorting_asc') && switch1) {
    let grades = []
    $('.markOfClauseInAssign').each(function (i, obj) {
      grades.push(obj.innerHTML.substring(0, obj.innerHTML.length - 1))
    })
    classroom_table_contents.Assignments[currentAssignment].ClauseNumber = insertionSort2(grades, classroom_table_contents.Assignments[currentAssignment].Files.Clauses, classroom_table_contents.Assignments[currentAssignment].ClauseNumber)
    ar1 = classroom_table_contents.Assignments[currentAssignment].Files.Clauses
    //classroom_table_contents.Assignments = _.sortBy(classroom_table_contents.Assignments, "Clauses").reverse();
    classroom_table_contents.Assignments[currentAssignment].Files.Clauses = ar1.sort();

  }
  else if ($(event.target).hasClass('averageGradeSort1') && switch1) {
    //classroom_table_contents.Assignments = _.sortBy(classroom_table_contents.Assignments, "TotalGrades").reverse();
    let grades = []
    $('.markOfClauseInAssign').each(function (i, obj) {
      grades.push(obj.innerHTML.substring(0, obj.innerHTML.length - 1))
    })
    classroom_table_contents.Assignments[currentAssignment].Files.Clauses = insertionSort1(grades, classroom_table_contents.Assignments[currentAssignment].Files.Clauses, classroom_table_contents.Assignments[currentAssignment].ClauseNumber)

  }

  else if ($(event.target).hasClass('averageGradeSort1') && !switch1) {
    classroom_table_contents.Students = _.sortBy(classroom_table_contents.Students, "TotalGrades");
  }
  $('#myTable').html('');
  rowstoshow1();

  $('.sorting_asc, .averageGradeSort1').click(function (e) { sortNamesInTable1(e, 'myTable'); });
}



function insertionSort1(grades, clauses, numbers) {
  for (var i = 0; i < grades.length; i++) {
    let value = grades[i]
    let clause = clauses[i]
    let number = numbers[i]
    for (var j = i - 1; j > -1 && grades[j] > value; j--) {
      grades[j + 1] = grades[j]
      clauses[j + 1] = clauses[j]
      numbers[j + 1] = numbers[j]
    }
    grades[j + 1] = value
    clauses[j + 1] = clause
    numbers[j + 1] = number
  }
  classroom_table_contents.Assignments[currentAssignment].ClauseNumber = numbers
  return clauses
}

function insertionSort2(grades, clauses, numbers) {
  for (var i = 0; i < numbers.length; i++) {
    let value = grades[i]
    let clause = clauses[i]
    let number = numbers[i]
    for (var j = i - 1; j > -1 && numbers[j] > number; j--) {
      grades[j + 1] = grades[j]
      clauses[j + 1] = clauses[j]
      numbers[j + 1] = numbers[j]
    }
    grades[j + 1] = value
    clauses[j + 1] = clause
    numbers[j + 1] = number
  }
  classroom_table_contents.Assignments[currentAssignment].Files.Clauses = clauses
  return numbers
}
