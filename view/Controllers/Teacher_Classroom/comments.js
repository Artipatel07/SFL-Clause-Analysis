function initComments() {
    $('[id^=commentSubmit]').click(function () {
        let id = $(this).prev().find('textarea')[0].id.replace('comment', '');
        let val = ''
        let grade = ''
        if ($('#comment' + id).val() == null) {
            val = $(this).prev()[0].innerHTML
            grade = 0
        }
        else {
            val = $('#comment' + id).val();
            var g = $('#grade' + id).val()
            if (g != null) {
                grade = g;
            }
            else {
                grade = 0;
            }
        }
        saveComment(id.substring(1, id.length), val, grade, $(this))
        // depends on what table you are entering feedback 
        if ($(this).closest('.accordion4').prev().find('td')[2] != null)
            $(this).closest('.accordion4').prev().find('td')[2].innerHTML = grade + '%'
        else if ($(this).closest('.accordion2').prev().find('td')[2] != null)
            $(this).closest('.accordion2').prev().find('td')[2].innerHTML = grade + '%'
    })
}

async function saveComment(Attemptid, comment, grade, el) {
    //send the current assignment data to be updated
    return new Promise(async function (resolve, reject) {

        $.post(
            port2 + "SFL_Draw/Save_Comment/",
            {
                "Attempt_id": Attemptid,
                "Comment": comment,
                "Grade": grade
            },
            function (data) {
                resolve(data);
                if (data = 'success') {
                    el.parent().parent().prev().slideDown()
                    el.parent().parent().prev().delay(5000).slideUp();
                }
            });
    });
}
