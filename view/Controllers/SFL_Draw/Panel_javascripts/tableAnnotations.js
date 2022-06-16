/*
This file contains functions that help convert the table entries to the form of 
annotations. 
It has 	a quick-sort algorithm, 
	   	a matrix transpose function
	   	a function for saving the entries as annotations,
	   	a function for sorting the texts so that the text taking up the largest colspan goes first
	and a function to group any texts that are identical called evaluate
 */
var isOneStrandEntryArray = []; // true for its a one strand entry, false for three strand
var combinedTable = document.getElementById('combinedTable');
function addAnnotation() {

  //set up annotation object, it has 9 fields
  var annotation2 = {
    id: '' + currentOneStrandTable.replace("table", ""),
    quote: "",
    ranges: [[]],
    text: '["",""]',
    url: 1
  }
  annotation2.ranges[0].start = "/[p1]";
  annotation2.ranges[0].end = "/[p1]";
  annotation2.ranges[0].startOffset = nextWordStartIndex;
  annotation2.ranges[0].endOffset = annotation2.ranges[0].startOffset + annotation2.quote.length;

  // Checks if there is a root node set, default is Clause
  let rootNode = document.getElementById('newRootValue').value;

  if(rootNode)
    annotation2.text = '["","'+rootNode+'"]'; 
  else
    annotation2.text = '["","Clause"]'; //default

  //saves the sentence/clause that the user selected temperarly for a tree to be produced from it
  // saveAnnotation function in vender/annotation_functions

  annotation2.ranges[0].start = "/[p" + document.getElementById(currentOneStrandTable).id.replace("table", "") + "]";
  annotation2.ranges[0].end = "/[p" + document.getElementById(currentOneStrandTable).id.replace("table", "") + "]";
  annotation2.ranges[0].endOffset = document.getElementById('sentence2').innerHTML.length + nextWordStartIndex;
  annotation2.ranges[0].startOffset = nextWordStartIndex;
  annotation2.quote = document.getElementById('sentence2').innerHTML;
  annotation2.quote = annotation2.quote.replace(/<span class="ULtwo">/g, ""); //get rid of underlines
  annotation2.quote = annotation2.quote.replace(/<\/span>/g, "").replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'");
  console.log(annotation2)
  saveAnnotation(annotation2);

  //combine OST and TST table

  joinStrandTables();
  //Makes each cell entry an annotation object and saves it  
  var tempStart = nextWordStartIndex;
  var arrayOfColSpan = []; // keeps track of which cells have colspans > 1
  var $headers = $("table[id^='combinedTable'] th");
  var cellValues = [];
  var table = document.getElementById(combinedTable.id);
  var rowCount = 0;
  var colCount = 0;
  evalIndex = 0;
  numOfRowsOST = document.getElementById(currentOneStrandTable).rows.length - 1;
  //gets the colspan of each cell and saves the info in arrayOfColSpan
  $("table[id^='combinedTable'] tbody tr").each(function (index) {
    var skip = 0;
    var arrayV = [];
    rowCount++;
    $cells = $(this).find("td");
    $cells.each(function (cellIndex) {
      var numOfCol = table.rows[index].cells[cellIndex].colSpan;//get the colspan of current cell 

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
  });
  colCount = $headers.length;

  //for each coloumn in table, annotated

  for (var x = 0; x < colCount; x++) {
    nextWordStartIndex = tempStart;
    var idOfAnno = combinedTable.id.replace("combinedTable", "");
    annotation2.id = idOfAnno + "," + x;
    annotation2.text = '[""]';
    annotation2.quote = $headers[x].innerHTML.replace(/<\/span>/g, "").replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'");
    annotation2.ranges[0].startOffset = nextWordStartIndex;
    nextWordStartIndex++;//for spaces
    annotation2.ranges[0].endOffset = annotation2.ranges[0].startOffset + annotation2.quote.replace(/<\/span>/g, "").replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'").length;
    nextWordStartIndex += annotation2.quote.replace(/<\/span>/g, "").replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'").length;
    var strand = []
    for (var y = rowCount - 1; y > 0; y--) {
      cellValues[y][x] = filterHTML(cellValues[y][x])
      if (cellValues[y][x] != "") {
        annotation2.text = annotation2.text.replace("]", ',"' + cellValues[y][x] + '"]');
        if (y <= numOfRowsOST) {
          strand.push(true)
        }
        else {
          strand.push(false)
        }
      }
    }
    if (annotation2.text != '[""]') {
      arrayOfAnnotations(annotation2, strand);
    }
  }

  evaluateAnnotations(); //group annoations with same text

  /* Now setup everything again and save table values in array which will be stored in DB */
  setUp();

  //save the table values of the current OST table
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

  //save the table values of the current TST table
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
  //console.log(TSTstored);
  addUnderlines();//to all annotated elements, this func is on editorcreator.js
}



//if any text has identical text, group together. example a process can be made of many words

function arrayOfAnnotations(annotation, osa) {
  copyOfAnno = JSON.parse(JSON.stringify(annotation))
  copyOfOSE = JSON.parse(JSON.stringify(osa))
  annotationToEvaluate.push(copyOfAnno);
  isOneStrandEntryArray.push(copyOfOSE)
  //console.log(annotationToEvaluate)
  var missedValues = {
    endOffset: annotation.ranges[0].endOffset,
    startOffset: annotation.ranges[0].startOffset,
    start: annotation.ranges[0].start,
    end: annotation.ranges[0].end
  };
  annotationToEvaluate[evalIndex].ranges[0] = (missedValues);
  evalIndex++;
  //console.log(annotationToEvaluate)
}

function evaluateAnnotations() {
  // console.log(annotationToEvaluate)
  var x = 0; next = 1;
  sortText(); //sorts text to be in the correct order for annotations
  while (x < annotationToEvaluate.length) {
    while (next < annotationToEvaluate.length) {
      //if the next ann.text is the same as current, group them, repeat 
      if (annotationToEvaluate[x].text == annotationToEvaluate[next].text) {
        //join quotes and end offsets
        annotationToEvaluate[x].quote += " " + annotationToEvaluate[next].quote.replace(/<\/span>/g, "").replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'");
        annotationToEvaluate[x].ranges[0].endOffset += annotationToEvaluate[next].quote.replace(/<\/span>/g, "").replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'").length;
        annotationToEvaluate.splice(next, 1);//remove y from array
      }
      else {
        break;
      }
    }
    x++;
    next = x + 1;
  }
  for (anno in annotationToEvaluate) {
    //console.log(annotationToEvaluate[anno]);
    saveAnnotation(annotationToEvaluate[anno]);
  }
  annotationToEvaluate = []; // reset annotations to evalutate
}

function sortText() {
  //sorts text in accordance to the colspan of each table cell
  //bigger the colspan, the earlier that entry is in the text. eg colspan=1,"th", colspan = 5,"dd", text = ["dd","th"]
  //build array of colspans where there is cell values, if no values then default to 0
  var arrayOfColSpan = [];
  finalArrText = [];
  finalColspan = [];
  finalisOneStrandEntry = []
  var $rows = $("table[id^='combinedTable'] tbody tr").each(function (index) {
    var rowCs = [];
    $cells = $(this).find("td");
    skip = 0
    // make array that is a row X col, that stores the colspan length at that cell
    $cells.each(function (cellIndex) {
      var valueAtThisCell = document.getElementById(combinedTable.id).rows[index].cells[cellIndex].innerHTML;
      if (valueAtThisCell != '') {
        rowCs.push(document.getElementById(combinedTable.id).rows[index].cells[cellIndex].colSpan);
        if (rowCs[rowCs.length - 1] > 1) {
          var n = rowCs[rowCs.length - 1];
          //if colspan len is greater than n<1 copy the len n times
          for (var i = 1; i < n; i++) {
            rowCs.push(n);
          }
        }
      }
      else {
        rowCs.push(0); // if no text push 0
      }
    });
    arrayOfColSpan.push(rowCs);
  });
  arrayOfColSpan.splice(0, 1);
  var transposeCsArr = transpose(arrayOfColSpan);
  //For each annotation stored for current table, order the texts
  for (x in annotationToEvaluate) {
    var column = parseInt(annotationToEvaluate[x].id.substring(annotationToEvaluate[x].id.indexOf(",") + 1, annotationToEvaluate[x].id.length));
    var text = annotationToEvaluate[x].text.replace('[', '').replace(']', '').replace(/"/g, '');
    text = text.replace(/&lt;/g, '<');
    var arrText = text.split(",");
    arrText.splice(0, 1);
    console.log(arrText)
    //remove 0's, and store in array called filter
    var filtered = transposeCsArr[column].filter(function (element) {
      return element != 0;
    });
    arrText.reverse();
    quickSort(filtered, 0, filtered.length - 1, arrText, x); // sort colspan lengths with corrosponding texts
    arrText = arrText.reverse();
    finalArrText.push(arrText);
    finalColspan.push(filtered.reverse());

  }
  finalArrText = combineAtNode(finalArrText, finalColspan);

  for (x in annotationToEvaluate) {
    annotationToEvaluate[x].text = '[""]'
    var text = ''
    for (word in finalArrText[x]) {
      annotationToEvaluate[x].text = annotationToEvaluate[x].text.replace(']', ',"' + finalArrText[x][word] + '"]');
    }
  }
}


function transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) { return r[c]; });
  });
}
function quickSort(arr, left, right, arrText, ind) {
  var len = arr.length,
    pivot,
    partitionIndex;


  if (left < right) {
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right, arrText, ind);

    //sort left and right
    quickSort(arr, left, partitionIndex - 1, arrText, ind);
    quickSort(arr, partitionIndex + 1, right, arrText, ind);
  }
  return arr;
}
function partition(arr, pivot, left, right, arrText, ind) {
  var pivotValue = arr[pivot],
    partitionIndex = left;

  for (var i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      swap(arr, i, partitionIndex, arrText, ind);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex, arrText, ind);
  return partitionIndex;
}

function swap(arr, i, j, arrText, ind) {
  var temp = arr[i];
  var temp2 = arrText[i];

  isOneStrandEntryArray[ind] = isOneStrandEntryArray[ind].reverse();
  var temp3 = isOneStrandEntryArray[ind][i];
  arr[i] = arr[j];
  arrText[i] = arrText[j];
  isOneStrandEntryArray[ind][i] = isOneStrandEntryArray[ind][j]
  arr[j] = temp;
  arrText[j] = temp2;
  isOneStrandEntryArray[ind][j] = temp3;

  isOneStrandEntryArray[ind] = isOneStrandEntryArray[ind].reverse();
}

var finalArrText = [];
var finalColspan = [];
/* if colspans equal under the same headings then they should join at one node in the tree. */
function combineAtNode(arrOfText, colspaninfo) {
  numOfRowsOST = document.getElementById(currentOneStrandTable).rows.length - 1; //num of rows in one strand table excluding headings
  var skip = 0;
  //for all colspan array infomation (which contains the colspan of each entry in each column)

  for (y in colspaninfo) {
    //and checking each colspan of each entry in the coloumn
    for (a = 0; a < colspaninfo[y].length; a++) {
      // if the entry below has the same colspan length ( say length of n)
      if (colspaninfo[y][a] == colspaninfo[y][a + 1]) {
        // the annotations are sorted already. Entries with longest colspan come first in the annotation.text field 
        // so they appear on top of the tree hierarchy.
        // we need to check if annotations should combine. They should combine if there are two annotations
        // with the same colspan length under the same headings of the table.
        // so we checked they have the same length, so we now check if they are under the same heading.
        // We only need to check if (current entry) to (current entry +n) have the same heading. If so join.
        // Note since they are alread sorted, we just check the next annotation to the current. 
        var lastarrayInFuture = parseInt(y) + parseInt(colspaninfo[y][a]);  // current + n
        var txt1 = arrOfText[y][a]; // get the text of current entry
        var txt2 = arrOfText[y][a + 1]; //get text of entry we are looking at
        var hasAltered = false;

        for (arrayInFuture = parseInt(y) + 1; arrayInFuture < lastarrayInFuture; arrayInFuture++) {
          if (arrOfText[arrayInFuture] != null) {
            for (i = 0; i < arrOfText[arrayInFuture].length; i++) {
              if (arrOfText[arrayInFuture][i] == txt1) {
                for (j = 0; j < arrOfText[arrayInFuture].length; j++) {
                  if (arrOfText[arrayInFuture][j] == txt2) {
                    if (isOneStrandEntryArray[arrayInFuture][j] == false) {//if future annotation is a three strand analysis annoation, join them with '|'
                      //join txt and set the colspan.  txt of future to be blank and 0
                      if (!hasAltered) {
                        arrOfText[y][a] += "|" + arrOfText[arrayInFuture][j];
                        arrOfText[y].splice(a + 1, 1);
                        colspaninfo[y].splice(a + 1, 1);
                        hasAltered = true;
                      }

                      arrOfText[arrayInFuture][i] += "|" + arrOfText[arrayInFuture][j];
                      arrOfText[arrayInFuture].splice(j, 1);
                      colspaninfo[arrayInFuture].splice(j, 1);
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(arrOfText);
  return arrOfText;
}
/*for annotation, join both the one strand and three stand tables. 
  the values of the TST will be added at the end of the one strand
  The annotations will be made from this brand new table so that the tree is made. 
*/

function joinStrandTables() {
  isOneStrandEntryArray = [];
  var joinedTable = document.getElementById(currentOneStrandTable).cloneNode(true);
  var tst = document.getElementById(currentThreeStrandTable).cloneNode(true);
  combinedTable.innerHTML = joinedTable.innerHTML;
  //remove heading

  rowNum = tst.rows.length - 1;
  for (var j = 0; j < rowNum; j++) {
    tst.rows[1].deleteCell(0);//remove first column
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

// isThreeStrand is a boolean, true if looking for TST colspan info
function getColSpanInfo(arrayOfColSpan, isThreeStrand) {

  var lenOST = $('table[id^="table"] tr').length - 1; //minus the heading row
  var colspanInfo = [];
  var index = 0;

  //arrayOfColSpan id is combinedEntryN,M. So if N is 0-num of rows in OST, its OST info, else TST info
  //console.log(arrayOfColSpan);


  for (x = 0; x < arrayOfColSpan.length; x++) {

    var n = arrayOfColSpan[x].idOfCell.replace('combinedEntry', '');
    n = n.substring(0, n.indexOf(','));
    //console.log("This is the id row: "+ n );
    if ((!isThreeStrand) && n < lenOST) {
      colspanInfo[index] = arrayOfColSpan[x];
      colspanInfo[index].idOfCell = colspanInfo[index].idOfCell.replace('combinedEntry', 'tableEntry')
      index++;
    }

    else if (isThreeStrand && n >= lenOST) {
      colspanInfo[index] = arrayOfColSpan[x];
      colspanInfo[index].idOfCell = colspanInfo[index].idOfCell.replace('combinedEntry', 'TSAEntry')
      correctRow = parseInt(colspanInfo[index].idOfCell.substring(colspanInfo[index].idOfCell.indexOf('y') + 1, colspanInfo[index].idOfCell.indexOf(','))) - lenOST;
      colspanInfo[index].idOfCell = colspanInfo[index].idOfCell.substring(0, colspanInfo[index].idOfCell.indexOf('y') + 1) + correctRow + colspanInfo[index].idOfCell.substring(colspanInfo[index].idOfCell.indexOf(','), colspanInfo[index].idOfCell.length)
      index++;
    }

  }

  //console.log(colspanInfo);
  return colspanInfo;

}



function filterHTML(html) {
  html = html.replace(/[<]br[^>]*[>]/gi, "").replace(/[&]nbsp[;]/gi, " ");;
  return html
}