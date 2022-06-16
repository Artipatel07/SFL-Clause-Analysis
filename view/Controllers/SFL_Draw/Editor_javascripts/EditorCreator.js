/* function changedSelectedSentence(sentenceThatUserSelected, sentenceIdThatUserSelected) {
    selectedSentence = sentenceThatUserSelected;
    selectedSentenceId = sentenceIdThatUserSelected;
    //sentenceThatUserSelceted is the id of sentence 
    //getSentence();

} */


/* function setCaretPosition(el, sPos)
{


    var charIndex = 0, range = document.createRange();
    range.setStart(el, 0);
    range.collapse(true);
    var nodeStack = [el], node, foundStart = false, stop = false;

    while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType == 3) {
            var nextCharIndex = charIndex + node.length;
            if (!foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
                range.setStart(node, sPos - charIndex);
                foundStart = true;
            }
            if (foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
                range.setEnd(node, sPos - charIndex);
                stop = true;
            }
            charIndex = nextCharIndex;
        } else {
            var i = node.childNodes.length;
            while (i--) {
                nodeStack.push(node.childNodes[i]);
            }
        }
    }
    selection = window.getSelection(); 
    selection.removeAllRanges(); 
    selection.addRange(range);
}  */

function makeSentenceClickableAndIndexed() {
    var textbox = document.getElementById('putcontentshere').innerHTML;
    var el = document.getElementById("putcontentshere");
    // var caretPos  = getCaretPosition(el);
    var selection = window.getSelection();
    if (selection != '') {} // so I can highlight words. 
    else {
        //reset sentence so no tags exist
        //textbox = textbox.replace(/\([0-9][0-9]*[0-9]*[0-9]*[0-9]*\)/gi,'');
        //textbox = textbox.replace(new RegExp('<span class="subscript"></span>',"g"),'');
        //textbox = textbox.replace(/id="flip\d+"/g, '');
        //textbox = textbox.replace(new RegExp('<span id="flip" onclick= "changedSelectedSentence\(this.innerHTML\)"> ',"g"), ""); 
        //textbox = textbox.replace(/<span id="flip" onclick="changedSelectedSentence\(this.innerHTML\)">/g, ""); 
        //textbox = textbox.replace(/<span  onclick="changedSelectedSentence\(this.innerHTML\)">/g, "");
        //textbox = textbox.replace(new RegExp("</span>","g") , "");
        //textbox = textbox.replace(new RegExp('<span class="ULtwo">',"g") , "");
        //console.log(textbox);
        //textbox = "<span id='flip'>" + textbox;

        /*  
          //add tags so they are clickable
          textbox = textbox.replace(/\./g, '.</span><span id="flip" onclick= "changedSelectedSentence(this.innerHTML)">');
          textbox = textbox.replace(/\!/g, '!</span><span id="flip" onclick= "changedSelectedSentence(this.innerHTML)">');
          textbox = textbox.replace(/\?/g, '?</span><span id="flip" onclick= "changedSelectedSentence(this.innerHTML)">');  
          textbox = textbox.replace(/<span id='flip'>/g, '<span id="flip" onclick= "changedSelectedSentence(this.innerHTML)">');
        */
        var indices = [];
        var indices = getIndicesOf("flip", textbox);
        //textbox = textbox.slice(0,indices[0]+4) + 0 + textbox.slice(indices[0]+4);
        var start = 0;
        for (index = 0; index < indices.length; index++) {
            //console.log(indices[index]);#
            //4 for each letter in flip
            textbox = textbox.slice(0, indices[index] + 4 + start) + index + textbox.slice(indices[index] + 4 + start);
            if (start < 10) { start++; } else if (start < 100) { start += 2; } else if (start < 1000) { start += 3; } else if (start < 10000) { start += 4; } else if (start < 100000) { start += 5; } else if (start < 1000000) { start += 6; } else if (start < 10000000) { start += 7; } else if (start < 100000000) { start += 8; } else if (start < 1000000000) { start += 9; } else if (start < 10000000000) { start += 10; } //first limitation, only 100 billion sentences aloud
        }

        //console.log(textbox);
        document.getElementById('putcontentshere').innerHTML = textbox;
        // setCaretPosition(el, caretPos);
    }
}


function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0,
        index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function addUnderlines() {
    //for all tables stored, underline the corrosponding sentences
    if (underlineActive == true) {

        for (indexT in tablesStored) {
            var skip = 0;
            var tableid = tablesStored[indexT].id;
            var sentenceToUl = document.getElementById("flip" + tableid).innerHTML; // corrsponding sentence
            sentenceToUl = sentenceToUl.replace(/<span class="subscript">\(\d+\)<\/span>/, ""); //erase the index
            var underlined = '';
            // create the inner html of sentenceToUl by underlining all words with annotations

            for (i = 0; i < tablesStored[indexT].values[0].length; i++) {
                var defaultCs = true;
                //if any colspans > 1 exist of this table
                if (tablesStored[indexT].colspanArray.length > 0) {
                    //loop through the colspan array
                    for (x in tablesStored[indexT].colspanArray) {
                        //if current colspan in the array corrosponds to the column we're currently on
                        if (tablesStored[indexT].colspanArray[x].idOfCell == "tableEntry" + 0 + ',' + i) {
                            //loop through the colspan widths of the column
                            for (var y = 0; y < tablesStored[indexT].colspanArray[x].csWidth; y++) {
                                //ensure its not blank
                                if (tablesStored[indexT].values[0][i] != "") {
                                    //add the html
                                    underlined += '<span class="ULtwo">' + tablesStored[indexT].headings[i + skip] + ' </span>';
                                    //increment skip every second time starting the first time it occurs
                                    skip++;
                                } else {
                                    underlined += tablesStored[indexT].headings[i + skip] + ' ';
                                    skip++;
                                }
                            }
                            defaultCs = false;
                            skip--;
                            break;
                        }
                    }
                    //now if the current cell didn't have a colspan listed in the array it must mean it
                    //has a default colspan of 1
                    if (defaultCs == true) {
                        //if value exists but colspan == 1
                        if (tablesStored[indexT].values[0][i] != "") {
                            underlined += '<span class="ULtwo">' + tablesStored[indexT].headings[i + skip] + ' </span>';
                        }
                        //if no value exists and colspan == 1
                        else {
                            underlined += tablesStored[indexT].headings[i + skip] + ' ';
                        }
                    }
                }
                //if colspans > 1 don't exist then do the usual
                else {
                    if (tablesStored[indexT].values[0][i] != "") {
                        underlined += '<span class="ULtwo">' + tablesStored[indexT].headings[i + skip / 2] + ' </span>';
                    } else {
                        underlined += tablesStored[indexT].headings[i + skip / 2] + ' ';
                    }
                }
            }
            //</span> = length of 7, 
            if (underlined.charAt(underlined.length - 8) == ' ') { underlined = underlined.slice(0, underlined.length - 8) + underlined.slice(underlined.length - 7, underlined.length); }
            if (tableid != 0) {
                sentenceToUl = '<span class="subscript">(' + tableid + ')</span>' + underlined;
            } else {
                sentenceToUl = underlined;
            }
            document.getElementById("flip" + tableid).innerHTML = sentenceToUl;
        }
    }
}

function setStudentList(list, sentence_id) {
    //sentence id is used to load the correct table
    var items = document.getElementById("student_list");
    items.innerHTML = ''; //if theres any entries, delete them
    for (var i = 0; i < list.length; i++) {
        var item = document.createElement("a");
        item.setAttribute('href', '#');
        item.setAttribute('class', 'list-group-item');
        //item.onclick = getOtherStudentsResults(list[i].USER_ID);
        item.innerHTML = list[i].USER_NAME;
        item.id = sentence_id + ',' + list[i].USER_ID
        items.appendChild(item);
    }

}