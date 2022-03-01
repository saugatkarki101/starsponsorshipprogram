import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from './firebase.js';

// Log In
const signInForm = document.querySelector('#form-signin');
if(signInForm){
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // get user info
        const email = signInForm['inputEmail'].value;
        const password = signInForm['inputPassword'].value;
      
        console.log(email); 
        console.log(password);
        // Sign in the user
        signInWithEmailAndPassword (auth, email, password)
        .then((userCredential) => {
      
              const user = userCredential.user;
              console.log(user);
              signInForm.reset();
              // Redirects to home page if user successfully logs in
              // window.location.href = "/Star%20Website%20First%20draft/index.html";
        })
        .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode);
              console.log(errorMessage);
      
        });
      });
      

}

// Log Out
const logOut = document.getElementById("logout");

if(logOut){
    logOut.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
        console.log("Successfully logged out.");
     })
}

// Check User Status
onAuthStateChanged(auth, (user) => {
    // Elements to show/hide
    const logOut = document.getElementById("logout");
    const signIn = document.getElementById("hide-auth");
    const saveChanges = document.getElementById("saveChanges");

    if(user) {
        const uid = user.uid;

        if(logOut) {logOut.style.display = "block"};
        if(signIn) {signIn.style.display = "none"};
        if(saveChanges) {saveChanges.style.display = "block"};

        
        // Redirects to home page when user is logged in
        console.log("Check Status: User signed in.");
    }
    else {
        if(logOut) {logOut.style.display = "none"};
        if(signIn) {signIn.style.display = "block"};
        if(saveChanges) {saveChanges.style.display = "none"};
        console.log("Check Status: User logged out.");
    }
});