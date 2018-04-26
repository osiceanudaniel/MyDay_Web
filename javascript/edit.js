var database;
var firebaseRef;
var userID;
var currentNode;
const modalBtn = document.getElementById("butonModal");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    database = firebase.database();
    userID = user.uid;
    firebaseRef = database.ref("Notes/" + userID);
    }
  });

  function editPage(id_page) {
    localStorage.setItem("pageID", id_page);
    window.location.href = "http://localhost/licenta/edit_page.html";
  }

  function deleteNote(nodeID) {
    currentNode = nodeID;
    modalBtn.click();
  }

  function deleteCurrentNote() {
    var noteReference = database.ref("Notes/" + userID + "/" + currentNode);
    //window.alert("Notes REF: " + noteReference);
    noteReference.once("value").then(function(snapshot) {
        var image = snapshot.child("picture").val();
        // window.alert("IMAGE REF: " + image);
        var urlRef = storageRef.refFromURL(image);
        urlRef.delete().then(function() {
          noteReference.remove();
          $('#myModal').modal('hide');
          location.reload();
        }).catch(function(error) {
          window.alert("Image could not be deleted!");
        });
      });
  }
