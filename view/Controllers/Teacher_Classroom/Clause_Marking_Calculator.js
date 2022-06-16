
 
 document.getElementById("OnefileContents").addEventListener("input", function(event) {
    console.log("input event fired");
    var el = document.getElementById("OnefileContents");
    var caretPos  = getCaretPosition(el);
    breakLine = caretPos;
    console.log(caretPos)
    $('#OnefileContents').html( $('#OnefileContents').html().replace(/\<span class="two"\>\<br\>\<\/span\>/g,'<br>'));
    setCaretPosition(el, caretPos);

  //   document.getElementById("OnefileContents").addEventListener("keyup", function(event) {
  //     console.log("kj")
  //     var downArrow = $.Event("keyup", {keyCode:13});
  //     $('#OnefileContents').trigger(downArrow)
  // });

}, false);



function setCaretPosition(el, sPos)
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
} 

function getCaretPosition(el){
  var caretOffset = 0, sel;
  if (typeof window.getSelection !== "undefined") {
  	
  	var sel = window.getSelection && window.getSelection();
    	if (sel && sel.rangeCount > 0) { //prevents error
			var range = window.getSelection().getRangeAt(0);
			var selected = range.toString().length;
   		 	var preCaretRange = range.cloneRange();
   			 preCaretRange.selectNodeContents(el);
    	     preCaretRange.setEnd(range.endContainer, range.endOffset);
    		caretOffset = preCaretRange.toString().length - selected;
	}
  }
  return caretOffset;
}


//When enabled the user can edit the file and change where the clauses are located. 
function setClause(textElementId, appendsToThisElement) {
  
  var selectedText = '';
  var selection;
  $('#' + textElementId.attr('id')).mouseup(function (e) {

    //if some of the text in this element is selected
    selection = window.getSelection().getRangeAt(0);
    selectedText = selection.toString().trim();//.replace(/&nbsp;/g,"");

    if (selectedText.length > 0) {
      //make calculator appear at the position of the mouse,
      $('#keypadWrapper').css({ 'top': e.pageY + 'px', 'left': e.pageX + 'px', 'z-index': '999' }).show();
    }
    else {
      $('#keypadWrapper').hide();
    }

  });
  var value = '';
  //when user pressed enter, get returned value 
  $('#CalculatorDone').click(function () {
    
    value = $('#keypadDisplay').val();
    if (value != '' && value != '( )' && value != '()') {
      if (el == '') {
        var otherClauses = '';
        //check if this clause is indentical to another, if so make sure the first clause is not the one being indexed
        do {
          
          var substring = textElementId.html().substring(textElementId.html().indexOf(selectedText) + selectedText.length, textElementId.html().indexOf(selectedText) + selectedText.length + 11) //+11 for </span><br>
          if (substring == '</span><br>') {
            otherClauses += textElementId.html().substring(0, textElementId.html().indexOf(selectedText) + selectedText.length + 7)
            textElementId.html(textElementId.html().substring(textElementId.html().indexOf(selectedText) + selectedText.length + 7, textElementId.html().length));
          }
          else {
            //users can embed cluases within clauses, find index of <span and </span, if <span first then it's okay to mark clause
            indexOfText = textElementId.html().indexOf(selectedText)
            console.log(indexOfText)
            str = textElementId.html().substring(indexOfText + selectedText.length, textElementId.html().length)
            ind1 = str.indexOf('<span'); ind2 = str.indexOf('</span>');
            if (ind1 <= ind2) {
              //now update that clause to have a span. 
              textElementId.innerHTML = textElementId.html().replace(selectedText, '<span class = "two"><span class="subscript">' + value + '</span>' + selectedText + '</span><br>');
              $('#' + appendsToThisElement).html(otherClauses + textElementId.innerHTML);
              $('#keypadWrapper').hide();
            }

          }
        } while (substring == '</span><br>')
        //textElementId.html(otherClauses + textElementId.html());

        //check if roman numeral was entered so that we can predict if next value is a value with a roman num too 
        keypad_value = document.getElementById('keypadDisplay').value;
        roman_num = keypad_value.replace(/[0-9]/g, '');
        var notRoman = true;
        if (roman_num != '()') {
          notRoman = false;
        }
        keypadNextValue(notRoman);//gets the highest subscript value and increments to predict the next value
        changeSubscripts();
      }
      else {
        el.html('' + value);
        $('#keypadWrapper').hide();
        el = '';
        changeSubscripts();
      }

    }
    $('#clauseTable').html('')
    $('#OnefileContents').find('.two').each(function () {
      $('#clauseTable').append('<tr><td><p><label><input style="opacity:1; position:relative; pointer-events:unset" type="checkbox" /></label></p></td><td>' + $(this).html() + '</td></tr>')
    });
    enableOrDisableClauseButtons();

  });
}


function changeSubscripts() {

  /*$('.subscript').click(function(e){
    el = $(this);
    e.stopPropagation();
    $('#editSubcriptCard').css({'top':e.pageY+'px','left' : e.pageX+'px'}).show();

    $('#deleteSubscript').click(function(){
      //have to delete underline also
      el.next().next('br').remove();
      el.next('.two').contents().unwrap(); //remove tags keep inner html
      el.remove();

      $('#editSubcriptCard').hide();
      el = '';
    });

    $('#editSubscript').click(function(event){
      $('#editSubcriptCard').hide();
      $('#keypadWrapper').css({'top': event.pageY+'px','left': event.pageX+'px','z-index':'999'}).show();

    });
  });*/

}

$('#fileContents,#OnefileContents').click(function () {
  $('#editSubcriptCard').hide();
});



function checkHighestSubscriptNum() {
  //var largest  = Math.max.apply(null, content.match(/pan class="subscript">\(\d\)+/g));
  var array = [];
  $('#OnefileContents .subscript').each(function () {
    array.push(parseInt(this.innerHTML.replace('(', '').replace(')', '')));
  });
  var max = Math.max(...array);
  return max;
}

// Code given by Professor John Keating (clause calculator)
var keypad_bracket_l = "(", keypad_bracket_r = ")", keypad_value = "";

function keypadAddDigit(v) {
  keypad_value += '' + v;
  document.getElementById('keypadDisplay').value =
    keypad_bracket_l + keypad_value + keypad_bracket_r;
}

function keypadClear() {
  keypad_value = "";
  document.getElementById('keypadDisplay').value =
    keypad_bracket_l + keypad_value + keypad_bracket_r;
}

function keypadNextValue(NumNotRoman) {

  if (NumNotRoman) {
    keypad_value = checkHighestSubscriptNum() + 1;
    document.getElementById('keypadDisplay').value =
      keypad_bracket_l + keypad_value + keypad_bracket_r;
  }
  else {
    keypad_value = document.getElementById('keypadDisplay').value;
    roman_num = keypad_value.replace(/[0-9]/g, '');
    num = keypad_value.replace(roman_num.replace('(', '').replace(')', ''), '').replace('(', '').replace(')', '');
    roman_converted = roman_to_Int(roman_num);
    roman_num = romanize(roman_converted + 1);
    roman_num = roman_num.replace('(', '').replace(')', '');
    document.getElementById('keypadDisplay').value = keypad_bracket_l + num + roman_num + keypad_bracket_r;
  }
}


function keypadRoundBrackets() {
  keypad_bracket_l = "("; keypad_bracket_r = ")";
  document.getElementById('keypadDisplay').value =
    keypad_bracket_l + keypad_value + keypad_bracket_r;
}

function keypadSquareBrackets() {
  keypad_bracket_l = "["; keypad_bracket_r = "]";
  document.getElementById('keypadDisplay').value =
    keypad_bracket_l + keypad_value + keypad_bracket_r;
}


function addKeypadEvent(element, evnt, funct) {
  if (element.attachEvent)
    return element.attachEvent('on' + evnt, funct);
  else
    return element.addEventListener(evnt, funct, false);
}

//
// add the event handlers to the keypad button elements
//
addKeypadEvent(document.getElementById('keypad_x'), 'click', function () { keypadAddDigit('x'); });
addKeypadEvent(document.getElementById('keypad_v'), 'click', function () { keypadAddDigit('v'); });
addKeypadEvent(document.getElementById('keypad_i'), 'click', function () { keypadAddDigit('i'); });
addKeypadEvent(document.getElementById('keypad_9'), 'click', function () { keypadAddDigit(9); });
addKeypadEvent(document.getElementById('keypad_8'), 'click', function () { keypadAddDigit(8); });
addKeypadEvent(document.getElementById('keypad_7'), 'click', function () { keypadAddDigit(7); });
addKeypadEvent(document.getElementById('keypad_6'), 'click', function () { keypadAddDigit(6); });
addKeypadEvent(document.getElementById('keypad_5'), 'click', function () { keypadAddDigit(5); });
addKeypadEvent(document.getElementById('keypad_4'), 'click', function () { keypadAddDigit(4); });
addKeypadEvent(document.getElementById('keypad_3'), 'click', function () { keypadAddDigit(3); });
addKeypadEvent(document.getElementById('keypad_2'), 'click', function () { keypadAddDigit(2); });
addKeypadEvent(document.getElementById('keypad_1'), 'click', function () { keypadAddDigit(1); });
addKeypadEvent(document.getElementById('keypad_0'), 'click', function () { keypadAddDigit(0); });
addKeypadEvent(document.getElementById('keypad_r'), 'click', function () { keypadRoundBrackets(); });
addKeypadEvent(document.getElementById('keypad_s'), 'click', function () { keypadSquareBrackets(); });
addKeypadEvent(document.getElementById('keypad_clear'), 'click', function () { keypadClear(); });


function romanize(num) {
  if (isNaN(num))
    return NaN;
  var digits = String(+num).split(""),
    key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
      "", "x", "xx", "xxx", "xL", "L", "LX", "LXX", "LXXX", "XC",
      "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"],
    roman = "",
    i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

function roman_to_Int(str1) {

  if (str1 == null) return -1;
  var num = char_to_int(str1.charAt(0));
  var pre, curr;

  for (var i = 1; i < str1.length; i++) {
    curr = char_to_int(str1.charAt(i));
    pre = char_to_int(str1.charAt(i - 1));
    if (curr <= pre) {
      num += curr;
    }
    else {
      num = num - pre * 2 + curr;
    }
  }

  return num;
}

function char_to_int(c) {
  switch (c) {
    case 'I': return 1;
    case 'V': return 5;
    case 'X': return 10;
    case 'L': return 50;
    case 'C': return 100;
    case 'D': return 500;
    case 'M': return 1000;
    default: return -1;
  }
}

function alertDuplicate(element) {
  var array = [];
  $('#OnefileContents .subscript').each(function () {
    array.push(this.innerHTML.replace('(', '').replace(')', ''));
  });
  var duplicates = find_duplicate_in_array(array);
  if (duplicates.length != 0) {
    $('#duplicateClauseCard').show();
    $('#overlay').css({ 'z-index': '998' });
    $('#EditClauses,#EditOneCluases, #setAnswers').hide();
    console.log(duplicates);
    $('#Automatically').click(function () {
      automaticallyRemoveDuplicates(duplicates);

    })

  }
}
function find_duplicate_in_array(arra1) {
  var object = {};
  var result = [];

  arra1.forEach(function (item) {
    if (!object[item])
      object[item] = 0;
    object[item] += 1;
  })

  for (var prop in object) {
    if (object[prop] >= 2) {
      result.push(prop);
    }
  }

  return result;

}



//recursive
function automaticallyRemoveDuplicates() {

  var contents = document.getElementById('OnefileContents').innerHTML;
  //find all duplicate 
  var array = [];
  $('#OnefileContents .subscript').each(function () {
    array.push(this.innerHTML.replace('(', '').replace(')', ''));
  });
  var duplicates = find_duplicate_in_array(array);
  var max = checkHighestSubscriptNum();

  //base case
  if (duplicates.length == 0) {
    $('#duplicateClauseCard').hide();
    $('#overlay').css({ 'z-index': '899' });
    return;
  }

  var split = [];
  for (x in duplicates) {
    var regex = new RegExp("(\\(" + duplicates[x] + "\\))");
    //past first occurence of 
    max += 1;
    console.log(max)
    split = contents.split(regex);
    split[3] = "(" + max + ")";
    contents = '';
    for (x in split) {
      contents += split[x];
    }
    document.getElementById('OnefileContents').innerHTML = contents;
  }


  automaticallyRemoveDuplicates();

}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}
