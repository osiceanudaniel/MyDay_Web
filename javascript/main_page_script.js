var currentUser;
var userID;
var database;
var storageRef;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    currentUser = firebase.auth().currentUser;
    userID = user.uid;
    database = firebase.database();

    //set username
    var userIDRef = firebase.database().ref("Users/" + userID);
    var username;
    userIDRef.once("value").then(function(snapshot) {
        username = snapshot.child("username").val();
        document.getElementById("username_id").innerHTML = username;
        document.getElementById("username_drawer_id").innerHTML = username;
      });

      var userIDRef = firebase.database().ref("Users/" + userID);
      storageRef = firebase.storage();
      userIDRef.once("value").then(function(snapshot) {
          var profilePictureDatabaseRef = snapshot.child("profilePicture").val();

          var urlRef = storageRef.refFromURL(profilePictureDatabaseRef);
          urlRef.getDownloadURL().then(function(url) {
              var test = url;
              document.getElementById("imageID").src = test;

          }).catch(function(error) {
            window.alert("EROARE: " + error);
        });
       });

       var firebaseRef = database.ref("Notes/" + userID);
       firebaseRef.on('value', gotData, gotError);

  } else {
    // No user is signed in.
      window.location.href = "http://localhost/licenta/index.html";
  }
});
var x = 0;
function gotData(data) {
  if (data.val() != null) {
    var notes = data.val();
    var keys = Object.keys(notes);

    var x = [];

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var text = notes[key].text;
      var data = notes[key].data;
      var imageRef = notes[key].picture;

      var child = `
      <div class="well">
          <div class="media">
            <a class="pull-left" id="imageID2" href="${imageRef}" target="_blank">
              <img id="myImg" alt="Image not found ..." class="media-object" src="${imageRef}" style="width: 200px; height: 200px; margin-right: 10px">
            </a>
          <div class="media-body">
            <h4 style="border-bottom: 1px solid; border-bottom-color: #448AFF; font-size: 25px" class="media-heading"><b>${data}</b></h4>
              <p id="textID" style="margin-top: 20px; font-size: 18px; color: #777777">${text}</p>
           </div>
           <button id="${key}" onclick="deleteNote(this.id)" style="margin-top: 80px; float: right; margin-left: 25px" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
              Delete <i class="material-icons">delete</i>
           </button>
           <button id="${key}" onclick="editPage(this.id)" style="margin-top: 80px; float: right" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
              Edit <i class="material-icons">mode_edit</i>
           </button>
        </div>
      </div>
        `;
      var div = document.getElementById('list_elements');
      div.innerHTML += child;
    }
  } else {
    var child = `
    <center style="margin-top: 200px">
      <h1 style="color: #abaeb2">There are no notes!</h1>
    </center>
      `;
    var div = document.getElementById('list_elements');
    div.innerHTML += child;
  }

}

function gotError(error) {
    console.log("ERROR: ");
    console.log(error);
}

function logout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful. Redirect user to login/register page
  window.location.href = "http://localhost/licenta/index.html";
  }).catch(function(error) {
    // An error happened.
  });
}

function addNote() {
  window.location.href = "http://localhost/licenta/add_note_page.html";
}
