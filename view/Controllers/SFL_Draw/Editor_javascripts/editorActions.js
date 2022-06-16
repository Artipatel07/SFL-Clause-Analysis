function initShortCuts() {

    $('[id = analysisShortCut]').click(function (e) {
        var instance1 = M.Tabs.getInstance($('.tabs'))
        e.stopPropagation();
        var index = $(this).parent().parent().index() - 1;
        $('#flip' + index).click();
        $('#panel2').css({ top: e.pageY, left: e.pageX })
        $('#MarkupButton').click();
    })

    $('[id = treeShortCut]').click(function (e) {
        var instance1 = M.Tabs.getInstance($('.tabs'))
        e.stopPropagation();
        var index = $(this).parent().parent().index() - 1;
        $('#flip' + index).click();
        $('#panel2').css({ top: e.pageY, left: e.pageX })
        setTimeout(function () {
            $('#TreeButton').click();
            instance1.updateTabIndicator();
        }, 500);
    })

    $('[id = otherShortCut]').click(function (e) {
        var instance1 = M.Tabs.getInstance($('.tabs'))
        e.stopPropagation();
        var index = $(this).parent().parent().index() - 1;
        $('#flip' + index).click();
        $('#panel2').css({ top: e.pageY, left: e.pageX })
        setTimeout(function () {
            $('#OtherButton').click();
            instance1.updateTabIndicator();
        }, 500);
    })

    ///checkboxes are checked once the user has clicked save on the clause analysis
    // if all checkboxes are checked then user can submit answers and the adding assignment process is done

    $("input[type= checkbox]").change(function () {
        if ($('input:checkbox:checked').length >= $('input:checkbox').length - 1) {
            $('#submitAssignmentAnswers').removeClass('disabled');
            $('#submitAssignmentAnswers').hide();
            $('#returnToClassroom').show();
            //$('input[type=checkbox]').prop('checked', true);
            $('#messageEl').delay(1000).slideDown().delay(5000).slideUp();
        }
    });
    $('#isAnalysed').click(function (e) { e.stopPropagation(); })//do nothing, it will 

    $('#submitAssignmentAnswers').click(function () {

        if (user.role == 'Student') {

            //need to tell the program the attempts made on the assignment is finished
            return new Promise(function (res, rej) {
                $.get(
                    port2 + "SFL_Draw/AttemptFinishStatus",
                    function (data) {
                        res(data);

                        //need to redirect Student Back to classroom
                        window.location.replace(port2 + 'Class/Student/' + classroomid);
                    }
                );
            });

        }


        else {
            if (isEditing && assignment.Complete) {
                //save the edited solutions
                for (x in answerArray) {
                    SaveAnswersInDB(answerArray[x]);
                }
                $('#Sfl_teacher_settings').click(); // in teacher settings file
            }
            else {
                //need redirect Teacher back to classroom
                window.location.href = (port2 + 'Class/Teacher/' + classroomid);

                //first need to tell the program the assignment is complete
                return new Promise(function (res, rej) {
                    $.get(
                        port2 + "SFL_Draw/ToggleAssignmentFinishStatus",
                        function (data) {
                            res(data);
                        }
                    );
                });
            }
        }
    });


    $('#putcontentshere tbody tr td.clauseAlignment').click(function (e) {
        $(this).children('span')[0].click();
        $('#panel2').css({ 'top': e.pageY + 'px', 'left': e.pageX + 'px' })
    })
}




