var pageID;
var textValue;
var image;
var currentUser;
var userID;
var database;
var storageRef;
var file = null;
var noteText = "";
const realChooseFileBtn = document.getElementById("realChooseBtn");
const fakeChooseBtn = document.getElementById("choosePictureBtnID");

window.onload = function () {
    document.getElementById("textAreaID").innerHTML = "";
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    currentUser = firebase.auth().currentUser;
    userID = user.uid;
    database = firebase.database();

  } else {
    // No user is signed in.
      window.location.href = "http://localhost/licenta/index.html";
  }
});

function saveChanges() {

  var nodeDateFormat = new SimpleDateFormat("YYYY-MM-dd_HH:mm:ss_ss");
  var dataDateFormat = new SimpleDateFormat("EEE, dd MMM YYYY HH:mm");
  var nodeDate = nodeDateFormat.format(new Date());
  var dataDate = dataDateFormat.format(new Date());

  if (file == null) {
    $('#pictureModal').modal('show');
    return;
  } else if (document.getElementById("textAreaID").value.trim().length == 0) {
    $('#textModal').modal('show');
    return;
  } else {

    noteText = document.getElementById('textAreaID').value;
    var storageRef = firebase.storage().ref("NotesPhotos/" + file.name);

    //upload file
    var uploadTask = storageRef.put(file);
    var width = 0;
    uploadTask.on('state_changed', function(snapshot){
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;

    var elem = document.getElementById("myBar2");

    var id = setInterval(frame, 10);
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
    // var noteIDRef = firebase.database().ref("Notes/" + userID + "/" + pageID);
    storageRef = firebase.storage();
    var downloadURL = uploadTask.snapshot.downloadURL;
    firebase.database().ref("Notes/" + userID + "/" + nodeDate).set({
      data: dataDate,
      picture: downloadURL,
      text : noteText
    });

    window.location.href = "http://localhost/licenta/main_page.html";
  });
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

function SimpleDateFormat(formatString){
 this.formatString = formatString;
 this.monthNames = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 this.dayNames =   ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

 this.format = function(aDate){
 var localFormatString = formatString;
 // The order is significant
 /* YYYY */  localFormatString = localFormatString.replace(/Y{3,}/g,     "\" + (aDate.getFullYear()) + \"");
 /* YY   */  localFormatString = localFormatString.replace(/Y{2}/g,      "\" + ((aDate.getFullYear()).toString().substring(2)) + \"");
 /* MMMM */  localFormatString = localFormatString.replace(/M{4,}/g,     "\" + (this.monthNames[aDate.getMonth()]) + \"");
 /* MMM  */  localFormatString = localFormatString.replace(/M{3}/g,      "\" + ((this.monthNames[aDate.getMonth()]).substring(0,3)) + \"");
 /* MM   */  localFormatString = localFormatString.replace(/M{2}/g,      "\" + (aDate.getMonth()+101).toString().substring(1) + \"");
 /* dd   */  localFormatString = localFormatString.replace(/d{2}/g,      "\" + (aDate.getDate()+100).toString().substring(1) + \"");
 /* FF   */  localFormatString = localFormatString.replace(/F{2}/g,      "\" + (aDate.getDay()+100).toString().substring(1) + \"");
 /* EEEE */  localFormatString = localFormatString.replace(/E{4,}/g,     "\" + (this.dayNames[aDate.getDay()]) + \"");
 /* EEE  */  localFormatString = localFormatString.replace(/E{3}/g,      "\" + ((this.dayNames[aDate.getDay()]).substring(0,3)) + \"");
 /* EE   */  localFormatString = localFormatString.replace(/E{2}/g,      "\" + (aDate.getDay()+100).toString().substring(1) + \"");
 /* HH   */  localFormatString = localFormatString.replace(/H{2}/g,      "\" + (aDate.getHours()+100).toString().substring(1) + \"");
 /* kk   */  localFormatString = localFormatString.replace(/k{2}/g,      "\" + (aDate.getHours()+101).toString().substring(1) + \"");
 /* mm   */  localFormatString = localFormatString.replace(/m{2}/g,      "\" + (aDate.getMinutes()+100).toString().substring(1) + \"");
 /* ss   */  localFormatString = localFormatString.replace(/s{2}/g,      "\" + (aDate.getSeconds()+100).toString().substring(1) + \"");
 /* SS   */  localFormatString = localFormatString.replace(/S{2}/g,      "\" + (aDate.getMilliSeconds()+1000).toString().substring(1) + \"");

 localFormatString = "\"" + localFormatString + "\"";
 var formatedDate = eval(localFormatString);
 return(formatedDate);
 }
}
