//table 
function toggleFirstLayer() {
  $("[id=accordion_trigger0]").on("click",
    function () {
      var accordionRow = $(this).next().next(".accordion1");
      if (!accordionRow.is(":visible")) {
        $(this).nextUntil('#accordion_trigger0').not('.accordion2').show();
      }
      else {
        accordionRow.hide();
        $(this).nextUntil('#accordion_trigger0').hide();
      }
    });
}

function toggleTableLayer() {
  $("[id=accordion_trigger1]").on("click",
    function () {
      var accordionRow = $(this).next(".accordion2");
      if (!accordionRow.is(":visible")) {
        // accordionRow.find(".accordion-content2").html('<img src="css/compareTables.png" alt="compared Tree">');
        accordionRow.show().find(".accordion-content2").slideDown();
      } else {
        accordionRow.find(".accordion-content2").slideUp(function () {
          if (!$(this).is(':visible')) {
            accordionRow.hide();
          }
        });
      }
    });
}
//tree

function toggleTreeLayer() {
  $("[id=accordion-tree1]").on("click",
    function () {
      var accordionRow = $(this).parent().next(".accordion2");
      if (!accordionRow.is(":visible")) {
        // accordionRow.find(".accordion-content2").html('<img src="css/treecompare3.png" alt="compared Tree">');
        accordionRow.show().find(".accordion-content2").slideDown();
      } else {
        accordionRow.find(".accordion-content2").slideUp(function () {
          if (!$(this).is(':visible')) {
            accordionRow.hide();
          }
        });
      }
    });
}

//Student table 
function toggleStudentZeroLayer() {
  $("[id=accordion_trigger3]").on("click",
    function () {
      var accordionRow = $(this).next().next(".accordion3");
      if (!accordionRow.is(":visible")) {
        $(this).nextUntil('#accordion_trigger3').not('.accordion4').show();
      }
      else {
        accordionRow.hide();
        $(this).nextUntil('#accordion_trigger3').hide();
      }
    });
}

function toggleStudentFirstLayer() {
  /*$("[id=accordion_trigger4]").on("click",
    function () {
      var accordionRow = $(this).next().next(".accordion3");
      if (!accordionRow.is(":visible")) {
        $(this).nextUntil('#accordion_trigger4, #accordion_trigger3').not('.accordion4').show();
        //$(this).parent().next('clause-table-header').hide();
      }
      else {
        accordionRow.hide();
        $(this).nextUntil('#accordion_trigger4, #accordion_trigger3').hide();
      }
    });*/
}

function toggleStudentTableLayer() {
  $("[id=accordion_trigger4]").on("click",
    function () {
      var accordionRow = $(this).next(".accordion4");
      if (!accordionRow.is(":visible")) {
        //accordionRow.find(".accordion-content4").html('<img src="css/compareTables.png" alt="compared Tree">');
        accordionRow.show().find(".accordion-content4").slideDown();
      } else {
        accordionRow.find(".accordion-content4").slideUp(function () {
          if (!$(this).is(':visible')) {
            accordionRow.hide();
          }
        });
      }
    });
}
//tree

function toggleStudentTreeLayer() {
  $("[id=accordion-tree5]").on("click",
    function () {
      var accordionRow = $(this).parent().next(".accordion4");

      if (!accordionRow.is(":visible")) {
        // accordionRow.find(".accordion-content4").html('<img src="css/treecompare3.png" alt="compared Tree">');
        accordionRow.show().find(".accordion-content4").slideDown();
      } else {
        accordionRow.find(".accordion-content4").slideUp(function () {
          if (!$(this).is(':visible')) {
            accordionRow.hide();
          }
        });
      }
    });
}