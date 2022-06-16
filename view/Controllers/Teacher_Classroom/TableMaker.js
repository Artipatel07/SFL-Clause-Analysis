function filterTheTables(str) {
    removeThisX = new RegExp('<td></td></tr>', "g");
    removeThisX2 = new RegExp('<td><i id="deleteRowButton" title="Remove Row" class="material-icons deleteRowButton">close</i></td>', "g");
    removeThisX3 = new RegExp('<td class="tcs-selection-enabled"><i id="deleteRowButton" title="Remove Row" class="material-icons">close</i></td>', 'g')
    removeThisX4 = new RegExp('contenteditable=""', 'g')
    removeThisX45 = new RegExp('contenteditable="true"', 'g')
    removeThisX5 = new RegExp('<i id="deleteRowButton" title="Remove Row" class="material-icons deleteRowButton">close</i>', 'g')
    removeThisX55 = new RegExp('<i id="deleteRowButton" title="Remove Row" class="material-icons deleteRowButton" style="user-select: auto;">close</i>', 'g')
    removeThisX6 = new RegExp('<td class=""></td>', 'g')
    changeThisX1 = new RegExp('<td>Exp</td>')
    changeThisX2 = new RegExp('<td>Inter</td>')
    changeThisX3 = new RegExp('<td>Text</td>')
    str = str.replace(removeThisX, '</tr>')
    str = str.replace('/deleteRow\(.*\)/', '').replace(removeThisX2, '').replace(removeThisX3, '').replace(removeThisX4, '').replace(removeThisX45, '').replace(removeThisX5, '').replace(removeThisX6, '').replace(changeThisX1, '<td>Experiential</td>').replace(changeThisX2, '<td>Interpersonal</td>').replace(changeThisX3, '<td>Textual</td>');
    return str;
}

function makeCompareTabs(indexofGrade, indexOfSol, num, x, y) {
    if (indexofGrade != -1 && classroom_table_contents.Assignments != null &&
        classroom_table_contents.Assignments[currentAssignment].Files != null &&
        classroom_table_contents.Assignments[currentAssignment].Files.Clauses != null &&
        classroom_table_contents.Assignments[currentAssignment].Files.Clauses[x] != null &&
        studentAnswers[indexofGrade].Answers.Tree != null &&
        solutions[indexOfSol].Answers.Tree != null) {

        var content2 = '';
        newOSTstudent = filterTheTables(studentAnswers[indexofGrade].Answers.OST)
        newOSTteacher = filterTheTables(solutions[indexOfSol].Answers.OST)
        newTSTstudent = filterTheTables(studentAnswers[indexofGrade].Answers.TST)
        newTSTteacher = filterTheTables(solutions[indexOfSol].Answers.TST)

        idForTabs = '' + num + currentAssignment + x + y;
        // setting up tabs

        content2 = '<ul class="tabs"> <li class="tab col s3"><a class="active" href="#' + idForTabs + '1">One Strand</a></li><li class="tab col s3"><a  href="#' + idForTabs + '2">Three Strand</a></li><li class="tab col s3"><a href="#' + idForTabs + '3">Sytactical Tree</a></li><li class="tab col s3"><a href="#' + idForTabs + '4">Feedback</a></li></ul>'

        //'<img src="css/compareTables.png" alt="compared Table">'
        return content2;

    }


}

function makeStudentComment(indexofGrade, indexOfSol, num, x, y) {
    idForTabs = '' + num + currentAssignment + x + y;
    content2 = ''
        // one strand student
    content2 += '<div id="' + idForTabs + '1" class="tabContainer"><div  class="tableInTable" ><div class ="table_Strand_Clause">' + classroom_table_contents.Assignments[currentAssignment].Files.Clauses[x] + '</div><span id="tableOwner">My Answer</span><table id="tableId" class="table table-condensed table-summary table-borderless table-responsive" style=" width: 100%; overflow:auto;  margin-bottom:1px; margin-top:12px">' + newOSTstudent + '</tr></table></div><div class="tableInTable"><span id="tableOwner">Sample Answer:</span><table id="tableId" class="table table-condensed table-summary table-borderless table-responsive" style="width: 100%; overflow:auto;  margin-bottom:1px;  ">' + newOSTteacher + '</tr></table></div></div>';
    // Three strand student -------------------------------------------------------------------------------width: 210%;overflow: auto;margin-bottom: 1px;float: left;display: table;width: 49%;         
    content2 += '<div id="' + idForTabs + '2" class="tabContainer"><div class="tableInTable"><div class ="table_Strand_Clause" style="text-align:center">' + classroom_table_contents.Assignments[currentAssignment].Files.Clauses[x] + '</div><span id="tableOwner">My Answer</span><table id="TSTId" class="table table-condensed table-summary table-borderless table-responsive" style=" width: 100%; overflow: auto;">' + newTSTstudent + '</tr></table></div><div class="tableInTable"><span id="tableOwner">Sample Answer:</span><table id="TSTId" class="table table-condensed table-summary table-borderless table-responsive" style=" width: 100%;margin-top:12px; margin-bottom:1px; overflow:auto;">' + newTSTteacher + '</tr></table></div></div>';
    //Tree 
    content2 += '<div id="' + idForTabs + '3" class="tabContainer"><div class ="table_Strand_Clause">' + classroom_table_contents.Assignments[currentAssignment].Files.Clauses[x] + '</div><div style="text-align: center;" class="SFL_Tree-Compare">' + studentAnswers[indexofGrade].Answers.Tree + '</div><div class="SFL_Tree-Compare"">' + solutions[indexOfSol].Answers.Tree + '</div></div>'

    //Comment
    content2 += '<div style="display : none;  margin-top:5px;" class="alert-block alert-success">Feedback has been sent</div>'

    if (studentAnswers[indexofGrade].Feedback != null) {
        //content2 += '<div id="'+idForTabs+'4"><div style="padding:20px; margin-bottom: 30px;"><span class="input-field" id="tableOwner">'+classroom_table_contents.Students[x].Name+'</span><textarea id="comment'+studentAnswers[y]._id+'" class="comment materialize-textarea" style="width:100%; overflow:auto; display: block;">'+ studentAnswers[y].Feedback+'</textarea><label for="comment'+studentAnswers[y]._id+'">Feedback</label><button id="commentSubmit" style="float:right" class="btn waves-effect waves-light">Submit Feedback</button></div></div>'; 
        content2 += '<div id="' + idForTabs + '4"><div style="padding:20px; margin-bottom: 30px;"><div class="grading input-field"><label class="active" for="have">Grade</label><input type="number" disabled class="input" value="' + studentAnswers[indexofGrade].Mark + '" step="0.1" min="0" tabindex="1">%</div><div style="width:86%; float:right"><label for="comment3">Feedback</label><textarea disabled id="comment" class="comment materialize-textarea" style="width:100%; display: block;">' + studentAnswers[indexofGrade].Feedback + '</textarea></div></div>';

    } else {
        //content2 += '<div id="'+idForTabs+'4"><div style="padding:20px; margin-bottom: 30px;"><span class="input-field" id="tableOwner">'+classroom_table_contents.Students[x].Name+'</span><textarea id="comment'+studentAnswers[y]._id+'" class= "comment materialize-textarea" style="width:100%; overflow:auto; display: block; placeholder="Enter Feedback here..." "></textarea><label for="comment'+studentAnswers[y]._id+'">Feedback</label><button id="commentSubmit" style="float:right" class="btn waves-effect waves-light">Submit Feedback</button></div></div>'; 
        content2 += '<div id="' + idForTabs + '4"><div style="padding:20px; margin-bottom: 30px;"><div class="grading input-field"><label class="active" for="have">Grade</label><input type="number" disabled class="input" value="--" step="0.1" min="0" tabindex="1">%</div><div style="width:86%; float:right"><label for="comment">Feedback</label><textarea disabled id="comment" class= "comment materialize-textarea" style="width:100%;; display: block; placeholder="Enter Feedback here..." "></textarea></div></div>';

    }
    return content2
}

function makeTeacherComment(indexofGrade, indexOfSol, num, x, y) {

    if (classroom_table_contents.Assignments[currentAssignment].Files != null && classroom_table_contents.Assignments[currentAssignment].Files.Clauses != null) {
        let currentDrawnClause;
        if (num > 0) { //if 1 or 2, the table it is making is the overal grade table. The clauses are different here
            currentDrawnClause = classroom_table_contents.Students[x].Clauses[y]
        } else {
            currentDrawnClause = classroom_table_contents.Assignments[currentAssignment].Files.Clauses[x];
        }
        idForTabs = '' + num + currentAssignment + x + y;
        content2 = ''
            // one strand student
        content2 += '<div id="' + idForTabs + '1" class="tabContainer"><div  class="tableInTable" ><div class ="table_Strand_Clause">' + currentDrawnClause + '</div><span id="tableOwner">Student\'s Answer</span><table id="tableId" class="table table-condensed table-summary table-borderless table-responsive" style=" width: 100%; overflow:auto;  margin-bottom:1px; margin-top:12px">' + newOSTstudent + '</tr></table></div><div class="tableInTable"><span id="tableOwner">Sample Answer:</span><table id="tableId" class="table table-condensed table-summary table-borderless table-responsive" style="width: 100%; overflow:auto;  margin-bottom:1px;  ">' + newOSTteacher + '</tr></table></div></div>';
        // Three strand student -------------------------------------------------------------------------------width: 210%;overflow: auto;margin-bottom: 1px;float: left;display: table;width: 49%;         
        content2 += '<div id="' + idForTabs + '2" class="tabContainer"><div class="tableInTable"><div class ="table_Strand_Clause" style="text-align:center">' + currentDrawnClause + '</div><span id="tableOwner">Student\'s Answer</span><table id="TSTId" class="table table-condensed table-summary table-borderless table-responsive" style=" width: 100%; overflow: auto;">' + newTSTstudent + '</tr></table></div><div class="tableInTable"><span id="tableOwner">Sample Answer:</span><table id="TSTId" class="table table-condensed table-summary table-borderless table-responsive" style=" width: 100%;margin-top:12px; margin-bottom:1px; overflow:auto;">' + newTSTteacher + '</tr></table></div></div>';
        //Tree 
        content2 += '<div id="' + idForTabs + '3" class="tabContainer"><div class ="table_Strand_Clause">' + currentDrawnClause + '</div><div style="text-align: center;" class="SFL_Tree-Compare">' + studentAnswers[indexofGrade].Answers.Tree + '</div><div class="SFL_Tree-Compare"">' + solutions[indexOfSol].Answers.Tree + '</div></div>'

        //Comment
        content2 += '<div style="display : none;  margin-top:5px;" class="alert-block alert-success">Feedback has been sent</div>'

        if (studentAnswers[indexofGrade].Feedback != null) {
            content2 += '<div id="' + idForTabs + '4"><div style="padding:20px; margin-bottom: 30px;"><div class="grading input-field"><label for="have">Grade</label><input id="grade' + num + studentAnswers[indexofGrade]._id + '" type="number" class="input" value="' + studentAnswers[indexofGrade].Mark + '" step="0.1" min="0" tabindex="1">%</div><div style="width:86%; float:right"><label for="comment' + num + studentAnswers[indexofGrade]._id + '">Feedback</label><textarea id="comment' + num + studentAnswers[indexofGrade]._id + '" class="comment materialize-textarea" style="width:100%; display: block;">' + studentAnswers[indexofGrade].Feedback + '</textarea></div><button id="commentSubmit" style="float:right" class="btn waves-effect waves-light">Submit Feedback</button></div></div>';

        } else {
            content2 += '<div id="' + idForTabs + '4"><div style="padding:20px; margin-bottom: 30px;"><div class="grading input-field"><label for="have">Grade</label><input id="grade' + num + studentAnswers[indexofGrade]._id + '" type="number" class="input" placeholder="0" step="0.1" min="0" tabindex="1">%</div><div style="width:86%; float:right"><label for="comment' + num + studentAnswers[indexofGrade]._id + '">Feedback</label><textarea id="comment' + num + studentAnswers[indexofGrade]._id + '" class= "comment materialize-textarea" style="width:100%;; display: block; placeholder="Enter Feedback here..." "></textarea></div><button id="commentSubmit" style="float:right" class="btn waves-effect waves-light">Submit Feedback</button></div></div>';

        }

    }

    return content2
}



function roundTwoDecPlaces(num) {
    return Math.round(num * 100) / 100;
}