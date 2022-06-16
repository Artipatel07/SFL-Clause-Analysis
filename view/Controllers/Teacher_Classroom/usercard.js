//fetch profile picture
let profilePic = {}
let user = "ObjectId('"+idofuser+ "')"
getProfilePic();


async function getProfilePic(){ 
  profilePic = await profilePicture();
  $( '#profileButton, #editProfilePic' ).attr("src",port2+ 'Pic/GetProfilePic/ObjectId("'+profilePic.metadata+'")');
}



async function profilePicture() {
  return new Promise(function(resolve, reject) {
    $.get(
      port2 + "Pic/Profile/"+idofuser,
      function(data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}




