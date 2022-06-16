var tablesStored = []; //array that stores all table values, colspans and id's
var currentOneStrandTable = document.getElementById('tableId').id; //for some reason it hates it when jquery is used to find an element by id
var undoOneStrandStack = []; // for storing states of tables so user can undo. resets when another sentence clicked. 

function switchToOneStrand() {
    $('#' + currentOneStrandTable).show();
    $('#' + currentThreeStrandTable).hide();
    isCurrentTableThreeStrand = false;
    if ($('#comparedTableTST').css('display') != 'none') {
        $('#comparedTableTST').hide();
        $('#comparedTable').show();
    }
    $("#panel2").animateAuto("both");
}

function saveOSTTableAsString(OSTValues) {
    var colSpanArray = [];
    if (OSTValues.colspanArray.length > 0) {
        for (let index = 0; index < OSTValues.colspanArray.length; index++) {
            var tempcolspanstring = OSTValues.colspanArray[index].idOfCell;
            tempcolspanstring.replace(" ", "");
            tempcolspanstring += `,` + OSTValues.colspanArray[index].csWidth + ``;
            colSpanArray.push(tempcolspanstring);
        }
    }


    var tableString = `<!DOCTYPE html><html><head><style>table {  font-family: arial, sans-serif;  border-collapse: collapse;  width: 100%;`;
    tableString += `}td, th {  border: 1px solid black;  text-align: left;  padding: 8px;}tr:nth-child(even) {  background-color: #dddddd;}</style>`;
    tableString += `</head><body>`;
    tableString += `<table id='oneStrandedTable'>`;
    if (OSTValues.headings.length > 0) {
        tableString += `<tr>`;
        for (let index = 0; index < OSTValues.headings.length; index++) {
            tableString += `<th>` + OSTValues.headings[index] + `</th>`;
        }
        tableString += `</tr>`;
    }
    if (OSTValues.values.length > 0) {
        for (let outIndex = 0; outIndex < OSTValues.values.length; outIndex++) {
            tableString += `<tr>`;
            for (let index = 0; index < OSTValues.values[outIndex].length; index++) {
                var findString = "tableEntry" + outIndex + "," + index;
                var elem = colSpanArray.find(a => a.includes(findString));
                if (elem != undefined) {
                    elem = elem.replace(findString + `,`, '');
                    tableString += `<td colspan="` + elem + `">` + OSTValues.values[outIndex][index] + `</td>`;
                } else {
                    tableString += `<td>` + OSTValues.values[outIndex][index] + `</td>`;
                }
            }
            tableString += `</tr>`;
        }
    }
    tableString += `</table>`;
    tableString += `</body></html>`;

    return tableString;
}

function saveOSTValues() {
    var array = [];
    var headers = [];

    $('table[id^="table"] tr').has('td').each(function(indexR) {
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

function saveOSTHeadings() {
    var headings = [];

    $("table[id^='table'] tr th").each(function() {
        headings.push(($(this).text()).replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, '').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'"));
    });

    return headings;
}

function generateOneStrandTable(words, tableToGenerate) {
    //recordChangeToTable(document.getElementById(currentOneStrandTable).innerHTML)
    //set id of table from the span id
    var tableContent = '<tr class="input-field" >';
    //set headings as the words in the sentence
    for (index = 0; index < words.length; index++) {
        tableContent += "<th style='text-align:center; padding: 1px;' contenteditable>" + words[index] + "</th>";
    }

    tableContent += '<td></td></tr>';
    //create empty cells, one for each heading, id with row and col, first row = 0
    tableContent += "<tr class='input-field'>";

    for (col = 0; col < words.length; col++) {
        tableContent += "<td id = 'tableEntry" + 0 + "," + col + "' style='padding: 1px;' contenteditable oninput='recordChangeToTable(document.getElementById(currentOneStrandTable).innerHTML)'></td>";
    }

    //add a clear button to the end of the row
    tableContent += '<td>' + deleteButtonHtml + '</td></tr>';

    document.getElementById(tableToGenerate).innerHTML = tableContent;
    //$('table[id^="table"]').tableCellsSelection();
}

//add additional row to One Strand table (OST)
function addRowOST() {
    recordChangeToTable(document.getElementById(currentOneStrandTable).innerHTML);
    var rowNum = document.getElementById(currentOneStrandTable).getElementsByTagName("tbody")[0].getElementsByTagName("tr").length - 1;
    var tableContent = "<tr>";
    for (index = 0; index < words.length; index++) {
        tableContent += "<td id = 'tableEntry" + rowNum + "," + index + "' contenteditable style='padding: 1px;' oninput='recordChangeToTable(document.getElementById(currentOneStrandTable).innerHTML)'></td>";
    }
    //add a clear button to the end of the row
    tableContent += '<td>' + deleteButtonHtml + '</td></tr>';
    document.getElementById(currentOneStrandTable).getElementsByTagName("tbody")[0].innerHTML += tableContent
    predict();
    $('#MarkupButton').click();
}

function deleteRowOST() {
    //another version
    $('#' + currentOneStrandTable).on('click', 'i', function(e) {
        $(this).closest('tr').remove()
    })
}

//load table that has been filled in before
function loadOneStrandTable(tableToLoad) {
    //console.log(tableToLoad);
    changeTableId("table" + tableToLoad.id);
    //add the headings
    var tableContent = '<tr class="input-field">';
    for (index = 0; index < tableToLoad.headings.length; index++) {
        tableContent += "<th style='text-align:center; padding: 1px;' contenteditable='" + table_heading_editable + "' >" + tableToLoad.headings[index] + "</th>";
    }
    tableContent += '<td></td></tr>';
    //add the appropriate number of rows and cols to the table
    for (x in tableToLoad.values) {
        tableContent += "<tr class='input-field'>";
        for (col = 0; col < tableToLoad.values[x].length; col++) {
            tableContent += "<td id = 'tableEntry" + x + "," + col + "' style='padding: 1px;' contenteditable></td>";
        }
        //add a clear button to the end of the row
        tableContent += '<td>' + deleteButtonHtml + '</td></tr>';
    }
    document.getElementById(currentOneStrandTable).innerHTML = tableContent;
    //add the colspan
    for (x in tableToLoad.colspanArray) {
        document.getElementById(tableToLoad.colspanArray[x].idOfCell).colSpan = tableToLoad.colspanArray[x].csWidth;
    }
    //load values into these cells
    for (x in tableToLoad.values) {
        for (var y = 0; y < tableToLoad.values[x].length; y++) {
            document.getElementById('tableEntry' + x + ',' + y).innerHTML = tableToLoad.values[x][y];
        }
    }
    //this is now the last state in the undo stack
    undoOneStrandStack[0] = document.getElementById(currentOneStrandTable).innerHTML;
}