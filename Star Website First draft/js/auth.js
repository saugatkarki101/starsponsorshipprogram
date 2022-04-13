import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from './firebase.js';


// Log In
const signInForm = document.querySelector('#form-signin');
signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signInForm['inputEmail'].value;
  const password = signInForm['inputPassword'].value;

  console.log(email); 
  console.log(password);
  // sign up the user
  signInWithEmailAndPassword (auth, email, password)
  .then((userCredential) => {

        const user = userCredential.user;
        console.log(user);
        signInForm.reset();
  })
  .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
  });
});

// Log Out
const logOut = document.querySelector('#logout');
logOut.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
 })


 // Check User Status
onAuthStateChanged(auth, (user) => {
    if(user) {
        const uid = user.uid;
        console.log("Check Status: User signed in.");
    }
    else {
        console.log("Check Status: User logged out.");
    }
});