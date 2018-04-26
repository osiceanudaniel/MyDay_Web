firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.location.replace("http://localhost/licenta/main_page.html");
    var user = firebase.auth().currentUser;
  } else {
    // No user is signed in.
  }
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

  var email = document.getElementById("register_email_email").value;
  var password = document.getElementById("register_password_field").value;
  var confirmPassword = document.getElementById("register_confirm_password_field").value;

  window.alert(email + ": " + password);

  if (password.localeCompare(confirmPassword) == 0) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error: " + errorMessage);

    });
  } else {
    window.alert("Passwords do not match!");
  }

}
