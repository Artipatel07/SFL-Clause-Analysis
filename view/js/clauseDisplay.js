
function deleteClause(groupId, clauseId) {
    $.ajax({
        type: 'DELETE',
        url: backendPort + '/clause/delete/' + groupId + '/' + clauseId,
        dataType: 'json',
        encode: true,
        beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
        success: function(data) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
        error: function(xhr, status, error) {
            console.log(status);
            console.log(error);
        }
    });
}


function Logout(groupId, clauseId) {
    $.ajax({
        type: 'get',
        url: backendPort + '/users/logout',
        dataType: 'json',
        encode: true,
        beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
        success: function(data) {
            
                window.location.href = '/views'
           
        },
        error: function(xhr, status, error) {
            console.log(status);
            console.log(error);
        }
    });
}



$(document).ready(function() {

    $('#newClause').hide();
    $('#panel2').hide();


    $('#addClause').click(function() {
        $('#newClause').slideDown();
        var height = $(document).height();
        $('#overlay').css({ 'height': height + 'px' }).show();
    });

    $('#closeNewClause').click(function() {
        $('#newClause').slideUp();
        $('#overlay').hide();
    });

    $("#newClauseForm").on('submit', function() {
        var formData = {
            createdBy: localStorage.getItem("Username"),
            clause: $('#clause').val(),
            context: $('#context').val(),
            visibility: ($('#visibility').is(':checked') ? 'private' : 'public'),
        }

        $.ajax({
            type: 'POST',
            url: backendPort + '/clause/addClause/' + groupId,
            data: formData,
            dataType: 'json',
            encode: true,
            beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
            success: function(data) {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            error: function(xhr, status, error) {
                console.log(status);
                console.log(error);
            }
        });
        event.preventDefault();
    });

    setTimeout(() => {
        $.ajax({
            type: "GET",
            url: backendPort + "/clause/getAllPub/" + groupId,
            dataType: "json",
            encode: true,
            beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
            success: function(data) {
                //<i id ="analysisShortCut" class="fa fa-pencil-square-o w3-margin-right"></i><i id ="treeShortCut" class="fa fa-tree w3-margin-right"></i><i id ="otherShortCut" class="fa fa-code w3-margin-right"></i>
                var innerhtml = `<tr><th>Tools</th><th>Clause List</th><th></th></tr>`
                for (var x = 0; x < data.length; x++) {
                    innerhtml += `<tr><td><div class="icon-preview col s1 m2" >`;
                    if (data[x].isAnswered) {
                        innerhtml += `<input id="isAnalysed` + data[x]._id + `" checked disabled="disabled" type="checkbox"/>`;
                    } else {
                        innerhtml += `<input id="isAnalysed` + data[x]._id + `" disabled="disabled" type="checkbox"/>`;
                    }
                    innerhtml += `<span id="isAnalysed" style="cursor:unset">Analysed</span></div></td><td class="clauseAlignment"><span id="flip" onclick="changeSelectedSentence(this.innerHTML, '` + data[x]._id + `', ` + data[x].isAnswered + `)">`;
                    innerhtml += data[x].clause + `</span></td><td><button class="btn btn-danger" style='display: inline-block; background-color: red' onclick="deleteClause(` + groupId + `,'` + data[x]._id + `')">`;
                    innerhtml += `<i class="material-icons">delete</i></button></td></tr>`;
                }
                document.getElementById('putcontentshere').innerHTML = innerhtml;
            },
            error: function(xhr, status, error) {
                console.log(status);
                console.log(error);
            }
        });
    }, 3000);
    var arrayOfColSpan = []; // keeps track of which cells have colspans > 1
    var cellValues = [];
    var combinedTable = document.getElementById('combinedTable');
    var table = document.getElementById(combinedTable.id);
    var rowCount = 0;
    joinStrandTables();

    // $("#save").on('click', async function() {
    //     joinStrandTables();
    //     $("table[id^='combinedTable'] tr").each(function(index) {
    //         var skip = 0;
    //         var arrayV = [];
    //         rowCount++;
    //         var colCount = 0;
    //         $cells = $(this).find("td");
    //         $cells.each(function(cellIndex) {
    //             var numOfCol = table.rows[index].cells[cellIndex].colSpan; //get the colspan of current cell 

    //             //check if < is in cell. Change it from &lt to < 
    //             arrayV[cellIndex + skip] = table.rows[index].cells[cellIndex].innerHTML.replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, '').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'");

    //             //if colspan is greater than 1, save the details in colspan array, and duplicate value n times, n being the size of colspan. 
    //             //Save it in arrayV. Basically arrayV is a clone but each cell is only 1 colspan long
    //             if (numOfCol > 1) {
    //                 var numOfCol = $(this).attr('colspan');
    //                 var colSpanDetails = { csWidth: numOfCol, idOfCell: "combinedEntry" + (index - 1) + "," + cellIndex };
    //                 arrayOfColSpan.push(colSpanDetails);
    //                 for (var i = 1; i < numOfCol; i++) {
    //                     skip++;
    //                     arrayV[cellIndex + skip] = table.rows[index].cells[cellIndex].innerHTML;
    //                 }
    //             }
    //             colCount++;
    //         });
    //         cellValues.push(arrayV);
    //     })

    //     var tableValues = { id: 0, values: [], colspanArray: [], headings: [] };
    //     tableValues.id = document.getElementById(currentOneStrandTable).id.replace('table', '');
    //     var arrayOfColSpanOST = getColSpanInfo(arrayOfColSpan, false);
    //     tableValues.colspanArray = arrayOfColSpanOST;
    //     tableValues.values = saveOSTValues(arrayOfColSpanOST);
    //     tableValues.headings = saveOSTHeadings();
    //     //check if this table has been saved before, if so delete it and make new
    //     for (x in tablesStored) {
    //         if (tablesStored[x].id == tableValues.id) {
    //             tablesStored.splice(x, 1);
    //         }
    //     }
    //     tablesStored.push(tableValues);
    //     var OSTStoredString = saveOSTTableAsString(tableValues);
    //     var TSTValues = { id: 0, values: [], colspanArray: [], headings: [] };
    //     TSTValues.id = document.getElementById(currentThreeStrandTable).id.replace('threeStrandTable', '');
    //     arrayOfColSpanTST = getColSpanInfo(arrayOfColSpan, true);
    //     TSTValues.colspanArray = arrayOfColSpanTST;
    //     TSTValues.values = saveTSTValues(arrayOfColSpanTST);
    //     TSTValues.headings = saveTSTHeadings();
    //     //check if this table has been saved before, if so delete it and make new
    //     for (x in TSTstored) {
    //         if (TSTstored[x].id == TSTValues.id) {
    //             TSTstored.splice(x, 1);
    //         }
    //     }
    //     TSTstored.push(TSTValues);
    //     var TSTStoredString = saveTSTTableAsString(TSTValues);
    //     var analysisObject = { oneStrandTable: tableValues, threeStrandTable: TSTValues, oneStrandTableString: OSTStoredString, threeStrandTableString: TSTStoredString };
    //     var answerValues = { userName: $.cookie("username"), groupID: groupId, clauseID: selectedSentenceId, analysis: JSON.stringify(analysisObject) };
    //     saveAnswers(answerValues);
    // });

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
});