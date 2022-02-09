import {auth, createUserWithEmailAndPassword} from './firebase.js';

const signInForm = document.querySelector('#form-signin');
signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signInForm['inputEmail'].value;
  const password = signInForm['inputPassword'].value;

  console.log(email); 
  console.log(password);
  // sign up the user
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
});