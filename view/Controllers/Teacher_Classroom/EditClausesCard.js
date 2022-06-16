$(' #closeEditOneFileCard').click(function(){
    
   if($('#EditOneFileCard').css('display')!='none'){
    $('#EditOneClauses').show();

    if($('#SaveEditedAssignment').css('display')=='none' || $('#newFileCard').css('display')=='none'){
      $('#setAnswers').show();
    }
    else{
      $('#setAnswers').hide();
    }
    $('#SaveOneClauses').hide();
    $('#EditOneFileCard').hide();
  }
  //if editonefile card is single file editor, hide overlay! Otherwise in assignment editor keep it
  if($('#newFileCard').css('display')=='none'){
    $('#overlay').hide();
  }

});


// Updates the current clauses in current file to the database. 

$('#SaveOneClauses').click(function(){

      
        var Allclauses = document.getElementById("OnefileContents").getElementsByClassName("two");
        var clauses = [];
        for( clauseInd = 0; clauseInd< Allclauses.length; clauseInd++){
          clauses.push(Allclauses[clauseInd].innerHTML) 
        }
        if(clauses.length > 0){
          classroom_table_contents.Assignments[currentAssignment].Files[currentFile].Clauses = clauses;
          classroom_table_contents.Assignments[currentAssignment].Files[currentFile].Content = $('#OnefileContents').html()
          
        $('#EditOneClauses').show();

        if($('#SaveEditedAssignment').css('display')=='none' || $('#newFileCard').css('display')=='none'){
          $('#setAnswers').show();
        }
        else{
          $('#setAnswers').hide();
        }


        $('#SaveOneClauses').hide();
        $('#setOneAnswers').show();
        $('#setAnswers').show();
        $('#OnefileContents').attr('contenteditable','false');
        enable = false;
        $('#editSubcriptCard').hide();
  
          //post the current updated file contents to the database
          return new Promise(function(resolve, reject) {
          $.post(
            port2 + "Class/Teacher/UpdateFile/"+ classroom_table_contents.Assignments[currentAssignment]._id+"/"+classroom_table_contents.Assignments[currentAssignment].Files[currentFile],{
              Files : classroom_table_contents.Assignments[currentAssignment].Files
            },
            function(data) {
              resolve(data);
            }
          );
        });

        $('#SaveOneClauses').hide();
        $('#EditOneClauses').show();

        if($('#SaveEditedAssignment').css('display')=='none' || $('#newFileCard').css('display')=='none'){
          $('#setAnswers').show();
        }
        else{
          $('#setAnswers').hide();
        }

        
        $('#CloseEditOneFileCard').hide();
        $('#EditClauses').hides();    
        $('#SaveAssignment').show();
        $('#SaveEditedAssignment').hide();   
        }



        else{
          alert("Ensure there is one clause marked!")
        }
});

      