// When new assignment information is filled out
// Check if form is valid, no input is empty
// If valid populate file list to edit clauses.


$('#setClauses').click(function(){
    var formValidated = false;
    var files = document.getElementById("fileUpload").files;
    if($('#newAssignmentTitle').val()!='' && $('#datepicker1').val()!=''
   && files.length > 0){
     formValidated = true;
   }
   if(formValidated){
     $('#newFileCard').show();
      // $('#newAssignmentCard').hide();
       populateNewFileList();
       EditFileCardActivate();
   }
   else{
       alert('Missing field');
     console.log($('#newAssignmentTitle').val());
     console.log($('#datepicker1').val());
     console.log($('#datepicker2').val());
     console.log($('#newAssignmentDets').val());
     console.log(files.length);

   }
   $('#EditClauses').show();
   $('#EditOneClauses').hide();
   $('#setAnswers').hide();
   $('#SaveAssignment').show();
   $('#SaveEditedAssignment').hide();
   $('#SaveOneClauses').hide();
   $('#headingOfNewCard').html('New Assignment  ->  Add Clauses')
   isCreateNewAssignment = true;
 });

$('#SetThisClause').click(function(){
    $('#EditClauses').show();
    $('#SetThisClause').hide();
    $('#EditOneFileCard').hide();

    var Allclauses = document.getElementById("OnefileContents").getElementsByClassName("two");
     var clauses = [];
    for( clauseInd = 0; clauseInd< Allclauses.length; clauseInd++){
        clauses.push(Allclauses[clauseInd].innerHTML) 
    }

  if(isCreateNewAssignment){
    assignmentFiles[currentFile].Clauses = clauses;
    assignmentFiles[currentFile].Content = $('#OnefileContents').html();
  }
  else{
    classroom_table_contents.Assignments[currentAssignment].Files[currentFile].Clauses = clauses;
    // if editing through assignment and not through individual file editing 
    if(assignmentFiles != null && assignmentFiles.length > 0){
      console.log(assignmentFiles)
      assignmentFiles[currentFile].Content = $('#OnefileContents').html();
    }
    else{
       classroom_table_contents.Assignments[currentAssignment].Files[currentFile].Clauses = clauses
      $('#SaveOneClauses').click();
      $('#overlay').hide();
    }
  }

});

 var fileWithClauseContents = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Fusce tellus. Nullam at arcu a est sollicitudin euismod. Fusce tellus. Maecenas lorem. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Nullam at arcu a est sollicitudin euismod. Nunc auctor. Maecenas aliquet accumsan leo. Et harum quidem rerum facilis est et expedita distinctio. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Pellentesque arcu. Aliquam erat volutpat. Pellentesque arcu. Aliquam in lorem sit amet leo accumsan lacinia. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris tincidunt sem sed arcu. Donec iaculis gravida nulla. Aenean id metus id velit ullamcorper pulvinar.</p>'; 
  



// Edit the clauses in both edit and new assignment creation
function EditFileCardActivate(){
/*
  $('li[id^="uniqueFileId"]').click(function(e){
    e.stopPropagation();
    //Show the edit file card with the file selected contents 
          currentFile = $(this).closest('li[id^="uniqueFileId"]').index();
          //console.log(indexOfNewFileInAssignmentFiles)
          $('#EditOneFileCard').show();
          if(isCreateNewAssignment){
            fileWithClauseContents = assignmentFiles[currentFile].Content;//only for new assignment 
            $('#EditOneClauses').hide();
            $('#setAnswers').hide();
            $('#EditClauses').show();
            $('#SetThisClause').hide();
            $('#SaveOneClauses').hide();
        }
          else{
            fileWithClauseContents = classroom_table_contents.Assignments[currentAssignment].Files[currentFile].Content;
            $('#EditClauses').hide();
            $('#EditOneClauses').show();
            
            if($('#SaveEditedAssignment').css('display')=='none' || $('#newFileCard').css('display')=='none'){
              $('#setAnswers').show();
            }
            else{
              
              $('#setAnswers').hide();
            }

            $('#SetThisClause').hide();
            $('#SaveOneClauses').hide();
          }
          $('#OnefileContents').html(fileWithClauseContents);

        var height = $('body').height();
        $('#overlay').css({'height':height+'px'}).show();

      });
*/
}

$('#EditClauses').click(function(){

    $('#EditClauses').hide();

    $('#SetThisClause').show();
    var element = $('#OnefileContents');
    element.attr('contenteditable','true');
    enable = true;
    setClause(element, "OnefileContents");
});

$('#SaveAssignment').click(async function(){
  
  
    //send the current assignment data to be updated
    return new Promise(async function(resolve, reject) {
      $.post(
        port2 + "Class/Teacher/NewAssignment",
        {
            "Title" : $('#newAssignmentTitle').val(),
            "Start_Date" : $('#datepicker1').val(),
            "Due_Date" : $('#datepicker2').val(),
            "Description" : $('#newAssignmentDets').val(),
            "Files" : assignmentFiles,
            "Classroom" : classroomid
        },
        function(data) {
          resolve(data);
        }
      );
      
      newAssign = {
        "Title" : $('#newAssignmentTitle').val(),
            "Start_Date" : $('#datepicker1').val(),
            "Due_Date" : $('#datepicker2').val(),
            "Description" : $('#newAssignmentDets').val(),
            "Files" : assignmentFiles,
            "Classroom" : classroomid
      }
      classroom_table_contents.Assignments.push(newAssign)
      currentAssignment = classroom_table_contents.Assignments.length -1;
      currentFile = 0;
      $('#setAnswersCard').show();
      isCreateNewAssignment = false;
      console.log(classroom_table_contents.Assignments[currentAssignment]);
    });

      

    
     
});
