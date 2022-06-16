


async function getAssignmentInfo() {
  return new Promise(function(resolve, reject) {
    $.get(
      port2 + "Class/Teacher/GetAssignmentInfo/"+classroomid,
      function(data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}


async function getDraftAssignmentInfo() {
  return new Promise(function(resolve, reject) {
    $.get(
      port2 + "Class/Teacher/GetDraftAssignmentInfo/"+classroomid,
      function(data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}
getAllSolution = function(){
  return new Promise(function(resolve, reject) {
    $.post(
      port2 + "SFL_Draw/getAllSolutions",  {
        ClassroomId : classroomid
      },

      function(data) {
        resolve(data);
      }
    );
  });
}

// When Assignment is finished being edited

$('#editClausesButton').click(async function(){
      isCreateNewAssignment = false;
  var formValidated = false;
  document.getElementById('uploadedFilesHere').innerHTML = ''

  //ensure that the assignment title, datepickers and details are not null
  if($('#newAssignmentTitle').val()!='' && $('#datepicker1').val()!='' && $('#datepicker2').val()!='' && $('#').val()!=''){
   formValidated = true;
 }
 if(formValidated){


   // show the card with all files so the clauses can be edited.
   $('#newFileCard').show();
   $('#SetThisClause').hide();

   //change heading of file card where the user marks the clauses
  $('#headingOfNewCard').html('Edit Assignment  ->  Edit Clauses')


   // If files have not changed
   if($('#fileUpload')[0].files.length == 0){

    // make the list of files to clause mark
    for(var f = 0; f < classroom_table_contents.Assignments[currentAssignment].Files.length; f++){
      document.getElementById('uploadedFilesHere').innerHTML += "<li id='uniqueFileId"+classroom_table_contents.Assignments[currentAssignment].Files[f].Name+"'><a style='cursor: pointer'>"+ classroom_table_contents.Assignments[currentAssignment].Files[f].Name+ "</br><span style ='color: #707070; margin-left: 10px'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti... </span></a></li>";
    }
   }
   else{
     // create a new list, assignmentFiles contains all info on uploaded files
     //classroom_table_contents.Assignments[currentAssignment].Files = assignmentFiles;
     populateNewFileList();
   }
    
    removeDuplicates(classroom_table_contents.Assignments[currentAssignment].Files, 'Name');

    EditFileCardActivate();


    //send the current assignment data to be updated
    return new Promise(function(resolve, reject) {
      $.post(
        port2 + "Class/Teacher/UpdateAssignment/"+ classroom_table_contents.Assignments[currentAssignment]._id,
        {
          "Title" : $('#newAssignmentTitle').val(),
          "Start_Date" : $('#datepicker1').val(),
          "Due_Date" : $('#datepicker2').val(),
          "Description" : $('#newAssignmentDets').val(),
          "Files" : $('#fileArray').val()
        },
        function(data) {
          resolve(data);
        }
      );
    });


 }
 else{
   alert("Field is missing")
   console.log($('#newAssignmentTitle').val());
   console.log($('#datepicker1').val());
   console.log($('#datepicker2').val());
   console.log($('#newAssignmentDets').val());

 }
     
});


