/*rows to show 2 determines which rows should be loaded into the student table
  The default is 10 entries per page but the user can select 20/30/40/50/all entries per page*/
$('#next_dataset1, #prev_dataset1').click(function () {
  rowstoshow1(this);
});



$('#rpp1').change(function () {
  currentFirstEntry1 = 0;
  var rpp = $('#rpp1').val()
  if (rpp != -1) { end1 = rpp; }
  else { end1 = classroom_table_contents.Students.length }

  $('#next_dataset1').click();

  $('.sorting_asc, .averageGradeSort1').click(function (e) { sortNamesInTable1(e, 'myTable'); });

}) //if users selects a different row per page value, update table

/*determines which rows that should be shown in the table.*/
function rowstoshow1(event) {
  let wasPrevStepNext = true;
  var rowsPerPage1 = $('#rpp1').val(); //student table
  var numberOfStudents = 0;
  rowsPerPage1 = parseInt(rowsPerPage1);
  var isStudentView = true;
  /*its the student view of search bar says Enter a student name here*/
  if ($('#search').attr('placeholder') != "Enter a student name...") { isStudentView = false; }
  if (isStudentView) { numberOfStudents = classroom_table_contents.Students.length }
  else if (classroom_table_contents.Assignments[currentAssignment] != null && classroom_table_contents.Assignments[currentAssignment].Files != null) {
    numberOfStudents = classroom_table_contents.Assignments[currentAssignment].Files.Clauses.length;
  }

  //no entries
  if (numberOfStudents <= 0) {
    $('#datatable_info').html('0 of 0');
    $('#next_dataset1').hide();
    $('#prev_dataset1').hide();
  }

  if (rowsPerPage1 == -1) {
    currentFirstEntry1 = 0;
    end1 = numberOfStudents;
    $('#next_dataset1').hide();
    $('#prev_dataset1').hide();
    if (isStudentView) { create_StudentViewTable(); }
    else { create_ClauseViewTable(); }
  }


  else {

    //if at the start of the dataset, disable the prev_dataset option
    if (event == null) {
      currentFirstEntry1 = 0;
      $('#prev_dataset1').hide();
      //if at the start of the page and theres not enough entries to move to the next dataset
      if (numberOfStudents - rowsPerPage1 < 0) {
        $('#next_dataset1').hide()
      }
      else {
        $('#next_dataset1').show()
      }
      end1 = currentFirstEntry1 + rowsPerPage1;
      if (numberOfStudents < rowsPerPage1) { end1 = numberOfStudents }

      if (isStudentView) { create_StudentViewTable(); }
      else { create_ClauseViewTable(); }

      $('#datatable_info').html(currentFirstEntry1 + '-' + end1 + ' of ' + numberOfStudents);
      currentFirstEntry1 = currentFirstEntry1 + rowsPerPage1;
    }


    //if next is clicked
    else if (event == null || event.id == 'next_dataset1') {
      if (!wasPrevStepNext) {
        end1 = currentFirstEntry1 + (rowsPerPage1 * 2);
      }
      else {
        end1 = currentFirstEntry1 + rowsPerPage1;
      }

      wasPrevStepNext = true;
      // when the list of students comes to an end and the entries are lower than allowed entries
      if (end1 >= numberOfStudents) {
        end1 = numberOfStudents;
        $('#next_dataset1').hide();
      }

      //when the list as more entries than allowed on the page
      else {
        $('#next_dataset1').show();
        $('#prev_dataset1').show();
      }
      if (currentFirstEntry1 != 0) {
        $('#prev_dataset1').show();
      }
      if (isStudentView) { create_StudentViewTable(); }
      else { create_ClauseViewTable(); }


      $('#datatable_info').html(currentFirstEntry1 + '-' + (end1) + ' of ' + numberOfStudents);
      currentFirstEntry1 = currentFirstEntry1 + rowsPerPage1;
    }

    //if previous is clicked
    else if (event.id == 'prev_dataset1') {
      if (wasPrevStepNext) {
        currentFirstEntry1 = currentFirstEntry1 - (rowsPerPage1 * 2);
      }
      else {
        currentFirstEntry1 -= rowsPerPage1;
      }


      // when the list of students comes to an end2 and the entries are lower than allowed entries
      if (currentFirstEntry1 == 0) {
        $('#prev_dataset1').hide();
        $('#next_dataset1').show();
        end1 = rowsPerPage1;
        if (isStudentView) { create_StudentViewTable(); }
        else { create_ClauseViewTable(); }
      }

      //when the list as more entries than allowed on the page
      else if (currentFirstEntry1 > 0) {
        $('#next_dataset1').show();
        end1 = currentFirstEntry1 + rowsPerPage1;
        if (isStudentView) { create_StudentViewTable(); }
        else { create_ClauseViewTable(); }
      }
      //console.log(currentFirstEntry1 +'-'+end1+' of ' + numberOfStudents);
      $('#datatable_info').html(currentFirstEntry1 + '-' + (end1) + ' of ' + numberOfStudents);
      if (wasPrevStepNext) {
        currentFirstEntry1 += rowsPerPage1;
      }
      wasPrevStepNext = false;
    }
  }
  toggleFirstLayer();
  toggleTableLayer();
  toggleTreeLayer();

}


/*rows to show 2 determines which rows should be loaded into the student table
  The default is 10 entries per page but the user can select 20/30/40/50/all entries per page*/
$('#next_dataset2, #prev_dataset2').click(function () {
  rowstoshow2(this);
});
$('#rpp2').change(function () {
  currentFirstEntry2 = 0;
  var rpp = $('#rpp2').val()
  if (rpp != -1) { end1 = rpp; }
  else { end2 = classroom_table_contents.Students.length }

  rowstoshow2();
  $('.sorting_asc, .averageGradeSort2').click(function (e) { sortNamesInTable1(e, 'myTable2'); });
}) //if users selects a different row per page value, update table




/*determines which rows that should be shown in the table.*/
function rowstoshow2(event) {
  let wasPrevStepNext = true;
  var rowsPerPage2 = $('#rpp2').val(); //student table
  var numberOfStudents = classroom_table_contents.Assignments.length;


  if (numberOfStudents <= 0) {
    $('datatable_info2').html('0 of 0');
    $('#next_dataset2').hide();
    $('#prev_dataset2').hide();
  }

  rowsPerPage2 = parseInt(rowsPerPage2);

  if (rowsPerPage2 == -1) {
    currentFirstEntry2 = 0;
    end2 = numberOfStudents;
    $('#next_dataset2').hide();
    $('#prev_dataset2').hide();
    create_StudentViewTable2();
  }

  else {
    //if at the start of dataset disable previous dataset button
    //if at the start of the dataset, disable the prev_dataset option
    if (event == null) {
      currentFirstEntry2 = 0;
      $('#prev_dataset2').hide();
      //if at the start of the page and theres not enough entries to move to the next dataset
      if (numberOfStudents - rowsPerPage2 < 0) {
        $('#next_dataset2').hide()
      }
      else {
        $('#next_dataset2').show()
      }
      end2 = currentFirstEntry2 + rowsPerPage2;
      if (numberOfStudents < rowsPerPage2) { end2 = numberOfStudents }

      create_StudentViewTable2();


      $('#datatable_info').html(currentFirstEntry2 + '-' + end2 + ' of ' + numberOfStudents);
      currentFirstEntry2 = currentFirstEntry2 + rowsPerPage2;
    }


    //if next is clicked
    else if (event == null || event.id == 'next_dataset2') {
      if (!wasPrevStepNext) {
        end2 = currentFirstEntry2 + (rowsPerPage2 * 2);
      }
      else {
        end2 = currentFirstEntry2 + rowsPerPage2;
      }

      wasPrevStepNext = true;
      // when the list of students comes to an end and the entries are lower than allowed entries
      if (end2 >= numberOfStudents) {
        end2 = numberOfStudents;
        $('#next_dataset2').hide();
      }

      //when the list as more entries than allowed on the page
      else {
        $('#next_dataset2').show();
        $('#prev_dataset2').show();
      }
      if (currentFirstEntry2 != 0) {
        $('#prev_dataset2').show();
      }
      create_StudentViewTable2();


      $('#datatable_info').html(currentFirstEntry2 + '-' + (end2) + ' of ' + numberOfStudents);
      currentFirstEntry2 = currentFirstEntry2 + rowsPerPage2;
    }


    //if previous is clicked
    else if (event.id == 'prev_dataset2') {
      if (wasPrevStepNext) {
        currentFirstEntry2 = currentFirstEntry2 - (rowsPerPage2 * 2);
      }
      else {
        currentFirstEntry2 -= rowsPerPage2;
      }


      // when the list of students comes to an end2 and the entries are lower than allowed entries
      if (currentFirstEntry2 == 0) {
        $('#prev_dataset2').hide();
        $('#next_dataset2').show();
        end2 = rowsPerPage2;
        create_StudentViewTable2();

      }

      //when the list as more entries than allowed on the page
      else if (currentFirstEntry2 > 0) {
        $('#next_dataset2').show();
        end2 = currentFirstEntry2 + rowsPerPage2;
        create_StudentViewTable2();
      }
      //console.log(currentFirstEntry2 +'-'+end2+' of ' + numberOfStudents);
      $('#datatable_info').html(currentFirstEntry2 + '-' + (end2) + ' of ' + numberOfStudents);
      if (wasPrevStepNext) {
        currentFirstEntry2 += rowsPerPage2;
      }
      wasPrevStepNext = false;
    }
  }
  toggleStudentTreeLayer();
  toggleStudentFirstLayer();
  toggleStudentTableLayer();
  toggleStudentZeroLayer();
  $('.sorting_asc2, .averageGradeSort').click(function (e) { sortNamesInTable2(e, 'myTable2'); });
}


function create_ClauseViewTable() {
  if (classroom_table_contents.Assignments[currentAssignment] != null && (!classroom_table_contents.Assignments[currentAssignment].Hidden) && classroom_table_contents.Assignments[currentAssignment].AnswerVisibility == true) {
    document.getElementsByTagName("thead")[0].innerHTML = '<tr role="row"><th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Clause: activate to sort column descending" aria-sort="ascending">Clause</th><th class="sorting averageGradeSort1" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending">Average Grade</th><th>Similarity</th><th></th><th></th></tr>';
    document.getElementById('myTable').innerHTML = '';
    //current student = 0;
    y = 0;
    var numberOfStudents = 0;
    if (classroom_table_contents.Assignments[currentAssignment] != null && classroom_table_contents.Assignments[currentAssignment].Files != null) {
      numberOfStudents = classroom_table_contents.Assignments[currentAssignment].Files.Clauses.length;
    }

    for (var x = currentFirstEntry1; x < end1; x++) {
      var Tgrade = document.createElement('td');
      var Tmark = document.createElement('td');
      //default values
      Tgrade.innerHTML = '--';
      Tmark.innerHTML = '--';
      var indexofGrade = -1;
      for (grade in studentAnswers) {

        if (studentAnswers[grade].AssignmentId == classroom_table_contents.Assignments[currentAssignment]._id && studentAnswers[grade].Answers.ClauseNumber == x) {
          if (studentAnswers[grade].Grade[0].TABLE_GRADE != null) {
            Tgrade.innerHTML = studentAnswers[grade].Grade[0].TABLE_GRADE + '%';
          }
          if (studentAnswers[grade].Mark != null) {
            Tmark.innerHTML = studentAnswers[grade].Mark + '%';
          }
          indexofGrade = grade;
          break;
        }
      }
      if (studentAnswers[indexofGrade] != null && studentAnswers[indexofGrade].Finished) {
        var clause = document.createElement("tr");
        clause.id = 'accordion_trigger1';
        clause.className = 'odd';
        clause.setAttribute('role', 'row');

        var clause_td = document.createElement('td');
        clause_td.setAttribute('class', 'sorting_2');
        clause_td.innerHTML = classroom_table_contents.Assignments[currentAssignment].Files.Clauses[x];

        var blankAgain = document.createElement('td');
        blankAgain.setAttribute('colspan', 3);
        document.getElementById('myTable').appendChild(clause);
        clause.appendChild(clause_td);
        clause.appendChild(Tmark)
        clause.appendChild(Tgrade);
        clause.appendChild(blankAgain)

        var second_acc = document.createElement('tr');
        second_acc.setAttribute('class', 'accordion2');
        var td_4 = document.createElement('td');
        td_4.setAttribute('colspan', 6);
        var content2 = document.createElement('div');
        content2.setAttribute('class', 'accordion-content2');


        indexOfSol = 0
        //teacher table (first find it)
        for (sol2 in solutions) {
          if (solutions[sol2].AssignmentId == classroom_table_contents.Assignments[currentAssignment]._id && solutions[sol2].Answers.ClauseNumber == x) {
            indexOfSol = sol2;
            break;
          }
        }

        // remove these strings from it to remove last row 
        if (studentAnswers[indexofGrade] != null && studentAnswers[indexofGrade].Answers.OST != null && solutions[indexOfSol] != null && solutions[indexOfSol].Answers.OST != null) {

          content2.innerHTML = makeCompareTabs(indexofGrade, indexOfSol, 0, x, 0)
          content2.innerHTML += makeStudentComment(indexofGrade, indexOfSol, 0, x, y)

        }
        document.getElementById('myTable').appendChild(second_acc);
        second_acc.appendChild(td_4);
        td_4.appendChild(content2);
        // td_4.appendChild(comment);

      }
    }


    $('[class = accordion-content2],[id = clause-table-header],[class = accordion1],[class = accordion2], [id=comments]').hide();
    $('.tabs').tabs();
  }
}

/*sort table of students by name or average grade*/
$('.sorting_asc2, .averageGradeSort').click(function (e) { sortNamesInTable2(e, 'myTable2'); });

function sortNamesInTable2(event, tableid) {
  if ($(event.target).hasClass('sorting_asc2')) {
    classroom_table_contents.Students = _.sortBy(classroom_table_contents.Students, "Name");
  }
  else if ($(event.target).hasClass('averageGradeSort')) {
    classroom_table_contents.Students = _.sortBy(classroom_table_contents.Students, "TotalGrades").reverse();
  }
  $('#myTable2').html('');
  currentFirstEntry2 = 0;
  //create_StudentViewTable2();
  rowstoshow2();
  toggleStudentTreeLayer();
  toggleStudentFirstLayer();
  toggleStudentTableLayer();
  toggleStudentZeroLayer();
  $('.sorting_asc2, .averageGradeSort').click(function (e) { sortNamesInTable2(e, 'myTable2'); });
}

/*sorting table of assignment by name or average grade*/

$('.sorting_asc, .averageGradeSort1').click(function (e) { sortNamesInTable1(e, 'myTable'); });

function sortNamesInTable1(event, tableid) {

  if ($(event.target).hasClass('sorting_asc') && !switch1) {
    classroom_table_contents.Students = _.sortBy(classroom_table_contents.Students, "Name");
  }
  if ($(event.target).hasClass('sorting_asc') && switch1) {
    //classroom_table_contents.Assignments = _.sortBy(classroom_table_contents.Assignments, "Clauses").reverse();
    //console.log(classroom_table_contents.Assignments)
    //gotta fix data structure so that each clause in assignment is {clause:adlkfa} and grades for each clause
  }
  else if ($(event.target).hasClass('averageGradeSort1') && switch1) {
    //classroom_table_contents.Assignments = _.sortBy(classroom_table_contents.Assignments, "TotalGrades").reverse();
    //console.log(classroom_table_contents.Assignments)
  }
  else if ($(event.target).hasClass('averageGradeSort1') && !switch1) {
    classroom_table_contents.Students = _.sortBy(classroom_table_contents.Students, "TotalGrades").reverse();
  }
  $('#myTable').html('');
  rowstoshow1();


  toggleFirstLayer();
  toggleTableLayer();
  toggleTreeLayer();
  $('.sorting_asc, .averageGradeSort1').click(function (e) { sortNamesInTable1(e, 'myTable'); });
}


function create_StudentViewTable2() {

  document.getElementsByTagName("thead")[1].innerHTML = '<tr role="row"><th class="sorting sorting_asc2" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column descending" aria-sort="ascending">Assignment Name</th><th class="sorting averageGradeSort" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending">Average Grade</th><th>Similarity</th></th><th></th><th></th></tr>';
  document.getElementById('myTable2').innerHTML = '';
  for (z = currentFirstEntry2; z < end2; z++) {
    /*student names*/
    if ((!classroom_table_contents.Assignments[z].Hidden) && classroom_table_contents.Assignments[z].AnswerVisibility) {
      var assignment_name = document.createElement("tr");
      assignment_name.id = "accordion_trigger3";
      assignment_name.className = 'odd';
      assignment_name.setAttribute('role', 'row');

      var assignment_name_td = document.createElement('td');
      assignment_name_td.setAttribute('class', 'sorting_1');
      assignment_name_td.innerHTML = classroom_table_contents.Assignments[z].Title;

      var Amark = document.createElement('td');
      Amark.innerHTML = '--'//classroom_table_contents.Assignments[z].AssignmentGrade;
      Amark.className = 'averageMarkOfAssign'

      var Agrade = document.createElement('td');
      Agrade.innerHTML = '--'//classroom_table_contents.Assignments[z].AssignmentGrade;
      Agrade.setAttribute('colspan', 4);
      Agrade.className = 'averageGradeOfAssign'

      document.getElementById('myTable2').appendChild(assignment_name);
      assignment_name.appendChild(assignment_name_td);
      assignment_name.appendChild(Amark);
      assignment_name.appendChild(Agrade);

      var second_header = document.createElement('tr');
      second_header.id = 'clause-table-header';
      var blank_header = document.createElement('th');
      blank_header.setAttribute('colspan', 1);
      var blank_header2 = document.createElement('th');
      blank_header2.setAttribute('colspan', 2);
      var clause_header = document.createElement('th');
      clause_header.innerHTML = 'Clause';
      var mark_header = document.createElement('th');
      mark_header.innerHTML = 'Mark';
      var grade_header = document.createElement('th');
      grade_header.innerHTML = 'Similarity';


      document.getElementById('myTable2').appendChild(second_header);
      second_header.appendChild(blank_header);
      second_header.appendChild(clause_header);
      second_header.appendChild(mark_header);
      second_header.appendChild(grade_header);
      second_header.appendChild(blank_header2);


      averageGradeOfThisAssign = 0;
      averageMarkOfThisAssign = 0;
      counterOfClauses = 0;


      //have a func that returns the array of clauses this students has annotated
      for (y in classroom_table_contents.Assignments[z].Files.Clauses) {

        var grade = document.createElement('td');
        grade.innerHTML = '--' //default
        var mark = document.createElement('td');
        mark.innerHTML = '--'
        var indexofGrade = -1;
        for (grade1 in studentAnswers) {

          if (studentAnswers[grade1].AssignmentId == classroom_table_contents.Assignments[z]._id && studentAnswers[grade1].Answers.ClauseNumber == y) {
            if (studentAnswers[grade1].Grade[0].TABLE_GRADE) {
              grade.innerHTML = studentAnswers[grade1].Grade[0].TABLE_GRADE + '%';
              averageGradeOfThisAssign += parseInt(studentAnswers[grade1].Grade[0].TABLE_GRADE);
            }
            if (studentAnswers[grade1].Mark) {
              mark.innerHTML = studentAnswers[grade1].Mark + '%';
              averageMarkOfThisAssign += parseInt(studentAnswers[grade1].Mark);
            }


            counterOfClauses++;
            indexofGrade = grade1;
          }
        }
        if (studentAnswers[indexofGrade] != null && studentAnswers[indexofGrade].Finished) {
          //console.log(studentAnswers[indexofGrade].Finished)
          var first_acc = document.createElement('tr');
          first_acc.setAttribute('class', 'accordion3');
          first_acc.id = 'accordion_trigger4'

          var blank = document.createElement('td');
          blank.setAttribute('colspan', 1);
          var blank2 = document.createElement('td');
          blank2.setAttribute('colspan', 2);
          var clause = document.createElement('td');
          clause.innerHTML = classroom_table_contents.Assignments[z].Files.Clauses[y];
          //clause.style.cssText= 'padding : 20px;' ;

          document.getElementById('myTable2').appendChild(first_acc);
          //first_acc.appendChild(content1);
          first_acc.appendChild(blank);
          first_acc.appendChild(clause);
          first_acc.appendChild(mark);
          first_acc.appendChild(grade);
          first_acc.appendChild(blank2)


          var second_acc = document.createElement('tr');
          second_acc.setAttribute('class', 'accordion4');
          var td_4 = document.createElement('td');
          td_4.setAttribute('colspan', 6);
          var content2 = document.createElement('div');
          content2.setAttribute('class', 'accordion-content4');

          var sol = 0;
          for (sol1 in solutions) {
            if (solutions[sol1].AssignmentId == classroom_table_contents.Assignments[z]._id && solutions[sol1].Answers.ClauseNumber == y) {
              sol = sol1;
              break;
            }
          }
          // remove these strings from it to remove last row 
          if (studentAnswers[indexofGrade] != null && studentAnswers[indexofGrade].Answers.OST != null && solutions[sol] != null && solutions[sol].Answers.OST != null) {
            content2.innerHTML = makeCompareTabs(indexofGrade, sol, 1, x, y)
            content2.innerHTML += makeStudentComment(indexofGrade, sol, 1, x, y)

          }
          document.getElementById('myTable2').appendChild(second_acc);
          second_acc.appendChild(td_4);
          td_4.appendChild(content2);
        }
      }
      if (counterOfClauses != 0 && averageGradeOfThisAssign != null) {
        console.log(averageGradeOfThisAssign)
        $('.averageGradeOfAssign')[z].innerHTML = (averageGradeOfThisAssign / counterOfClauses) + '%'
      }

      if (counterOfClauses != 0 && averageMarkOfThisAssign != null) {
        console.log(averageMarkOfThisAssign)
        console.log(counterOfClauses)
        $('.averageMarkOfAssign')[z].innerHTML = (averageMarkOfThisAssign / counterOfClauses) + '%'
      }
    }
  }
  $('.tabs').tabs();
  $('[class = accordion3],[class = accordion4],[class = accordion5],[id=file-table-header],[id=clause-table-header],[id = accordion-content4]').hide();
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

    rowstoshow1();
    switch1 = false;
  }
  else {

    $('#search').attr('placeholder', 'Enter a clause...'); //used in row to show to determine which view is active
    rowstoshow1();
    switch1 = true;
  }

  $('.sorting_asc, .averageGradeSort1').click(function (e) { sortNamesInTable1(e, 'myTable'); });
  $('[id=clause-table-header],[class = accordion1], [id = accordion-content1],[class = accordion2], [id = accordion-content2]').hide();

}