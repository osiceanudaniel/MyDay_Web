var pageID;
var textValue;
var image;
var currentUser;
var userID;
var database;
var storageRef;
var file = null;
var modifiedText = "";
const realChooseFileBtn = document.getElementById("realChooseBtn");
const fakeChooseBtn = document.getElementById("changePictureBtnID");

window.onload = function () {
    pageID = localStorage.getItem("pageID");
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    currentUser = firebase.auth().currentUser;
    userID = user.uid;
    database = firebase.database();
    var currentNote = firebase.database().ref("Notes/" + userID + "/" + pageID);
    currentNote.once("value").then(function(snapshot) {
        textValue = snapshot.child("text").val();
        image = snapshot.child("picture").val();

        document.getElementById("textAreaID").innerHTML = textValue;
        document.getElementById("imageViewID").src = image;
      });

  } else {
    // No user is signed in.
      window.location.href = "http://localhost/licenta/index.html";
  }
});

function saveChanges() {
  var uploader = document.getElementById("uploader");
  modifiedText = document.getElementById('textAreaID').value;
  if (modifiedText != null || modifiedText.trim().length != 0) {
    firebase.database().ref("Notes/" + userID + "/" + pageID).update({
      text: modifiedText
    });
  }

  if (file != null) {
    //storage reference
    var storageRef = firebase.storage().ref("NotesPhotos/" + file.name);

    //upload file
    var uploadTask = storageRef.put(file);
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

    var noteIDRef = firebase.database().ref("Notes/" + userID + "/" + pageID);
    storageRef = firebase.storage();
    noteIDRef.once("value").then(function(snapshot) {
        var pictureDatabaseRef = snapshot.child("picture").val();

        var urlRef = storageRef.refFromURL(pictureDatabaseRef);
        urlRef.delete().then(function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          firebase.database().ref("Notes/" + userID + "/" + pageID).update({
            picture: downloadURL
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

realChooseFileBtn.addEventListener("change", function(e){
  //display defaultSelectImage
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("realChooseBtn").files[0]);
  oFReader.onload = function (oFREvent) {
      document.getElementById("imageViewID").src = oFREvent.target.result;
  };

  //get the file
  file = e.target.files[0];

});

fakeChooseBtn.addEventListener("click", function() {
  realChooseFileBtn.click();
});

function logout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful. Redirect user to login/register page
  window.location.href = "http://localhost/licenta/index.html";
  }).catch(function(error) {
    // An error happened.
  });
}
