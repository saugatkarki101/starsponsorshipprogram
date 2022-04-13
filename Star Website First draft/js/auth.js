import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, updatePassword} from './firebase.js';

// Change Password
const changePasswordForm = document.querySelector('#form-changePassword');
if(changePasswordForm){
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPassword = changePasswordForm['inputPassword'].value;
        const user = auth.currentUser;


        updatePassword(user, newPassword).then(() => {
            //Update Successful
            document.getElementById("CP_Header").style.display = "none";
            document.getElementById("inputPassword").style.display = "none";
            document.getElementById("CP_Done").style.display = "none";
            document.getElementById("CP_Message").style.display = "block";

        }).catch((error) => {
            //Error
        });

    })

}



// Log In
const signInForm = document.querySelector('#form-signin');
if(signInForm){
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // get user info
        const email = signInForm['inputEmail'].value;
        const password = signInForm['inputPassword'].value;
        // Sign in the user
        signInWithEmailAndPassword (auth, email, password)
        .then((userCredential) => {
            //   const user = userCredential.user;
            //   console.log(user);
              signInForm.querySelector('.error').innerHTML = '';
              signInForm.reset();
              // Redirects to home page if user successfully logs in
              window.location.href = "index.html";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = "Error! Please try again.";
            if(errorCode == "auth/invalid-email") {
                errorMessage =  "Invalid Email. Please enter a valid email."
            }
            else if(errorCode == "auth/invalid-password" || errorCode == "auth/invalid-password-hash" || errorCode == "auth/invalid-password-salt" || errorCode == "auth/wrong-password") {
                errorMessage = "Invalid Password. Please try again."
            }
            else if(errorCode == "auth/email-already-exists") {
                errorMessage = "Email already exists. Please try a different email or login using the entered email."
            }
            else if(errorCode == "auth/user-not-found") {
                errorMessage = "User Not Found. Please try a different email."
            }
            else {
                errorMessage = "Error Authenticating. Please try again."
            }
            signInForm.querySelector('.error').innerHTML = errorMessage;
        });
      });
}

// Forgot Password
const forgotpassword = document.querySelector('#form-forgotPassword');

if(forgotpassword){
    forgotpassword.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = forgotpassword['inputEmail'].value;
        console.log(email);
        sendPasswordResetEmail(auth, email).then(() => {
            console.log('Password Reset Email Sent Successfully!');
            document.getElementById("FP_Header").style.display = "none";
            document.getElementById("inputEmail").style.display = "none";
            document.getElementById("FP_Send").style.display = "none";
            document.getElementById("FP_Message").style.display = "block";

            forgotpassword.querySelector('.error').innerHTML = '';
        })
        .catch(error => {
            var errorCode = error.code;
            var errorMessage = "Error! Please try again.";
            if(errorCode == "auth/invalid-email") {
                errorMessage =  "Invalid Email. Please enter a valid email."
            }
            else if(errorCode == "auth/invalid-password") {
                errorMessage = "Invalid Password. Please try again."
            }
            else if(errorCode == "auth/email-already-exists") {
                errorMessage = "Email already exists. Please try a different email or login using the entered email."
            }
            else if(errorCode == "auth/user-not-found") {
                errorMessage = "User Not Found. Please try a different email."
            }
            else {
                errorMessage = "Error Authenticating. Please try again."
            }
            forgotpassword.querySelector('.error').innerHTML = errorMessage;
        })
    })
}

// function getErrorMessage(errorCode) {
//     if(errorCode == "auth/invalid-email") {
//         return "Invalid Email. Please enter a valid email."
//     }
//     else if(errorCode == "auth/invalid-password") {
//         return "Invalid Password. Please try again."
//     }
//     else if(errorCode == "auth/email-already-exists") {
//         return "Email already exists. Please try a different email or login using the entered email."
//     }
//     else {
//         return "Error Authenticating. Please try again."
//     }
// }

// Log Out
const logOut = document.getElementById("logout");

if(logOut){
    logOut.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
        console.log("Successfully logged out.");
     })
}

//----- NavBar Logout Button ----//
var checkNavLog = document.getElementById('navLogout');

if(checkNavLog)
{
  checkNavLog.addEventListener('click', e => {
    alert("User is Now Logged Out!");
    auth.signOut();
        console.log("Successfully logged out.");
  })
}



// Check User Status
onAuthStateChanged(auth, (user) => {
    // Elements to show/hide
    const signIn = document.getElementById("hide-auth");
    const saveChanges = document.getElementById("saveChanges");
    const navLogoutBtn = document.getElementById("navLogout");
    const donate = document.getElementById("donate");
    const adminButton = document.getElementById("adminLogin");
    const addUsers = document.getElementById("addUsers");
    const changePassword = document.getElementById("changePassword");
    const fab = document.getElementById("fab-btn");
    //const deleteBlog = document.getElementById("deleteBlog");
    //const removeFeature = document.getElementById("makeFeaturedBlog");

    //Find All ContentEditable Boxes and disable
    var editable_elements = document.querySelectorAll("[contenteditable=true]");

    for(var i=0; i<editable_elements.length; i++)
        editable_elements[i].setAttribute("contenteditable", false);

    if(user) {
        const uid = user.uid;

        //Allow content editables to be manipulated by user
        editable_elements = document.querySelectorAll("[contenteditable=false]");

        for(var i=0; i<editable_elements.length; i++)
            editable_elements[i].setAttribute("contenteditable", true);

        if(signIn) {signIn.style.display = "none"};
        if(saveChanges) {saveChanges.style.display = "block"};
        if(navLogoutBtn) {navLogoutBtn.style.display = "block"};
        if(donate) {donate.style.display = "none"};
        if(adminButton) {adminButton.style.display = "none"};
        //if(addUsers) {addUsers.style.display = "block"};
        if(changePassword) {changePassword.style.display = "block"};
        if(fab) {fab.style.display = "none"};
        
        //Make buttons available if admin is signed in
        //if(deleteBlog) {deleteBlog.style.display = "block"}; 
        //if(removeFeature) {removeFeature.style.display = "block"};
        // Redirects to home page when user is logged in
        console.log("Check Status: Admin signed in.");
    }
    else {
        if(signIn) {signIn.style.display = "block"};
        if(saveChanges) {saveChanges.style.display = "none"};
        if(navLogoutBtn) {navLogoutBtn.style.display = "none"};
        if(donate) {donate.style.display = "block"};
        if(adminButton) {adminButton.style.display = "block"};
        if(fab) {fab.style.display = "flex"};
        //if(addUsers) {addUsers.style.display = "none"};
        if(changePassword) {changePassword.style.display = "none"};
        //if(deleteBlog) {deleteBlog.style.display = "none"}; 
        //if(removeFeature) {removeFeature.style.display = "none"};
        console.log("Check Status: Admin logged out.");
    }
});

//test
