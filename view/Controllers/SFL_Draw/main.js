/**
 *Main file that utilises all other js files to assemble and create the application
 *Refreshing of SVG element - removes previous tree
 *Distinguishes between drawing methods depending on the values of grading, adjust, teacher
 *Assembles all data to be stored to db - grade, tree, sentence,
 *
 */

var body;
userid = 's2';
username = localStorage.getItem("Username")
filename = ''; //see table.html to find where this gets it's value
idOfDocument = userid.substring(userid.indexOf('s') + 1, userid.length);
sentenceId = ''; //see tableCreator to see where this is initialised. 
assignment_content_arr = [];
var diff_array = [];
var SFL_node_pos = [];
var c_diff_array = [];
var in_diff_array = [];
var sentence_adjust = "";
var arrayOfColSpan = []; // keeps track of which cells have colspans > 1
var cellValues = [];
var combinedTable = document.getElementById('combinedTable');
var table = document.getElementById(combinedTable.id);
var rowCount = 0;
joinStrandTables();

function tree() {
    //updateTeacher();
    /*var node_count = 0;
    var previous_x = 0;*/

    var tree = {
        cx: (svgWidth / 2) / devide,
        cy: (svgHeight / 40) / devide,
        w: (svgHeight / 4) / devide,
        h: (svgHeight / 10) / devide,
        size: 1,
        leafDepth: Infinity,
        nodes: []
    };

    //get the nodes

  $(document).ready(function () {
      //$("#AnnoToTree").click(function(event) {
      //////////////////////////////////////////////////////////////////When annotation is ready
      $(" #save").on('click', async function () {
        
        joinStrandTables();
        var table = document.getElementById(combinedTable.id);
        $("table[id^='combinedTable'] tr").each(function(index) {
            var skip = 0;
            var arrayV = [];
            rowCount++;
            var colCount = 0;
            $cells = $(this).find("td");
            $cells.each(function(cellIndex) {
                var numOfCol = table.rows[index].cells[cellIndex].colSpan; //get the colspan of current cell 

                //check if < is in cell. Change it from &lt to < 
                arrayV[cellIndex + skip] = table.rows[index].cells[cellIndex].innerHTML.replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, '').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'");

                //if colspan is greater than 1, save the details in colspan array, and duplicate value n times, n being the size of colspan. 
                //Save it in arrayV. Basically arrayV is a clone but each cell is only 1 colspan long
                if (numOfCol > 1) {
                    var numOfCol = $(this).attr('colspan');
                    var colSpanDetails = { csWidth: numOfCol, idOfCell: "combinedEntry" + (index - 1) + "," + cellIndex };
                    arrayOfColSpan.push(colSpanDetails);
                    for (var i = 1; i < numOfCol; i++) {
                        skip++;
                        arrayV[cellIndex + skip] = table.rows[index].cells[cellIndex].innerHTML;
                    }
                }
                colCount++;
            });
            cellValues.push(arrayV);
        })

        var tableValues = { id: 0, values: [], colspanArray: [], headings: [] };
        tableValues.id = document.getElementById(currentOneStrandTable).id.replace('table', '');
        var arrayOfColSpanOST = getColSpanInfo(arrayOfColSpan, false);
        tableValues.colspanArray = arrayOfColSpanOST;
        tableValues.values = saveOSTValues(arrayOfColSpanOST);
        tableValues.headings = saveOSTHeadings();
        //check if this table has been saved before, if so delete it and make new
        for (x in tablesStored) {
            if (tablesStored[x].id == tableValues.id) {
                tablesStored.splice(x, 1);
            }
        }
        tablesStored.push(tableValues);
        var OSTStoredString = saveOSTTableAsString(tableValues);
        var TSTValues = { id: 0, values: [], colspanArray: [], headings: [] };
        TSTValues.id = document.getElementById(currentThreeStrandTable).id.replace('threeStrandTable', '');
        arrayOfColSpanTST = getColSpanInfo(arrayOfColSpan, true);
        TSTValues.colspanArray = arrayOfColSpanTST;
        TSTValues.values = saveTSTValues(arrayOfColSpanTST);
        TSTValues.headings = saveTSTHeadings();
        //check if this table has been saved before, if so delete it and make new
        for (x in TSTstored) {
            if (TSTstored[x].id == TSTValues.id) {
                TSTstored.splice(x, 1);
            }
        }
        TSTstored.push(TSTValues);
        var TSTStoredString = saveTSTTableAsString(TSTValues);

        $('#isAnalysed' + sentenceId).prop('checked', true).removeClass('disabled');
        var sentenceSelected = document.getElementById('sentence2').innerHTML;
        sentenceSelected = sentenceSelected.replace(/<span class="ULtwo">/g, ""); //get rid of any UL classes 
        sentenceSelected = sentenceSelected.replace(/<\/span>/g, "");
        //save tree before making new tree, this old tree will be saved to database as it would be the non-
        //grade version
        var oldTree = document.getElementById('tree-0');
        if (oldTree != null) { oldTree = oldTree.innerHTML }
  
        //$("#Tree_list").on('click', async function(e) {
        //console.log("sentence : ", sentence);
  
        //if (e.target && e.target.nodeName == "LI") {
        //console.log(e.target.id);
        //need to ensure no element created by d3 exists when reinitalising the tree div
        //should only happen is tree.nodes exists
        if (diff_array != [] && diff_array.length > 0) {
          resetTree();
          refresh();
          refresh_grade();
          redraw();
          redraw_grade();
        } else {
          resetTree();
          refresh();
          redraw();
        }
        addAnnotation();
        //updateTeacher();
        //document.getElementById("progress-bar").innerHTML = 0 + '%';
        //document.getElementById("progress-bar").style.width = 0 + '%';
        var isQuoteAlreadyStored = false;
  
        for (x in node_sentence_array) {
  
          if (node_sentence_array[x].quote == sentenceSelected || node_sentence_array[x].quote == (" " + sentenceSelected)) {
            isQuoteAlreadyStored = true;
            TreeNum = x;
            sentence_adjust = node_sentence_array[x].quote
            sentence = (node_sentence_array[x].quote).split(' ').join('').split("\n").join('').toLowerCase().replace(/\./g, "");
            //console.log("sentence :", sentence);
            createWholeTree();
            break;
          }
        }
  
  
        // issue with d3 and deleting elements - redraw, delete div and re-create div
        //document.getElementById("tree-" + num).remove();
        if (document.getElementById('tree-1') != null) {
          document.getElementById("tree-1").remove();
        }
        var div = document.createElement("div");
        div.setAttribute("id", "tree-" + num);
        document.getElementById("TreeArea").appendChild(div);
        initialise(num);
  
        body = JSON.stringify(WholeTree)
        SFL_node_pos = [];
  
        
  
           tree.nodes = await getTree(body);
          reposition(tree.nodes[0]);
          redraw()
          clauseInfo = {
            "ClauseNumber": sentenceId,
            "Clause_Type": document.getElementById("newRootValue").value,
            "Caption": document.getElementById("newCaptionValue").value,
            "SFL": tree.nodes[0],
            "Annotations": allAnnoOfCurrentTable(node_array, sentenceId),
            "Tree": $('#tree-0').html(),
            
          }
  
          if (adjust) {
  
            console.log(sentenceWithAnnotations)
            sentence = sentenceWithAnnotations.split(' ').join('').split("\n").join('').toLowerCase().replace(/\./g, "");
            sentencetemp = sentence
            reposition_adjust(tree.nodes[0], SFL_node_pos);
            sentence = sentencetemp;
          } else
            reposition(tree.nodes[0]);
  
          redraw();
        
        for (sol in Solution) {
          if (Solution[sol].Answers.ClauseNumber == sentenceId) {
            Solution[sol].Answers.Caption = document.getElementById('newCaptionValue').value;
            if (Solution[sol].Answers.Clause_Type) {
              Solution[sol].Answers.Clause_Type = document.getElementById('newRootValue').value;
            }
            break;
          }
        }
  
  
  
        await defineVariables();
        await compareTree(comparedTree, compareTreeActivate);//activates if user compares their tree against another

        
        var analysisObject = { oneStrandTable: tableValues, threeStrandTable: TSTValues, oneStrandTableString: OSTStoredString, threeStrandTableString: TSTStoredString, SFL: clauseInfo.SFL, Tree: clauseInfo.Tree , Annotations: clauseInfo.Annotations };
        var answerValues = { userName: localStorage.getItem("Username"), groupID: groupId, clauseID: selectedSentenceId, analysis: JSON.stringify(analysisObject) };
        saveAnswers(answerValues);
    

   

    
      });
      $("#TreeButton,#OtherButton").on('click', async function () {
        
        
       
        var sentenceSelected = document.getElementById('sentence2').innerHTML;
        sentenceSelected = sentenceSelected.replace(/<span class="ULtwo">/g, ""); //get rid of any UL classes 
        sentenceSelected = sentenceSelected.replace(/<\/span>/g, "");
        //save tree before making new tree, this old tree will be saved to database as it would be the non-
        //grade version
        var oldTree = document.getElementById('tree-0');
        if (oldTree != null) { oldTree = oldTree.innerHTML }
  
        //$("#Tree_list").on('click', async function(e) {
        //console.log("sentence : ", sentence);
  
        //if (e.target && e.target.nodeName == "LI") {
        //console.log(e.target.id);
        //need to ensure no element created by d3 exists when reinitalising the tree div
        //should only happen is tree.nodes exists
        if (diff_array != [] && diff_array.length > 0) {
          resetTree();
          refresh();
          refresh_grade();
          redraw();
          redraw_grade();
        } else {
          resetTree();
          refresh();
          redraw();
        }
        addAnnotation();
        //updateTeacher();
        //document.getElementById("progress-bar").innerHTML = 0 + '%';
        //document.getElementById("progress-bar").style.width = 0 + '%';
        var isQuoteAlreadyStored = false;
  
        for (x in node_sentence_array) {
  
          if (node_sentence_array[x].quote == sentenceSelected || node_sentence_array[x].quote == (" " + sentenceSelected)) {
            isQuoteAlreadyStored = true;
            TreeNum = x;
            sentence_adjust = node_sentence_array[x].quote
            sentence = (node_sentence_array[x].quote).split(' ').join('').split("\n").join('').toLowerCase().replace(/\./g, "");
            //console.log("sentence :", sentence);
            createWholeTree();
            break;
          }
        }
  
  
        // issue with d3 and deleting elements - redraw, delete div and re-create div
        //document.getElementById("tree-" + num).remove();
        if (document.getElementById('tree-1') != null) {
          document.getElementById("tree-1").remove();
        }
        var div = document.createElement("div");
        div.setAttribute("id", "tree-" + num);
        document.getElementById("TreeArea").appendChild(div);
       // initialise(num);
  
        body = JSON.stringify(WholeTree)
        SFL_node_pos = [];
  
        
  
         var finaltree = await getfinalTree(selectedSentenceId);
          document.getElementById('tree-0').innerHTML= finaltree;
        


    
      });
      $("#TreeArea").on('click', async function () {
        var sentenceSelected = document.getElementById('sentence2').innerHTML;
        sentenceSelected = sentenceSelected.replace(/<span class="ULtwo">/g, ""); //get rid of any UL classes 
        sentenceSelected = sentenceSelected.replace(/<\/span>/g, "");
        //save tree before making new tree, this old tree will be saved to database as it would be the non-
        //grade version
        var oldTree = document.getElementById('tree-0');
        if (oldTree != null) { oldTree = oldTree.innerHTML }
  
        //$("#Tree_list").on('click', async function(e) {
        //console.log("sentence : ", sentence);
  
        //if (e.target && e.target.nodeName == "LI") {
        //console.log(e.target.id);
        //need to ensure no element created by d3 exists when reinitalising the tree div
        //should only happen is tree.nodes exists
        if (diff_array != [] && diff_array.length > 0) {
          resetTree();
          refresh();
          refresh_grade();
          redraw();
          redraw_grade();
        } else {
          resetTree();
          refresh();
          redraw();
        }
        addAnnotation();
        //updateTeacher();
        //document.getElementById("progress-bar").innerHTML = 0 + '%';
        //document.getElementById("progress-bar").style.width = 0 + '%';
        var isQuoteAlreadyStored = false;
  
        for (x in node_sentence_array) {
  
          if (node_sentence_array[x].quote == sentenceSelected || node_sentence_array[x].quote == (" " + sentenceSelected)) {
            isQuoteAlreadyStored = true;
            TreeNum = x;
            sentence_adjust = node_sentence_array[x].quote
            sentence = (node_sentence_array[x].quote).split(' ').join('').split("\n").join('').toLowerCase().replace(/\./g, "");
            //console.log("sentence :", sentence);
            createWholeTree();
            break;
          }
        }
  
  
        // issue with d3 and deleting elements - redraw, delete div and re-create div
        //document.getElementById("tree-" + num).remove();
        if (document.getElementById('tree-1') != null) {
          document.getElementById("tree-1").remove();
        }
        var div = document.createElement("div");
        div.setAttribute("id", "tree-" + num);
        document.getElementById("TreeArea").appendChild(div);
        initialise(num);
  
        body = JSON.stringify(WholeTree)
        SFL_node_pos = [];
  
        
  
           tree.nodes = await getTree(body);
          reposition(tree.nodes[0]);
          redraw()
          clauseInfo = {
            "ClauseNumber": sentenceId,
            "Clause_Type": document.getElementById("newRootValue").value,
            "Caption": document.getElementById("newCaptionValue").value,
            "SFL": tree.nodes[0],
            "Annotations": allAnnoOfCurrentTable(node_array, sentenceId),
            "Tree": $('#tree-0').html(),
            
          }
  
          if (adjust) {
  
            console.log(sentenceWithAnnotations)
            sentence = sentenceWithAnnotations.split(' ').join('').split("\n").join('').toLowerCase().replace(/\./g, "");
            sentencetemp = sentence
            reposition_adjust(tree.nodes[0], SFL_node_pos);
            sentence = sentencetemp;
          } else
            reposition(tree.nodes[0]);
  
          redraw();
        
        for (sol in Solution) {
          if (Solution[sol].Answers.ClauseNumber == sentenceId) {
            Solution[sol].Answers.Caption = document.getElementById('newCaptionValue').value;
            if (Solution[sol].Answers.Clause_Type) {
              Solution[sol].Answers.Clause_Type = document.getElementById('newRootValue').value;
            }
            break;
          }
        }
      })

      
    });
    return tree;
  }
var tree = tree();

function useAsKey(str) {
    //replace '.','-', make sure it doesn't start with a number,
    str = str.split(' ').join('').split("\n").join('').toLowerCase().replace(/\./g, "").replace(/\-/g, "");
    if (str.charAt(0) == 0) {
        alert("Cannot use a file with a name starting with a digit");
        return -1;
    } else {
        return str;
    }
}

function findIndex(arr, id, isThreeStrand) {

    for (x in arr) {
        if (arr[x].id == id) {
            return x;
        }
        //if annotation id example id = '212,45'
        else if (arr[x].id.indexOf(',') != -1 && arr[x].id.substring(0, arr[x].id.indexOf(',')) == id) {
            return x;
        }
    }
    return -1;
}


function findIndexInObj(arr, id) {
    for (x in arr) {
        if (arr[x].sentenceId == id) {
            return x;
        }
    }
    return -1;
}

function allAnnoOfCurrentTable(nodes, id) {
    var array = [];
    for (x in nodes) {
        if (nodes[x].id.substring(0, nodes[x].id.indexOf(',')) == id) {
            array.push(nodes[x]);
        }
    }
    return array;
}

function saveAnswers(answers) {
  $.ajax({
      type: "POST",
      url: backendPort + "/analysis/saveAnswers",
      data: answers,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
          window.location.reload();
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });
}

getTree = function(body) {
  var nodes=[];
  var res;
  var body={
    body: body
  }
  return new Promise(function(resolve, reject) {
  $.ajax({
    type: "POST",
    url: backendPort + "/analysis/treetest",
    data: body,
    dataType: "json",
    encode: true,
    beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
    success: function(data) {
      var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
      nodes[0] = JSON.parse(res);
     resolve(nodes) ;
    },
    error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
    }
  // var nodes;
  // var res;
  // return new Promise(function(resolve, reject) {
  //     $.post(
  //         backendPort + "/analysis/treetest", {
  //             body
  //         },
  //         function(data) {
  //             var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
  //             nodes = JSON.parse(res);
  //             resolve(nodes);
  //         }
  //     );
  });
});
}

getfinalTree = function(body) {

  return new Promise(function(resolve, reject) {
    $.ajax({
      type: "GET",
      url: backendPort + "/analysis/getTree/" + body,
      dataType: "HTML",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
        var tree = data;
      resolve(tree) ;
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  // var nodes;
  // var res;
  // return new Promise(function(resolve, reject) {
  //     $.post(
  //         backendPort + "/analysis/treetest", {
  //             body
  //         },
  //         function(data) {
  //             var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
  //             nodes = JSON.parse(res);
  //             resolve(nodes);
  //         }
  //     );
  });
});
}

function joinStrandTables() {
  isOneStrandEntryArray = [];
  var joinedTable = document.getElementById(currentOneStrandTable).cloneNode(true);
  var tst = document.getElementById(currentThreeStrandTable).cloneNode(true);
  combinedTable.innerHTML = joinedTable.innerHTML;
  //remove heading

  rowNum = tst.rows.length - 1;
  for (var j = 0; j < rowNum; j++) {
      tst.rows[1].deleteCell(0); //remove first column
      $('#' + combinedTable.id + ' tbody').append(tst.rows[1]);
  }
  //also rename each cell in this table to combinedEntryN,M

  for (var i = 1, row; row = combinedTable.rows[i]; i++) {
      isEntryOneStrand = [];
      for (var j = 0, col; col = row.cells[j]; j++) {
          col.id = "combinedEntry" + (i - 1) + ',' + j;
      }
  }

  combinedTable.id = joinedTable.id.replace("table", "combinedTable");
  //console.log(combinedTable)
}

function getColSpanInfo(arrayOfColSpan, isThreeStrand) {

  var lenOST = $('table[id^="table"] tr').length - 1; //minus the heading row
  var colspanInfo = [];
  var index = 0;

  for (x = 0; x < arrayOfColSpan.length; x++) {
      var n = arrayOfColSpan[x].idOfCell.replace('combinedEntry', '');
      n = n.substring(0, n.indexOf(','));
      //console.log("This is the id row: "+ n );
      if ((!isThreeStrand) && n < lenOST) {
          colspanInfo[index] = arrayOfColSpan[x];
          colspanInfo[index].idOfCell = colspanInfo[index].idOfCell.replace('combinedEntry', 'tableEntry')
          index++;
      } else if (isThreeStrand && n >= lenOST) {
          colspanInfo[index] = arrayOfColSpan[x];
          colspanInfo[index].idOfCell = colspanInfo[index].idOfCell.replace('combinedEntry', 'TSAEntry')
          correctRow = parseInt(colspanInfo[index].idOfCell.substring(colspanInfo[index].idOfCell.indexOf('y') + 1, colspanInfo[index].idOfCell.indexOf(','))) - lenOST;
          colspanInfo[index].idOfCell = colspanInfo[index].idOfCell.substring(0, colspanInfo[index].idOfCell.indexOf('y') + 1) + correctRow + colspanInfo[index].idOfCell.substring(colspanInfo[index].idOfCell.indexOf(','), colspanInfo[index].idOfCell.length)
          index++;
      }
  }
  return colspanInfo;
}