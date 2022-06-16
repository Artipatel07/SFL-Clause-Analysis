var row = 1;
var evalIndex = 0;
var nextWordStartIndex = 0; //usful when knowing index of the next word when annotating in table.
var underlineActive = false; // include underlines, set true to activate underline func
var table_heading_editable = true;
var annotationToEvaluate = []; //array of all annotations of a table, used to group annos with same text
// when user clicks on sentence/clause
var deleteButtonHtml = '<i id="deleteRowButton" title="Remove Row" class="material-icons deleteRowButton">close</i>';
var deleteButtonHtmlInDB = '<i id="deleteRowButton" title="Remove Row" class="material-icons deleteRowButton" style="user-select: auto;">close</i>';
var studentsWhoAnno = []; //list of students who annotated
var list = []; // all students who annotated
var oldWords = [];
var row1Values = [];
var words = [];
var indexOfTheCurrentClause;
var selectedSentence = "";
var selectedSentenceId = "";
let classroom;
let Solution;
let Attempt;
var clauseAnswers = null;

function getSentence() {
    makeSentenceClickableAndIndexed();
}

function getCurrentClauseAnswers() {
    
    
}

async function setDataForCurrentClause() {
     tablesStored = [];
    TSTstored = [];
    $.ajax({
        type: "POST",
        url: backendPort + "/analysis/getAnalysis",
        data: { clauseID: selectedSentenceId },
        dataType: "json",
        encode: true,
        beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
        success: function(data) {
            clauseAnswers = data;
            table = clauseAnswers;
       
   
    for (x in table) {
        if (x == "analysis") {
            //push all database one strand table info into program, it also ensure the data has required properties
            if (table[x].oneStrandTable.hasOwnProperty('colspanArray') && table[x].oneStrandTable.hasOwnProperty('values')) {
                tablesStored.push(table[x].oneStrandTable);
            } else if (table[x].oneStrandTable.hasOwnProperty('values')) {
                table[x].oneStrandTable.colspanArray = [];
                tablesStored.push(table[x].oneStrandTable);
            } else if (table[x].oneStrandTable.hasOwnProperty('colspanArray')) {
                table[x].oneStrandTable.colspanArray = [];
                tablesStored.push(table[x].oneStrandTable);
            } else {
                table[x].oneStrandTable.colspanArray = [];
                table[x].oneStrandTable.colspanArray = [];
                tablesStored.push(table[x].oneStrandTable);
            }

            //push all database three strand table info into program, it also ensure the data has required properties
            if (table[x].threeStrandTable.hasOwnProperty('colspanArray') && table[x].threeStrandTable.hasOwnProperty('values')) {
                TSTstored.push(table[x].threeStrandTable);
            } else if (table[x].threeStrandTable.hasOwnProperty('values')) {
                table[x].threeStrandTable.colspanArray = [];
                TSTstored.push(table[x].threeStrandTable);
            } else if (table[x].threeStrandTable.hasOwnProperty('colspanArray')) {
                table[x].threeStrandTable.colspanArray = [];
                TSTstored.push(table[x].threeStrandTable);
            } else {
                table[x].threeStrandTable.colspanArray = [];
                table[x].threeStrandTable.colspanArray = [];
                TSTstored.push(table[x].threeStrandTable);
            }
        }
    }
            
        },
        error: function(xhr, status, error) {
            clauseAnswers = [];
            console.log(status);
            console.log(error);
        } 
    });
        
   
    
}

function changeSelectedSentence(sentenceThatUserSelected, sentenceIdThatUserSelected, isAnswered) {
    selectedSentence = sentenceThatUserSelected;
    selectedSentenceId = sentenceIdThatUserSelected;
   // setDataForCurrentClause(selectedSentenceId);
}

async function defineVariables() {
    //classroom = await getClassroomInfo();
    //var table = await getStudentSFL_db(userid.replace("s", ""));
    //Solution = await getTableSolution();
    //Attempt = await getStudentAttempt();
    table = [];
    /* for (tableAtt in Attempt) {
        table.push(Attempt[tableAtt].Answers);
        $('#isAnalysed' + Attempt[tableAtt].Answers.ClauseNumber).prop('checked', true);
    } */
    //$('.returnToClass').attr('href', port2 + 'Class/Student/' + classroomid)
    //$('#classroomBread').html(classroom.Classroom_name)
    //$('.returnToDash').attr('href', port2 + 'Classroom/Select')
    //list = await getAllStudentTables_db(); //all students who annotated
    tablesStored = [];
    TSTstored = [];
    //assignment_content_arr = [];
    //define table
    //filename = useAsKey(filename);

    for (x in table) {
        //push all database one strand table info into program, it also ensure the data has required properties
        if (table[x].oneStrandTable.hasOwnProperty('colspanArray') && table[x].oneStrandTable.hasOwnProperty('values')) {
            tablesStored.push(table[x].oneStrandTable);
        } else if (table[x].oneStrandTable.hasOwnProperty('values')) {
            table[x].oneStrandTable.colspanArray = [];
            tablesStored.push(table[x].oneStrandTable);
        } else if (table[x].oneStrandTable.hasOwnProperty('colspanArray')) {
            table[x].oneStrandTable.colspanArray = [];
            tablesStored.push(table[x].oneStrandTable);
        } else {
            table[x].oneStrandTable.colspanArray = [];
            table[x].oneStrandTable.colspanArray = [];
            tablesStored.push(table[x].oneStrandTable);
        }

        //push all database three strand table info into program, it also ensure the data has required properties
        if (table[x].threeStrandTable.hasOwnProperty('colspanArray') && table[x].threeStrandTable.hasOwnProperty('values')) {
            TSTstored.push(table[x].threeStrandTable);
        } else if (table[x].threeStrandTable.hasOwnProperty('values')) {
            table[x].threeStrandTable.colspanArray = [];
            TSTstored.push(table[x].threeStrandTable);
        } else if (table[x].threeStrandTable.hasOwnProperty('colspanArray')) {
            table[x].threeStrandTable.colspanArray = [];
            TSTstored.push(table[x].threeStrandTable);
        } else {
            table[x].threeStrandTable.colspanArray = [];
            table[x].threeStrandTable.colspanArray = [];
            TSTstored.push(table[x].threeStrandTable);
        }


        //if values and/or colspan key are empty, add them again to the object
        /* if (table[x] != undefined) {
            assignment_content_arr.push(table[x]);
        } */
    }
    //console.log(tablesStored);
}

$(document).ready(function() {
    $('#flip0').hover(async function(e) {
        await startUp(e);
    });
});

// makes the list of students who annotated //
$(document).ready(function() {
    //when hover over setence
    $('#putcontentshere').mouseover(async function(e) { await startUp(e) }).mouseout(function() {});
})

async function startUp(e) {

    if (e.target && e.target.nodeName == "SPAN" && e.target.id != null) {
        //when hovered over span elements, show list
        //compare table panel has a slightly different panel, its set to true if turned on
        var top = e.pageY + 'px';
        var left = e.pageX + 'px'
        if ($('#panel2').is(':visible')) { $('#panel').hide(); } else { $('#panel').css({ position: 'absolute', top: top, left: left }).show(); }

        var sentence = e.target.id;
        if (sentence == '') { sentence = e.target.parentNode.id; }
        studentsWhoAnno = [];

        for (x in list) {
            if (list[x][filename] != null && list[x][filename] > 0) {
                for (var y = 0; y < list[x][filename].length; y++) {
                    if (list[x][filename][y].sentenceId == sentence.replace("flip", "")) {
                        var studentDetails = {
                            USER_NAME: list[x].User.USER_NAME,
                            USER_ID: list[x].User.USER_ID
                        }
                        studentsWhoAnno.push(studentDetails);
                    }
                }
            }
        }

        setStudentList(studentsWhoAnno, e.target.id);
        //console.log(studentsWhoAnno);
        /* if ((user.role == 'Student' &&
          Attempt != null &&
          Attempt[0] != null &&
          Attempt[0].Finished) ||
          user.role == 'Teacher' &&
          assignment.Complete == 'true' &&
          !isEditing) {
          $('#save').hide()
        } */
        //if underlined function is on, activate it again
        //addUnderlines();
    }
}

$(document).ready(function() {


    $("[id=putcontentshere]").on('click', function(e) {
        if (e.target && e.target.nodeName == "SPAN" && e.target.id != null) {

            var idTable = e.target.id;
            if (idTable == '') { idTable = e.target.parentNode.id; }
            sentenceId = idTable.replace("flip", ""); //find this sentenceId variable in main.js 
            idTable = "table" + sentenceId;
            var sentence = selectedSentence.replace(/     &nbsp;/g, "");
            document.getElementById('sentence2').innerHTML = sentence.replace(/<span class="subscript">\(\d+\)<\/span>/gi, '');
            indexOfTheCurrentClause = sentence.replace(/<span class="subscript">/gi, '').replace(/\n/gi, "").replace(/<\/span>.*/, "");
            /* document.getElementById('comparedTable').innerHTML = ''; */
            sentenceWithAnnotations = ''
                //ensure one strand is showing
            switchToOneStrand();

            var top = e.pageY + 'px';
            var left = e.pageX + 'px';
            var bodyWidth = $('body').width();
            var diff = bodyWidth - e.pageX;


            if (e.pageX > bodyWidth / 2) { $('#panel2').css({ 'max-width': '50%', position: 'absolute', top: top, left: 'auto', right: diff + 'px' }).show(); } else { $('#panel2').css({ 'max-width': '50%', position: 'absolute', top: top, left: left, right: 'auto' }).show(); }
            //wait for panel2 to adjust size before letting the table fit the size of it
            $('#MarkupButton').click();
            setTimeout(function() {
                $('table[id^="table"]').css({ 'max-width': $('#panel2').outerWidth() + 'px', width: '100%', overflow: 'auto', display: 'table' });
                $('#Json_formatt').css({ 'max-width': $('#panel2').outerWidth() + 'px', overflow: 'auto' });
                $('.col-md-6').css({ 'width': '100%', 'overflow': 'unset' });
                $('#overflow_table').css({ 'overflow': 'auto' });
                $('#MarkupButton').click();
            }, waitForPanel);

            $('#panel2').show();
            words = filterSelectedSentence(sentence);
            //if table is new create a table, else load the old table. 
            var previouslyStored = false;
            var tempId = idTable.replace("table", "");

             const promise = new Promise((resolve, reject) => {
                setDataForCurrentClause(selectedSentenceId);
                setTimeout(() => {
                    resolve();
                

            for (x in tablesStored) {
                if (tablesStored[x].id == '' ) {
                    previouslyStored = true;
                    //loadTable(tablesStored[x], TSTstored[x]);

                    //If caption is stored, change it to this value, else default to ''
                    for (z in Solution) {
                        if (Solution[z].Answers.ClauseNumber == tempId) {
                            //If root node is stored, change it to this value, else default to 'Clause'
                            if (Solution[x].Answers.Clause_Type)
                                document.getElementById("newRootValue").value = Solution[x].Answers.Clause_Type;
                            else
                                document.getElementById("newRootValue").value = 'Clause';
                            if (Solution[z].Answers.Caption)
                                document.getElementById("newCaptionValue").value = Solution[z].Answers.Caption;
                            else
                                document.getElementById("newCaptionValue").value = '';
                        }
                    }


                    for (y in TSTstored) {

                        if (TSTstored[y].id == '') {
                            loadTable(tablesStored[x], TSTstored[y])
                            break
                        }
                    }
                }
            }
        }, 300);
    }); 

            //if not stored before create new table
            if (previouslyStored == false) {
                changeTableId(idTable);
                // words is all words in sentence but all numbers and any spaces at the begining is filtered out
                generateOneStrandTable(words, currentOneStrandTable);
                getCurrentClauseMarking();
                generateThreeStrandTable(words, currentThreeStrandTable, CurrentClause);
                $('#' + currentOneStrandTable).tableCellsSelection();
                $('#' + currentThreeStrandTable).tableCellsSelection();

                $('.deleteRowButton').click(function() {
                    deleteRow();
                })

                //ensure the root clause is set to 'Clause' by default
                document.getElementById("newRootValue").value = 'Clause'

                //ensure the caption is set to '' by default
                document.getElementById("newCaptionValue").value = ''
            }

            //addUnderlines(); //created to underline any anaylsed clauses
            predict();
            initialiseJSONDownload();
            undoOneStrandStack = [];
            undoOneStrandStack.push(document.getElementById(currentOneStrandTable).innerHTML);
            undoThreeStrandStack = [];
            undoThreeStrandStack.push(document.getElementById(currentOneStrandTable).innerHTML);
            compareTreeActivate = false;
            //if table filled before, load it
        }

    });
});

function changeTableId(idTable) {
    document.getElementById(currentOneStrandTable).id = idTable;
    currentOneStrandTable = idTable;
    TSAid = 'threeStrandTable' + idTable.replace('table', '');
    document.getElementById(currentThreeStrandTable).id = TSAid;
    currentThreeStrandTable = TSAid;
}

//highlight table cells
jQuery(document).ready(function($) {
    $('table[id^="table"],table[id^="threeStrandTable"]').tableCellsSelection();
});

//display side nav bar, if instructions are shown, don't hide the side bar
$(document).on("mousemove", function(event) {
    if (event.pageX <= 10) {
        $('#sideNav').css({ 'top': event.pageY - 30 }).slideDown();
    } else if (event.pageX > 120 && $('#Instructions').is(":hidden")) {
        $('#sideNav').slideUp();
    }
});
// activate or deactivate underline function
$('#underlineButton').click(function() {
    if (underlineActive == false) {
        underlineActive = true;
        addUnderlines();
    } else {
        underlineActive = false;
    }
});


function loadTable(OST, TST) {
    loadOneStrandTable(OST);
    loadThreeStrandTable(TST);

    $('.deleteRowButton').click(function() {
        console.log("delete")
        deleteRow();
    })

}

/*
The table tools are always visable now


// button placing and display
//when user hovers over the table, show menu
$("table[id^='table'], table[id^='threeStrandTable'],#addRowButton, #save, #undoButton, #gradeSFG, #switchStrand, #TypeOfStrand").hover(function () {
  $("#addRowButton, #undoButton, #overflow_table, #gradeSFG,#save, #switchStrand, #TypeOfStrand").show();
  //if assignment is already submitted, prevent them from saving
  if (user.role == 'Student' && Attempt[0] != null && Attempt[0].Finished || user.role == 'Teacher' && assignment.Complete == 'true' && !isEditing) {
    $('#save').hide()
  }
});
$("body, #sentence2, #CurrentUser, .btn-group").hover(function () {
  $('#addRowButton, #save, #undoButton, #gradeSFG, #switchStrand, #TypeOfStrand').hide();
});
*/


//display; mergebutton when hovering over selected fields
$(document).on('mouseenter', '.tcs-selected', function(event) {
    event.stopPropagation();
    console.log($('#' + currentOneStrandTable).tableCellsSelection('selectedCells').length)
    if ($('#' + currentThreeStrandTable).tableCellsSelection('selectedCells').length > 1 || $('#' + currentOneStrandTable).tableCellsSelection('selectedCells').length > 1) {
        var bodyOffsets = document.getElementById('panel2').getBoundingClientRect();
        $("#unMergeButton").hide();
        $("#mergeButton").css({ 'position': 'absolute', 'top': (event.pageY - bodyOffsets.top - $(document).scrollTop()) + 'px', 'left': (event.pageX - bodyOffsets.left + 35) + 'px' }).show();
    }
})

$(document).on('mouseup', '.tcs-selected', function(event) {
    event.stopPropagation();
    var bodyOffsets = document.getElementById('panel2').getBoundingClientRect();


    if ($('#' + currentThreeStrandTable).tableCellsSelection('selectedCells').length == 1 || $('#' + currentOneStrandTable).tableCellsSelection('selectedCells').length == 1) {

        var $highlightedCells = []
        if ($('#' + currentThreeStrandTable).tableCellsSelection('selectedCells').length == 1) {
            $highlightedCells = $('#' + currentThreeStrandTable).tableCellsSelection('selectedCells');
        }

        if ($('#' + currentOneStrandTable).tableCellsSelection('selectedCells').length == 1) {
            $highlightedCells = $('#' + currentOneStrandTable).tableCellsSelection('selectedCells');
        }

        if ($highlightedCells[0].colSpan > 1) {
            $("#mergeButton").hide();
            $("#unMergeButton").css({ 'position': 'absolute', 'top': (event.pageY - bodyOffsets.top - $(document).scrollTop()) + 'px', 'left': (event.pageX - bodyOffsets.left + 35) + 'px' }).show();
        } else {
            $("#unMergeButton").hide();
        }
    }
});

//hide merge button when clicking outside table.
$(document).ready(function() {
    //need a better clickoutside plugin so that it can select the two tables, not the area of tables
    $('#overflow_table').bind('clickoutside', function(event) {
        $('#mergeButton').hide();
        $('#unMergeButton').hide();
    });

    $("#tableButtons").click(function() {
        $('#mergeButton, #unMergeButton').hide();
    });

    $('putcontentshere[id^=flip], #panel').hover(function() {
            $('#panel').show();
        },
        function() {
            $('#panel').hide()
        });


});

function filterSelectedSentence(sentence) {
    var temp = sentence;

    if (sentence.charAt(0) == ' ') { temp = sentence.replace(' ', ''); }
    temp = sentence.replace(/\([0-9][0-9]*[0-9]*[0-9]*[0-9]*\)\s*/gi, ''); // replace all number things
    temp = temp.replace(new RegExp('<span class="subscript"></span>', "g"), '');
    if (temp.charAt(0) == ' ') { temp = temp.replace(' ', ''); }
    temp = temp.replace(/<span class="(ULtwo)">/g, "");
    //(.*)<\/span>/
    temp = temp.replace(/<\/span>/g, "");
    temp = temp.replace(/ {1,}/g, " ")
    words = temp.split(" ");
    if (words[words.length - 1] == '') { words.pop(); }
    return words;
}

function mergeSelectedCells() {
    $('#mergeButton').hide();
    $('#unMergeButton').hide();
    if (isCurrentTableThreeStrand) {
        recordChangeToTable(document.getElementById(currentThreeStrandTable).innerHTML);
        var $selectedCells = $('#' + currentThreeStrandTable).tableCellsSelection('selectedCells');
        var table = document.getElementById(currentThreeStrandTable).innerHTML;
        var entry = 'TSAEntry';
    } else {
        recordChangeToTable(document.getElementById(currentOneStrandTable).innerHTML);
        var $selectedCells = $('#' + currentOneStrandTable).tableCellsSelection('selectedCells');
        var table = document.getElementById(currentOneStrandTable).innerHTML;
        var entry = 'tableEntry';
    }
    var cellsToMerge = [];
    var rowToMerge = $selectedCells[0].id.replace(new RegExp(entry, "g"), ""); //(here)
    rowToMerge = rowToMerge.substring(0, rowToMerge.indexOf(','));
    //puts all cells into the array and ensures it is not the first editable row and all selected are of the same row
    for (var i = 0; i < $selectedCells.length; i++) {
        var tableId = $selectedCells[i].id.replace(new RegExp(entry, "g"), "");
        tableId = tableId.substring(0, tableId.indexOf(','));
        if (tableId == rowToMerge && $selectedCells[i].html != deleteButtonHtml || $selectedCells[i].html != deleteButtonHtmlInDB) {
            cellsToMerge.push($selectedCells[i]);
        }
    }
    //merge all cells in the array
    var numOfCells = 0;
    for (var i = 0; i < cellsToMerge.length; i++) {
        numOfCells += cellsToMerge[i].colSpan;
    }
    var firstCellColumn = parseInt($selectedCells[0].id.replace(new RegExp(entry + rowToMerge + ",", "g"), ""));
    var lastColumn = parseInt($selectedCells[$selectedCells.length - 1].id.replace(new RegExp(entry + rowToMerge + ",", "g"), ""));
    table = table.replace(new RegExp('<td id="' + entry + rowToMerge + ',' + firstCellColumn + '"(.*)<td id="' + entry + rowToMerge + ',' + (lastColumn) + '" (colspan=\d)*', "g"), '<td id="' + entry + rowToMerge + ',' + firstCellColumn + '" colspan="' + (numOfCells) + '"');

    if (isCurrentTableThreeStrand) {
        document.getElementById(currentThreeStrandTable).innerHTML = table;
    } else {
        document.getElementById(currentOneStrandTable).innerHTML = table;
    }
    predict();
    $('table[id^="table"]').tableCellsSelection();
    $('table[id^="threeStrandTable"]').tableCellsSelection();
}
//Unmerge selected cells
function unMergeSelectedCells() {
    $('#mergeButton').hide();
    $('#unMergeButton').hide();
    if (isCurrentTableThreeStrand) {
        recordChangeToTable(document.getElementById(currentThreeStrandTable).innerHTML);
        var $selectedCells = $('#' + currentThreeStrandTable).tableCellsSelection('selectedCells');
        var entry = 'TSAEntry';
        var table = document.getElementById(currentThreeStrandTable).innerHTML;
    } else {
        recordChangeToTable(document.getElementById(currentOneStrandTable).innerHTML);
        var $selectedCells = $('#' + currentOneStrandTable).tableCellsSelection('selectedCells');
        var entry = 'tableEntry';
        var table = document.getElementById(currentOneStrandTable).innerHTML;
    }

    //make many cells with colspan of 1 from the selected cell
    var lengthOfCell = $selectedCells[0].colSpan;
    var tableId = $selectedCells[0].id.replace(new RegExp(entry, "g"), "");
    var tableId = tableId.substring(0, tableId.indexOf(','));
    var rowToUnMerge = $selectedCells[0].id.replace(new RegExp(entry, "g"), ""); //(here)
    rowToUnMerge = rowToUnMerge.substring(0, rowToUnMerge.indexOf(','));
    var firstCellColumn = parseInt($selectedCells[0].id.replace(new RegExp(entry + rowToUnMerge + ",", "g"), ""));
    var newCells = '';
    for (var x = 0; x < lengthOfCell; x++) {
        if (tableId == rowToUnMerge && $selectedCells[0].html != deleteButtonHtml || $selectedCells[i].html != deleteButtonHtmlInDB) {
            newCells += '<td id="' + entry + rowToUnMerge + ',' + (firstCellColumn + x) + '" contenteditable="" oninput="recordChangeToTable(document.getElementById(' + table.id + ').innerHTML)"></td>';
        }
    }
    /*<td id="tableEntry0,2" style="padding: 8px;" */
    table = table.replace(new RegExp('<td id="' + entry + rowToUnMerge + ',' + firstCellColumn + '"(.*?)</td>', "g"), newCells);

    if (isCurrentTableThreeStrand) {
        document.getElementById(currentThreeStrandTable).innerHTML = table;
    } else {
        document.getElementById(currentOneStrandTable).innerHTML = table;
    }
    predict();
}
//push changes to undoStack
function recordChangeToTable(tableHTML) {
    if (!isCurrentTableThreeStrand) {
        undoOneStrandStack.push(tableHTML);
    } else {
        undoThreeStrandStack.push(tableHTML);
    }
}
//undo table operations
function undoTableOp() {
    if (undoOneStrandStack.length > 0 && !isCurrentTableThreeStrand) {
        document.getElementById(currentOneStrandTable).innerHTML = undoOneStrandStack.pop();
        $('#MarkupButton').click();
    } else if (undoThreeStrandStack.length > 0 && isCurrentTableThreeStrand) {
        document.getElementById(currentThreeStrandTable).innerHTML = undoThreeStrandStack.pop();
        $('#MarkupButton').click();
    }

}
//autocomplete 
function predict() {
    var container = document.getElementById('panel2'); //may have to change as they have num after
    //first remove all autocomplete elements currently existing
    if ($('td[id^="tableEntry"]').hasClass("ui-autocomplete-input")) {
        $('td[id^="tableEntry"]').removeClass("ui-autocomplete-input");
        $('.ui-helper-hidden-accessible').remove();
        $('ul[id^="ui-id-"]').remove();
    }
    if ($('td[id^="TSAEntry"]').hasClass("ui-autocomplete-input")) {
        $('td[id^="TSAEntry"]').removeClass("ui-autocomplete-input");
        $('.ui-helper-hidden-accessible').remove();
        $('ul[id^="ui-id-"]').remove();
    }
    //implements the autocomplete to all tables. 

    //jQuery('td[id^="tableEntry"],td[id^="TSAEntry"]').autocomplete({
    /* jQuery('td[id^="tableEntry"],td[id^="TSAEntry"]').autocomplete({
   data: {
     "--":null,
     "Carrier":null,
     "Theme":null,
     "Extent/Adjunct":null,
     "Pr:Material":null,
     "Complement":null,
     "Scope":null,
     "Cause/Adjunct":null,
     "Sensor":null,
     "Pr:Mental":null,
     "Goal":null,
     "Phenomenon":null,
     "Circ:Manner":null,
     "Circ:Cause":null,
     "&":null,
     "Circumstance":null,
     "Process":null,
     "Contingency":null,
     "Contingency":null,
     "Goal":null,
     "Actor":null,
     "Subject":null,
     "Senser":null,
     "Pr:Material":null,
     "A":null,
     "Participant":null,
     "q/PP":null,
     "cv/Ngp":null,
     "Sentence":null,
     "PP":null,
     "Pgp":null,
     "Clause":null,
     "Adjgp":null,
     "Qtgp":null,
     "GP":null,
     "Vgp":null,
     "qd":null,
     "m":null,
     "q":null,
     "P":null,
     "cv":null,
     "sc":null,
     "f":null,
     "ad":null,
     "am":null,
     "th":null,
     "po":null,
     "dd":null,
     "a":null,
     "t":null,
     "g":null,
     "F/Aux":null,
     "Aux":null,
     "E":null,
     "N":null,
     "F":null,
     

   },
   limit: 5
 })
}

var firstOrder = ["--",
"Carrier",
"Actor/Subject/Theme",
"Extent/Adjunct",
"Pr:Material",
"Scope/Complement",
"Cause/Adjunct",
"Carrier/Subject/Theme",
"Pr:Relational",
"Attribute(Location)/Complement",
"Textual Theme",
"Sensor/Subject/Theme",
"Goal", "Pr:Mental",
"Phenomenon/Complement",
"Circ:Manner",
"Circ:Cause",
"&",
"Circumstance",
"Participant",
"Process",
"Contingency",
"Contingency/Subject",
"Goal/Subject",
"Actor",
"Actor/Subject",
"Senser/Subject",
"Pr:Material/Theme",
"A",
"Particpant/Ngp",
"q/PP",
"cv/Ngp",
"Sentence"
];

var secondOrder = ["Ngp",
"PP",
"Pgp",
"Clause",
"Adjgp",
"Qtgp",
"GP",
"Vgp"
];

var thirdOrder = ["pd", "v",
"qd", 
"m", 
"q", "P",
"cv", "t",
"a", "sc",
"f", "ad",
"am", 

];*/


}