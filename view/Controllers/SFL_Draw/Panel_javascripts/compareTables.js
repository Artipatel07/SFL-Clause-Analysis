otherStudentOSTables = []
otherStudentTST = []
placeComparePanel = false;
compareTreeActivate = false;
comparedTree = '';



async function getOtherStudentsResults(StudentId, sentence_id){

  var table = await getStudentSFL_db(StudentId);
  otherStudentOSTables = [];
  otherStudentTrees = [];
  filename = useAsKey(filename);
  

  for(x in table[filename]){
    //ensure ost has colspan and value properties, then load this into otherstudenttable array
    if(table[filename][x].OneStrandTable.hasOwnProperty('colspanArray') && table[filename][x].OneStrandTable.hasOwnProperty('values') ){
      otherStudentOSTables.push(table[filename][x].OneStrandTable);
    }
    else if(table[filename][x].OneStrandTable.hasOwnProperty('values') ){
      table[filename][x].OneStrandTable.colspanArray = [];
      otherStudentOSTables.push(table[filename][x].OneStrandTable);
    }
    else if (table[filename][x].OneStrandTable.hasOwnProperty('colspanArray') ){
      table[filename][x].OneStrandTable.colspanArray = [];
      otherStudentOSTables.push(table[filename][x].OneStrandTable);
    }
    else{
      table[filename][x].OneStrandTable.colspanArray = [];
      table[filename][x].OneStrandTable.colspanArray = [];
      otherStudentOSTables.push(table[filename][x].OneStrandTable);
    }


    //ensure tst has colspan and value properties
    if(table[filename][x].ThreeStrandTable.hasOwnProperty('colspanArray') && table[filename][x].ThreeStrandTable.hasOwnProperty('values') ){
      otherStudentTST.push(table[filename][x].ThreeStrandTable);
    }
    else if(table[filename][x].ThreeStrandTable.hasOwnProperty('values') ){
      table[filename][x].ThreeStrandTable.colspanArray = [];
      otherStudentTST.push(table[filename][x].ThreeStrandTable);
    }
    else if (table[filename][x].ThreeStrandTable.hasOwnProperty('colspanArray') ){
      table[filename][x].ThreeStrandTable.colspanArray = [];
      otherStudentTST.push(table[filename][x].ThreeStrandTable);
    }
    else{
      table[filename][x].ThreeStrandTable.colspanArray = [];
      table[filename][x].ThreeStrandTable.colspanArray = [];
      otherStudentTST.push(table[filename][x].ThreeStrandTable);
    }

    //gett the other students tree
    otherStudentTrees.push(table[filename][x].Tree);

  }
  //find the table corrosponding to the sentence that the user wants to compare, load it into table with id=comparedTable 
    for(y in otherStudentOSTables){
  		if(otherStudentOSTables[y].id === sentence_id.replace("flip","")){
        for(z in otherStudentTST){
          if(otherStudentTST[z].id === sentence_id.replace("flip","")){
            loadOtherTable(otherStudentOSTables[y],otherStudentTST[z]);
            placeComparePanel = true;
            compareTreeActivate = true;
            comparedTree = otherStudentTrees[y]; // this will be entered into compareTree func (called in main.js)
            break;
          }
        }
        break;
  		}
  	}
}

function loadOtherTable(ost, tst ){
  loadOtherTableOST(ost,'comparedTable');
  loadOtherTableTST(tst,'comparedTableTST');
  /* hide unnecessary tables*/
  $('#compareTableTST').hide();
  $('#threeStrandTable').hide();
}
//load table that has been filled in before
function loadOtherTableOST(tableToLoad, tableID){

  changeTableId("table"+tableToLoad.id);
  //add the headings//
  var tableContent = '<tr>';
  for (index = 0; index < tableToLoad.headings.length; index++) {
    tableContent += "<th padding: 8px;' >" + tableToLoad.headings[index] + "</th>";
  }
  tableContent += '</tr>';
  //add the appropriate number of rows and cols to the table
  for(x in tableToLoad.values){
    tableContent += "<tr>";
    for (col = 0; col < tableToLoad.values[x].length; col++) {
      tableContent += "<td id = 'tableCE" + x + "," + col + "' style='padding: 8px;' contenteditable></td>";
     }
    tableContent +=  '</tr>';
  }

  document.getElementById(tableID).innerHTML = tableContent;
  //add the colspan
  for(x in tableToLoad.colspanArray){
  	var compareTableEntry = ("tableCE" + tableToLoad.colspanArray[x].idOfCell.replace("tableEntry",""));
    document.getElementById(compareTableEntry).colSpan = tableToLoad.colspanArray[x].csWidth;
  }
  //load values into these cells
  for(x in tableToLoad.values){
    for (var y = 0; y < tableToLoad.values[x].length; y++ ) {
      document.getElementById('tableCE' + x +',' + y).innerHTML = tableToLoad.values[x][y] ;
     }
  }
}


//load table that has been filled in before
function loadOtherTableTST(tableToLoad, tableID){

  //changeTableId("table"+tableToLoad.id);
  //add the headings//
  var tableContent = '<tr>';
  for (index = 0; index < tableToLoad.headings.length; index++) {
    tableContent += "<th padding: 8px;' >" + tableToLoad.headings[index] + "</th>";
  }
  tableContent += '</tr>';
  //add the appropriate number of rows and cols to the table
  for(x in tableToLoad.values){
    tableContent += "<tr>";
    for (col = 0; col < tableToLoad.values[x].length; col++) {
      if(col == 0){
        tableContent += "<td>"+tableToLoad.values[x][col]+"</td>";
      }
      else{
        tableContent += "<td id = 'tsatableCE" + x + "," + (col-1) + "' style='padding: 8px;' contenteditable></td>";
      }
     }

    tableContent +=  '</tr>';
  }

  document.getElementById(tableID).innerHTML = tableContent;
  //add the colspan
  for(x in tableToLoad.colspanArray){
  	var compareTableEntry = ("tsatableCE" + tableToLoad.colspanArray[x].idOfCell.replace("TSAEntry",""));
    document.getElementById(compareTableEntry).colSpan = tableToLoad.colspanArray[x].csWidth;
  }
  //console.log(document.getElementById('comparedTableTST').innerHTML);
  //load values into these cells
  for(x in tableToLoad.values){
    for (var y = 0; y < tableToLoad.values[x].length-1; y++ ) {
      //console.log(x + " : " + y)
      document.getElementById('tsatableCE' + x +',' + y).innerHTML = tableToLoad.values[x][y+1] ;
     }
  }
}



function colorCompareTables2(table1, table2){
  //transverse through table1 cells
  id = table1.id.replace(/[0-9]/g, '');
  if(id == 'comparedTableTST' || id == 'threeStrandTable'){
    for(var i=1; i < table1.rows.length; i++){
      for(var j = 1; j < table1.rows[i].cells.length-1; j++){
        val1 = table1.rows[i].cells[j].innerHTML; //current value cell
        //compare this value with all the values in the same column in table 2, user may enter
        //this value in another row but in the same column
        
          if(table2.rows[i] != null && table2.rows[i].cells[j] != null){
            val2 = table2.rows[i].cells[j].innerHTML;
          }
          
          else{
            val2 = '';
          }
          if(val1 == val2){
            table1.rows[i].cells[j].style.backgroundColor = '#00FF00';
            table1.rows[i].cells[j].style.color = '#FFFFFF';	
          }
          else if(val1 != val2 &&  table1.rows[i].cells[j].style.backgroundColor != 'rgb(0, 255, 0)'){
            //console.log( table1.rows[i].cells[j].style.backgroundColor);
            table1.rows[i].cells[j].style.backgroundColor = '#cd8484';	
            table1.rows[i].cells[j].style.color = '#FFFFFF';	
          }
        
      }
    }
  }
  else{
    for(var i=1; i < table1.rows.length; i++){
      for(var j = 0; j < table1.rows[i].cells.length-1; j++){
        val1 = table1.rows[i].cells[j].innerHTML; //current value cell
        //compare this value with all the values in the same column in table 2, user may enter
        //this value in another row but in the same column
        for(var k = 1; k < table2.rows.length; k++){
          if(table2.rows[k] != null && table2.rows[k].cells[j] != null){
            val2 = table2.rows[k].cells[j].innerHTML;
          }
          else{
            val2 = '';
          }
          if(val1 == val2){
            table1.rows[i].cells[j].style.backgroundColor = '#00FF00';
            table1.rows[i].cells[j].style.color = '#FFFFFF';	
          }
          else if(val1 != val2 &&  table1.rows[i].cells[j].style.backgroundColor != 'rgb(0, 255, 0)'){
            //console.log( table1.rows[i].cells[j].style.backgroundColor);
            table1.rows[i].cells[j].style.backgroundColor = '#cd8484';	
            table1.rows[i].cells[j].style.color = '#FFFFFF';	
          }
        }
      }
    }
  }
}

function colorCompareTables(table1,table2)
   {
   	//var rows = table1.getElementsByTagName("tr");
   	for(var i=1; i < table1.rows.length; i++){
   		for(var j = 0; j < table1.rows[i].cells.length-1; j++){
   			val1 = table1.rows[i].cells[j].innerHTML;
   			if(table2.rows[i] != null && table2.rows[i].cells[j] != null){
   				val2 = table2.rows[i].cells[j].innerHTML;
   			}
   			else{
   				val2 = '';
   			}

   			if(val1 == val2){
             table1.rows[i].cells[j].style.backgroundColor = '#00FF00';
             table1.rows[i].cells[j].style.color = '#FFFFFF';		
   			}
   			else{
           table1.rows[i].cells[j].style.backgroundColor = '#cd8484';	
           table1.rows[i].cells[j].style.color = '#FFFFFF';	
   			}
   		}
   	}
   }
//note : tables are passed by reference so you just pass them using document.getElementById("tableID") method.