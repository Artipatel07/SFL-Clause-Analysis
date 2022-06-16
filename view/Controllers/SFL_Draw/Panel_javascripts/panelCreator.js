// Show different tabs ie. markup/tree/other
var waitForPanel = 401;

function openLink(evt, linkName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("myLink");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(linkName).style.display = "block";
    $("#panel2").animateAuto("both");
    $('#OtherButton').css({ "background-color": "transparent" });
    $('#TreeButton').css({ "background-color": "transparent" });
    $('#MarkupButton').css({ "background-color": "transparent" });
    $('#' + evt.target.id).css({ "background-color": "rgb(70,70,70,.4)" });
    //$('#panel2').show();
}
//used to animate panel2 between transitions of tabs. 
jQuery.fn.animateAuto = function(prop, speed, callback) {

    /* setTimeout(function(){
      var elem = $('.tabs')
      var instance = M.Tabs.getInstance(elem);
      instance.updateTabIndicator();
    }, 501); */

    var elem, height, width;
    return this.each(function(i, el) {
        el = jQuery(el), elem = el.clone().css({ "height": "auto", "width": "auto" }).appendTo("body");
        height = elem.css("height"),
            width = elem.css("width"),
            elem.remove();

        if (prop === "height")
            el.animate({ "height": height }, speed, callback);
        else if (prop === "width")
            el.animate({ "width": width }, speed, callback);
        else if (prop === "both")
            el.animate({ "width": width, "height": height }, speed, callback);
    });


}

function getCaretPosition(el) {
    var caretOffset = 0,
        sel;
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


//closes panel2 when user clicks on red X
$("#closePanel2").click(function() {
    $("#panel2").hide();
});


$('.ui-menu-item').click(function() {
    $('.ui-autocomplete').addClass('active');
    $('.ui-menu-item').removeClass('active').removeClass('margin');
});

var repeat = true;
//show panel2 when user clicks on any sentence. Also adjusts contents to fit panel2


async function placeCompPanel(e) {
    $('#panel').css({ 'top': '600px' }).hide();
    var sen = e.target.id.substring(0, e.target.id.indexOf(',')) // this will allow us to change the sentence seen in panel if the user has not already loaded it
    if (sen == null) { sen = e.target.parentNode().id.substring(0, e.target.id.indexOf(',')) }
    if (document.getElementById(sen) != null) {
        var sentence = document.getElementById(sen).innerHTML.replace(/     &nbsp;/g, "");

        document.getElementById('sentence2').innerHTML = sentence.replace(/<span class="subscript">\(\d+\)<\/span>/gi, '');
        sid = e.target.id.substring(e.target.id.indexOf(',') + 1, e.target.id.length); //student id
        await getOtherStudentsResults(sid, sen);
        for (x in tablesStored) {
            if (tablesStored[x].id == sen.replace('flip', '')) {
                for (z in TSTstored) {
                    if (TSTstored[x].id == sen.replace('flip', '')) {
                        previouslyStored = true;
                        loadTable(tablesStored[x], TSTstored[z]);
                        break;
                    }
                }
            }
        }

        var top = e.pageY + 'px';
        var left = e.pageX + 'px';
        var bodyWidth = $('body').width();
        var diff = bodyWidth - e.pageX;
        $('#panel2').css({ position: 'absolute', 'max-width': '100%', top: top, left: '10px', right: '10px' }).show();
        //wait for panel2 to adjust size before letting the table fit the size of it
        $('#MarkupButton').click();
        setTimeout(function() {
            $('table[id^="table"]').css({ 'max-width': $('#panel2').outerWidth() / 2 + 'px', width: '100%', overflow: 'auto', display: 'block' });
            $('#comparedTable').css({ 'max-width': $('#panel2').outerWidth() / 2 + 'px', width: '100%', overflow: 'auto', display: 'block' });
            $('#Json_formatt').css({ 'max-width': $('#panel2').outerWidth() + 'px', overflow: 'auto' });
            $('.col-md-6').css({ 'width': '50%', 'overflow': 'auto' });
            $('#overflow_table').css({ 'overflow': 'unset' });
            //$('#MarkupButton').click();
        }, waitForPanel);

        userTable = document.getElementById(currentOneStrandTable);
        userTableTST = document.getElementById(currentThreeStrandTable);
        compTable = document.getElementById('comparedTable');
        compTableTST = document.getElementById('comparedTableTST');
        colorCompareTables2(userTable, compTable);
        colorCompareTables2(userTableTST, compTableTST);
    }

}

$('#panel').click(async function(e) {
    await placeCompPanel(e);
    if (repeat) {
        repeat = false;
        e.target.click();
        await placeCompPanel(e);
    } else { repeat = true; }
});