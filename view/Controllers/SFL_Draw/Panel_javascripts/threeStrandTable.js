var isCurrentTableThreeStrand = false;
var currentThreeStrandTable = document.getElementById('threeStrandTable').id;
var CurrentClause = '';
var TSTstored = [];
var arrayOfColSpanTST = [];
var undoThreeStrandStack = [];

$('#switchStrand').click(function() {
    $('#mergeButton, #unMergeButton').hide();
    if (isCurrentTableThreeStrand) {
        switchToOneStrand();
        $('#TypeOfStrand').html('One Strand Analysis');
        $('#switchStrand').prop('title', 'Switch to Three Strand Analysis');
        //$('#switchStrand').attr('title', 'Switch to Three Strand Analysis');
    } else {
        switchToThreeStrand();
        $('#TypeOfStrand').html('Three Strand Analysis');
        $('#switchStrand').prop('title', 'Switch to One Strand Analysis');
        //$('#switchStrand').attr('title', 'Switch to One Strand Analysis');
    }
    //joinStrandTables();
});

function switchToThreeStrand() {
    $('#' + currentOneStrandTable).hide();
    $('#' + currentThreeStrandTable).show();
    isCurrentTableThreeStrand = true;
    if ($('#comparedTable').css('display') != 'none') {
        $('#comparedTableTST').show();
        $('#comparedTable').hide();
    }
    $("#panel2").animateAuto("both");
}

function generateThreeStrandTable(words, tableToGenerate, clause) {

    var wordsAndClause = [];
    wordsAndClause.push(clause);

    for (x = 0; x < words.length; x++) {
        wordsAndClause.push(words[x]);
    }

    var tableContent = '<tr class="input-field">';
    //set headings as the words in the sentence
    for (index = 0; index < wordsAndClause.length; index++) {
        tableContent += "<th style='text-align:center; padding: 4px;' contenteditable='" + table_heading_editable + "' >" + wordsAndClause[index] + "</th>";
    }

    tableContent += '<td></td></tr>';
    //create empty cells, one for each heading, id with row and col, first row = 0


    var threeStrands = ['Exp', 'Inter', 'Text'];

    for (row = 0; row < 3; row++) {
        tableContent += "<tr>";
        tableContent += '<td>' + threeStrands[row] + '</td>';
        for (col = 0; col < words.length; col++) {
            tableContent += "<td id = 'TSAEntry" + row + "," + col + "' style='padding: 4px;' contenteditable oninput='recordChangeToTable(document.getElementById(currentThreeStrandTable).innerHTML)'></td>";
        }
        //add a clear button to the end of the row
        tableContent += '<td>' + deleteButtonHtml + '</td></tr>';
    }

    //for both one strand and three stand, generate the table. 
    document.getElementById(tableToGenerate).innerHTML = tableContent;
}

function getCurrentClauseMarking() {
    CurrentClause = '(1)'
}


//add additional row to Three Strand table (TST), only inter row is extendable.
function addRowTST() {
    recordChangeToTable(document.getElementById(currentThreeStrandTable).innerHTML);
    var tableContent = "<tr class='input-field'>";

    //add an extra column for the TST at the beginning (words.length+1) 
    for (index = 0; index < words.length + 1; index++) {
        tableContent += "<td id = 'TSAEntry" + 1.5 + "," + index + "' contenteditable style='padding: 4px;' oninput='recordChangeToTable(document.getElementById(currentOneStrandTable).innerHTML)'></td>";
    }

    //add a clear button to the end of the row
    tableContent += '<td>' + deleteButtonHtml + '</td></tr>';
    row++;
    console.log($('#' + currentThreeStrandTable + ' tr').eq(2).html())

    $('#' + currentThreeStrandTable + ' tr').eq(2).after(tableContent);
    //predict();
    $("#panel2").animateAuto("both");

}

function deleteRowTST() {
    //another version
    $('#' + currentThreeStrandTable).on('click', 'i', function(e) {
        $(this).closest('tr').remove()
    })
}

//Determines which table to add a row
function addRow() {
    if (isCurrentTableThreeStrand) {
        addRowTST();
    } else {
        addRowOST();
    }
    deleteRow();

}


//Determines which table to delete a row
function deleteRow() {
    if (isCurrentTableThreeStrand) {
        deleteRowTST();
    } else {
        deleteRowOST();
    }
}


function saveTSTValues() {
    var array = [];
    var headers = [];

    $('table[id^="threeStrandTable"] tr').has('td').each(function(indexR) {
        arrayItem = [];
        $('td', $(this)).each(function(indexC, item) {
            if ($(item).html() != deleteButtonHtml && $(item).html() != deleteButtonHtmlInDB) {
                arrayItem[indexC] = $(item).html();
            }
        });
        array.push(arrayItem);
    });
    array.splice(0, 1); // first entry is empty because it is the header entries. 
    return array;
}

function saveTSTTableAsString(TSTValues) {
    var colSpanArray = [];
    if (TSTValues.colspanArray.length > 0) {
        for (let index = 0; index < TSTValues.colspanArray.length; index++) {
            var tempcolspanstring = TSTValues.colspanArray[index].idOfCell;
            var tempcolspanstringsplit = tempcolspanstring.split(",");
            var tempcolspanstringfinal = tempcolspanstringsplit[0] + `,` + (parseInt(tempcolspanstringsplit[1]) + 1);
            tempcolspanstringfinal += `,` + TSTValues.colspanArray[index].csWidth + ``;
            colSpanArray.push(tempcolspanstringfinal);
        }
    }
    var tableString = `<!DOCTYPE html><html><head><style>table {  font-family: arial, sans-serif;  border-collapse: collapse;  width: 100%;`;
    tableString += `}td, th {  border: 1px solid black;  text-align: left;  padding: 8px;}tr:nth-child(even) {  background-color: #dddddd;}</style>`;
    tableString += `</head><body>`;
    tableString += `<table id='threeStrandedTable'>`;
    if (TSTValues.headings.length > 0) {
        tableString += `<tr>`;
        for (let index = 0; index < TSTValues.headings.length; index++) {
            tableString += `<th>` + TSTValues.headings[index] + `</th>`;
        }
        tableString += `</tr>`;
    }
    if (TSTValues.values.length > 0) {
        for (let outIndex = 0; outIndex < TSTValues.values.length; outIndex++) {
            tableString += `<tr>`;
            for (let index = 0; index < TSTValues.values[outIndex].length; index++) {
                var findString = "TSAEntry" + outIndex + "," + index;
                var elem = colSpanArray.find(a => a.includes(findString));
                if (elem != undefined) {
                    elem = elem.replace(findString + `,`, '');
                    tableString += `<td colspan="` + elem + `">` + TSTValues.values[outIndex][index] + `</td>`;
                } else {
                    tableString += `<td>` + TSTValues.values[outIndex][index] + `</td>`;
                }
            }
            tableString += `</tr>`;
        }
    }
    tableString += `</table>`;
    tableString += `</body></html>`;
    return tableString;
}

function saveTSTHeadings() {
    var headings = [];

    $("table[id^='threeStrandTable'] tr th").each(function() {
        headings.push(($(this).text()).replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'"));
    });

    return headings;
}

//load table that has been filled in before
function loadThreeStrandTable(tableToLoad) {
    ///console.log(tableToLoad);
    changeTableId("table" + tableToLoad.id);
    //add the headings
    var tableContent = '<tr class="input-field">';
    for (index = 0; index < tableToLoad.headings.length; index++) {
        tableContent += "<th style='text-align:center; padding: 4px;' contenteditable='" + table_heading_editable + "'>" + tableToLoad.headings[index] + "</th>";
    }
    tableContent += '<td></td></tr>';
    //add the appropriate number of rows and cols to the table
    for (x in tableToLoad.values) {
        tableContent += "<tr class='input-field'>";
        for (col = 0; col < tableToLoad.values[x].length; col++) {
            if (col == 0) {
                tableContent += "<td>" + tableToLoad.values[x][col] + "</td>";
            } else {
                tableContent += "<td id = 'TSAEntry" + x + "," + (col - 1) + "' style='padding: 4px;' contenteditable></td>";
            }
        }
        //add a clear button to the end of the row
        tableContent += '<td>' + deleteButtonHtml + '</td></tr>';
    }

    document.getElementById(currentThreeStrandTable).innerHTML = tableContent;
    //add the colspan
    for (x in tableToLoad.colspanArray) {
        document.getElementById(tableToLoad.colspanArray[x].idOfCell).colSpan = tableToLoad.colspanArray[x].csWidth;
    }
    //load values into these cells
    for (x in tableToLoad.values) {
        for (var y = 0; y < tableToLoad.values[x].length - 1; y++) {
            document.getElementById('TSAEntry' + x + ',' + y).innerHTML = tableToLoad.values[x][y + 1];
        }
    }
    //this is now the last state in the undo stack
    undoOneStrandStack[0] = document.getElementById(currentThreeStrandTable).innerHTML;
}