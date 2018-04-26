var registerVar = false;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if (registerVar == true) {
      console.log("REGISTER IS TRUE");
    } else {
      window.location.href = "http://localhost/licenta/main_page.html";
    }

  }
});

const realChooseFileBtn = document.getElementById("upload_image");
const fakeChooseBtn = document.getElementById("changePictureBtnID");
var image = null;
var imageName = null;

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

function login() {

  var email = document.getElementById("login_email_field").value;
  var password = document.getElementById("login_password_field").value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error: " + errorMessage);

});

}

function register() {

  var username1 = document.getElementById("register_username_field").value;
  var email = document.getElementById("register_email_email").value;
  var password = document.getElementById("register_password_field").value;
  var confirmPassword = document.getElementById("register_confirm_password_field").value;
  registerVar = true;

  if (image == null) {
    window.alert("Please select an image!");
    return;
  } else if (password.localeCompare(confirmPassword) != 0) {
    window.alert("Passwords do not match!");
    return;
  } else if (username1.trim().length == 0) {
    window.alert("Insert a username!");
    return;
  } else if (email.trim().length == 0) {
    window.alert("Insert an email!");
    return;
  } else if (password.trim().length == 0) {
    window.alert("Insert password!");
    return;
  } else if (password.length < 8) {
    window.alert("Password must have at least 8 characters!");
    return;
  } else {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {

          // User is signed in.
          var storageRef = firebase.storage().ref("ProfilePictures/" + imageName);

          //upload file
          window.alert(image);
          var uploadTask = storageRef.put(image);
          uploadTask.on('state_changed', function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;

          var elem = document.getElementById("myBar2");

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
          // var noteIDRef = firebase.database().ref("Notes/" + userID + "/" + pageID);
          storageRef = firebase.storage();
          var downloadURL = uploadTask.snapshot.downloadURL;

          var  currentUser = firebase.auth().currentUser;
          var  userID = user.uid;
          firebase.database().ref('Users/' + userID).set({
            profilePicture: downloadURL,
            username: username1
            });

          $('#myModal').modal('show');
          });

    }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
   }

}

function redirect() {
  window.location.href = "http://localhost/licenta/main_page.html";
}
