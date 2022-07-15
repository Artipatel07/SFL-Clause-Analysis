

function deleteGroup(groupId) {
    $.ajax({
        type: "DELETE",
        url: backendPort + "/group/deleteGroup/" + groupId,
        dataType: "json",
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

function myFunction(){
    var username= localStorage.getItem("Username");
    document.getElementById("myUserName").innerHTML = '<b>Logged in:</b> '+username;
}
 
myFunction();

$('#studentButton').click(function () {
// window.location.href ="views/group";
});

$(document).ready(function() {

    $('.description').hover(function() {
        $(this).css({ 'opacity': '1', 'font-size': '14px' });

    }, function() {
        $('.description').css({ 'opacity': '0' });
    });

    $('#addGroup').click(function() {
        var height = $(document).height();
        $('#overlay').css({ 'height': height + 'px' }).show();
        $('#newClassroom').slideDown();
    });

    $('#closeNewClassroom').click(function() {
        $('#newClassroom').slideUp();
        $('#overlay').hide();
    });

    setTimeout(() => {
        $.ajax({
            type: "GET",
            url: backendPort + "/group/allGroups/" + localStorage.getItem("Username"),
            dataType: "json",
            encode: true,
            beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
            success: function(data) {
                let htmlString = ``;
                for (var i = 0; i < data.length; i++) {
                    htmlString += `<div class='card gallery-item' style='cursor: pointer;' id='group` + data[i].groupID + `'
                     onclick="location.href='/views/group-clauses/` + data[i].groupID + `'">
                        <img id='` + data[i]._id + `' alt='Avatar' style='width:100%; height: 100px'
                            src='/css/classroom_selector/card_background.png'>
                        <div style='width: 100%; padding-left: 5%; padding-top: 5%; padding-right: 5%;'>
                            <h4 class="truncate" style='color:white'>
                                <b>` +
                        data[i].groupName +
                        `</b>
                            </h4>
                            <span class='truncate' style='display: flex; justify-content: space-between; align-items: center; vertical-align: middle'>
                            <p style='color:white; display: inline-block;'>
                                Capacity: ` + data[i].groupCapacity + `
                            </p>
                            <button class="btn btn-danger pull-right" style='display: inline-block;' onclick='event.stopPropagation(); deleteGroup(` + data[i].groupID + `);'><i class="material-icons">delete</i></button>
                            </span>
                        </div>
                    </div>`;
                }
                $('#insertClassroomsHere').html(htmlString);
            },
            error: function(xhr, status, error) {
                console.log(status);
                console.log(error);
            }
        });
    }, 1000);
    $('#newClassroomForm').on('submit', function(e) {
        var formData = {
            groupName: $("#newClassroomForm input[name=groupName]").val(),
            groupID: $("#newClassroomForm input[name=groupID]").val(),
            groupCapacity: $("#newClassroomForm input[name=groupCapacity]").val(),
        };
        $.ajax({
            type: "POST",
            url: backendPort + "/group/createGroup/" + $.cookie("username"),
            data: formData,
            dataType: "json",
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
        e.preventDefault();
    });
});