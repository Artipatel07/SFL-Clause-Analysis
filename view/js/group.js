

var username= localStorage.getItem("Username");
function getGroup(groupId) {
    $.ajax({
        type: "GET",
        url: backendPort + "/group/allGroups/" + username,
        dataType: "json",
        encode: true,
        beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
        success: function(data) {
         show(data);   ;
        },
        error: function(xhr, status, error) {
            console.log(status);
            console.log(error);
        }
    });
}

function getotherGroup(groupId) {
  $.ajax({
      type: "GET",
      url: backendPort + "/group/allOtherGroups/" + username,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
        show1(data);   ;
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });
}

function GetInvite(groupId) {
  $.ajax({
      type: "GET",
      url: backendPort + "/group/GetInvite/"+ username,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
        show2(data);   ;
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });
}

getGroup();
getotherGroup();
GetInvite();

function show(data) {
  
    let tab = 
        
        `<tr style=" font-size: 12px;">
        <th> Category </th>
          <th>Name</th>
          <th>Deatils</th>
          <th>Actions</th>
         </tr>`;
       
    // Loop to access all rows 
    for (let r of data) {
      if(r.members[0].userName == username){
      
        tab += `<tr> 
        <td>${"My Group"} </td>
    <td style="width:50%">${r.groupName}	
   </td>
    <td >
    <div class="status status-pending" >${r.groupCapacity}</div>

  </td>
  <td >
  <Button  class="status status-pending" onclick='LeaveGroup(this)'>Leave </Button>
  <Button  class="status status-pending" onclick='Invite(this)'>Invite </Button>
          
  </td>
         
  </tr>`;   
    }
    else{
    
    // Loop to access all rows 
  
 
      
        tab += `<tr> 
        <td>${"My Group"} </td>
        <td style="width:50%">${r.groupName}	
        </td>
    <td >
    <div class="status status-pending" >${r.groupCapacity}</div>

  </td>
  <td >
  <Button  class="status status-pending" onclick='LeaveGroup(this)'>Leave </Button>
  </td>
         
  </tr>`; 
  }
}
    // Setting innerHTML as tab variable
    if(tab)
    document.getElementById("Document").innerHTML = tab;
  }

  function show1(data) {
    let tab = 
        
        `<tr style=" font-size: 12px;">
        <th> Category </th>
          <th>Name</th>
          <th>Details</th>
          <th>Actions</th>
         </tr>`;
    
    // Loop to access all rows 
    for (let r of data) {
 
      
        tab += `<tr > 
        <td>${"Group"} </td>
        <td style="width:50%">${r.groupName}	
        </td>
    <td >
    <div class="status status-pending" >${r.groupCapacity}</div>

  </td>
  <td >
  <Button  class="status status-pending" onclick='JoinGroup(this)'>Join </Button>

  </td>
           
  </tr>`;
     
        
      
    }
  
    if(tab)
    document.getElementById("Document1").innerHTML = tab;
    
  }



  
  getGroup();
  getotherGroup();
  GetInvite();
  
  function show2(data) {
   
      let tab = 
          
          `<tr style=" font-size: 12px;">
          <th> Category </th>
            <th>Name</th>
            <th>Deatils</th>
            <th>Actions</th>
           </tr>`;
      
      // Loop to access all rows 
      for (let r of data) {
   // this.owner = r.owner;
        
          tab += `<tr> 
          <td>${"Invite"} </td>

     <td style="width:50% padding: 10px;">${r[0].groupName}	
     </td>
      <td >
      <div class="status status-pending" >${r[0].groupCapacity}</div>
  
    </td>
    <td >
    <Button  class="status status-pending" onclick='AcceptGroup(this)'>Accept </Button>
  
    </td>
             
    </tr>`;
       
          
        
      }
      // Setting innerHTML as tab variable
     
      if(tab)
      document.getElementById("Document12").innerHTML = tab;
    }



  function Join (data){
    var data  =data;
    $.ajax({
      type: "PUT",
      url: backendPort + "/group/joinGroup/" + data.groupID + '/' + username,
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

  function JoinGroup (element){
    var group_name = element.parentNode.parentNode.children[1].innerText
    $.ajax({
      type: "GET",
      url: backendPort + "/group/getGroupID/" + group_name,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
        Join(data);
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });

  }

  function AcceptGroup (element){
    var group_name = element.parentNode.parentNode.children[1].innerText
    $.ajax({
      type: "GET",
      url: backendPort + "/group/getGroupID/" + group_name,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
        Accept(data);
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });

  }


  function LeaveGroup (element){
    var group_name = element.parentNode.parentNode.children[1].innerText
    $.ajax({
      type: "GET",
      url: backendPort + "/group/getGroupID/" + group_name,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
        removeMember(data);
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });

  }

  function removeMember(data){
    $.ajax({
      type: "DELETE",
      url: backendPort + "/group/removeMember/" + data.groupID + '/' +username  +'/'+ data.members[0].userName ,
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

  function Accept(data){
    var groupID = data.groupID;
    $.ajax({
      type: "PUT",
      url: backendPort + "/group/joinGroup/" + data.groupID + '/' +username  ,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
        updateStatus(groupID)
        window.location.reload();
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });
  }

  function updateStatus (id){
    $.ajax({
      type: "PUT",
      url: backendPort + "/group/Updateinvite/" + id + '/' +username  ,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });
  }


  function Invite (element){
    var group_name = element.parentNode.parentNode.children[1].innerText
    $.ajax({
      type: "GET",
      url: backendPort + "/group/getGroupID/" + group_name,
      dataType: "json",
      encode: true,
      beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
      success: function(data) {
        add(data);
      },
      error: function(xhr, status, error) {
          console.log(status);
          console.log(error);
      }
  });

  }

function add (data){
  document.forms.invite.groupName.value = data.groupName;
        var height = $(document).height();
        $('#overlay').css({ 'height': height + 'px' }).show();
        $('#newClassroom').slideDown();
        $.ajax({
          type: "GET",
          url: backendPort + "/group/getUser",
          dataType: "json",
          encode: true,
          beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
          success: function(data) {
            var options = '';

            for (var i = 0; i < data.length; i++) {
              options += '<option value="' + data[i].username + '" />';
            }
            
            document.getElementById('browsers').innerHTML = options;
          },
          error: function(xhr, status, error) {
              console.log(status);
              console.log(error);
          }
      });
      

    $('#newClassroomForm').on('submit', function(e) {
        var formData = {
          AdminID: username,
          GroupID: data.groupID,
          Invite_TO: $("#newClassroomForm input[name=browser]").val(),
          Status: "NULL"
        };
        $.ajax({
            type: "POST",
            url: backendPort + "/analysis/sendInvite",
            data: formData,
            dataType: "json",
            encode: true,
            beforeSend: function(xhr) { xhr.setRequestHeader('x-auth-token', $.cookie("token")); },
            success: function(data) {
              $('#newClassroom').slideUp();
              $('#overlay').hide();
            },
            error: function(xhr, status, error) {
                console.log(status);
                console.log(error);
            }
        });
        e.preventDefault();
    });
};

