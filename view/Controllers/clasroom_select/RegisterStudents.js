/*$('#registerStudents').click(function () {
    if (role != 'Student') {
        $('#RegisterUserCard').slideDown();
        $('#overlay').show();
    }
});

$('#closeRegisterUser').click(function () {
    $('#RegisterUserCard').slideUp();
    $('#overlay').fadeOut();
});*/

$('#submitRegisterForm').click(async function () {
    $('.progress').fadeOut();
    $('.name').fadeOut();
    $('#updateTheseFiles').hide();
    $('.divider').hide();
    $('.done').removeClass("anim").css({ 'width': '206px', 'height': '206px', 'left': '67px', 'top': '-18px' }).addClass("anim")
    var instance = M.Tabs.getInstance($('.tabs'));

    setTimeout(function () {
        $('#updateTheseFiles').click()
        instance.select('existingStudents');
        instance.updateTabIndicator();
    }
        , 3000);

})

$('#updateTheseFiles').click(function () {
    $('#file').val('')
})

$('#existingStudents').click(async function () {
    students = await getAssociatedStudents();
    console.log(students)
    makeStudentList()
});
// trigger input
$("[id='triggerFile']")[0].addEventListener("click", function (evt) {
    evt.preventDefault();
    $("#file").click();
});
// drop events
$("#drop")[0].ondragleave = function (evt) {
    $("#drop")[0].classList.remove("active");
    evt.preventDefault();
};
$("#drop")[0].ondragover = $("#drop").ondragenter = function (evt) {
    $("#drop")[0].classList.add("active");
    evt.preventDefault();
};
$("#drop")[0].ondrop = function (evt) {
    $('#file').files = evt.dataTransfer.files;
    $("footer")[0].classList.add("hasFiles");
    $("#drop")[0].classList.remove("active");
    evt.preventDefault();
};

//upload more

$(".importar")[0].addEventListener("click", function (e) {
    $(".list-files").html('');
    $("footer")[0].classList.remove("hasFiles");
    $(".importar")[0].classList.remove("active");
    setTimeout(function () {
        $("#drop")[0].classList.remove("hidden");
    }, 500);
});
$('#file').change(function (evt) {
    if ($('#file').val() == '') {
        $('#submitRegisterForm').addClass('disabled');
    }
    else {
        $('#submitRegisterForm').removeClass('disabled');
        handleFileSelect(evt)
    }

});


function handleFileSelect(evt) {
    console.log(evt.target)
    var files = evt.target.files; // FileList object
    var type = files[0].name.substring(files[0].name.indexOf('.'), files[0].name.length);
    if (type != '.xlsx') {
        console.log(type)
        alert('Please upload the xslx file provided with the details filled out!')
    }
    else {
        //files template
        var template = "" + Object.keys(files).
            map(function (file) {
                return "<div class=\"file file--" + file + "\">\n     <div class=\"name\"><span>" +
                    files[file].name + "</span></div>\n     <div class=\"progress active\"></div>\n     <div class=\"done\">\n\t<a href=\"\" target=\"_blank\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1000 1000\">\n\t\t<g><path id=\"path\" d=\"M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,967.7C241.7,967.7,32.3,758.3,32.3,500C32.3,241.7,241.7,32.3,500,32.3c258.3,0,467.7,209.4,467.7,467.7C967.7,758.3,758.3,967.7,500,967.7z M748.4,325L448,623.1L301.6,477.9c-4.4-4.3-11.4-4.3-15.8,0c-4.4,4.3-4.4,11.3,0,15.6l151.2,150c0.5,1.3,1.4,2.6,2.5,3.7c4.4,4.3,11.4,4.3,15.8,0l308.9-306.5c4.4-4.3,4.4-11.3,0-15.6C759.8,320.7,752.7,320.7,748.4,325z\"</g>\n\t\t</svg>\n\t\t\t\t\t\t</a>\n     </div>\n    </div>";
            }).


            join("");

        $("#drop")[0].classList.add("hidden");
        $("footer")[0].classList.add("hasFiles");
        $(".importar")[0].classList.add("active");
        setTimeout(function () {
            $(".list-files")[0].innerHTML = template;
        }, 1000);

        Object.keys(files).forEach(function (file) {
            var load = 2000 + file * 2000; // fake load
            setTimeout(function () {
                $(".file--" + file)[0].querySelector(".progress").classList.remove("active");
                $(".file--" + file)[0].querySelector(".done").classList.add("anim");
            }, load);

            var control = $('#file');

        });
    }
    $("#file")[0].addEventListener("change", handleFileSelect);
}



function makeStudentList() {
    $('.collection').html("<div style='margin-top: 10px; margin-bottom:10px'> Select the students you want to add to your new classroom</div>");
    for (s in students) {
        $('.collection').append('<a class="collection-item avatar"><i class="material-icons circle">person</i><span class="title">Name : ' + students[s].name + '<br>Username : ' + students[s].username + '</span></a>')
    }
    initAddStudentToClass()
}