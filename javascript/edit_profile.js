const realChooseFileBtn = document.getElementById("upload_image");
const fakeChooseBtn = document.getElementById("changePictureBtnID");
var currentUser;
var userID;
var image = null;
var imageName = null;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = firebase.auth().currentUser;
    userID = user.uid;

    //set username
    var userIDRef = firebase.database().ref("Users/" + userID);
    var username;

    userIDRef.once("value").then(function(snapshot) {
        username = snapshot.child("username").val();
        var currentImage = snapshot.child("profilePicture").val();

        document.getElementById("username_id").innerHTML = username;
        document.getElementById("username_drawer_id").innerHTML = username;
        document.getElementById("textAreaID").innerHTML = username;
        document.getElementById("imageID").src = currentImage;
      });
  } else {
    // No user is signed in.
      window.location.href = "http://localhost/licenta/index.html";
  }
});

fakeChooseBtn.addEventListener("click", function() {
  realChooseFileBtn.click();
});

$(document).ready(function(){

 $image_crop = $('#image_demo').croppie({
    enableExif: true,
    viewport: {
      width:200,
      height:200,
      type:'circle'
    },
    boundary:{
      width:300,
      height:300
    }
  });

  $('#upload_image').on('change', function(){
    var reader = new FileReader();
    reader.onload = function (event) {
      $image_crop.croppie('bind', {
        url: event.target.result
      }).then(function(){
        console.log('jQuery bind complete');
      });
    }
    reader.readAsDataURL(this.files[0]);
    image = this.files[0];
    imageName = this.files[0].name;
    $('#uploadimageModal').modal('show');
  });

  $('.crop_image').click(function(event){
    $image_crop.croppie('result', {
      type: 'blob',
      size: 'viewport',
      format: 'jpeg'
    }).then(function(response){
      console.log("base64 : " + response);
        image = response;
        $('#uploadimageModal').modal('hide');
        var blob1 = new Blob([image]);
        var url = URL.createObjectURL(blob1, { oneTimeOnly: true });
        document.getElementById("imageID").src = url;
      //  document.getElementById("imageID").src = response;
    })
  });

});

function saveChanges() {

  modifiedUsername = document.getElementById('textAreaID').value;
  if (modifiedUsername != null || modifiedUsername.trim().length != 0) {
    firebase.database().ref("Users/" + userID).update({
      username: modifiedUsername
    });
  }

  if (image != null) {
    //storage reference
    var storageRef = firebase.storage().ref("ProfilePictures/" + imageName);

    //upload file
    var uploadTask = storageRef.put(image);
    var width = 0;
    uploadTask.on('state_changed', function(snapshot){
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes)*10;

    var elem = document.getElementById("myBar");

    var id = setInterval(frame, 1);
    function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width += parseInt(progress);
      elem.style.width = width + '%';
      elem.innerHTML = width * 1  + '%';
    }
  }

    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }

  }, function(error) {
    window.alert(error);
  }, function() {

    var userRef = firebase.database().ref("Users/" + userID);
    storageRef = firebase.storage();
    userRef.once("value").then(function(snapshot) {
        var pictureDatabaseRef = snapshot.child("profilePicture").val();

        var urlRef = storageRef.refFromURL(pictureDatabaseRef);
        urlRef.delete().then(function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          firebase.database().ref("Users/" + userID).update({
            profilePicture: downloadURL
          });

          window.location.href = "http://localhost/licenta/main_page.html";
        }).catch(function(error) {
          window.alert("EROARE");
        });
      });

  });
  } else {
    window.location.href = "http://localhost/licenta/main_page.html";
  }
}

function logout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful. Redirect user to login/register page
  window.location.href = "http://localhost/licenta/index.html";
  }).catch(function(error) {
    // An error happened.
  });
}
