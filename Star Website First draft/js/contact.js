import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref as sRef, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

document.querySelector(".contact-form").addEventListener("submit", submitForm); 

const dbref = sRef(database, 'ContactFormParents');
const dbref2 = sRef(database, 'ContactFormSponsors');

//If data is stored in "title" within Firebase, it is retrieved and set to the HTML element with id: "title"

function submitForm(e)
{
    e.preventDefault();
    
    $(document).ready(function()
    {
      $("#name").removeClass("is-invalid");
      $("#name").removeClass("is-invalid");
      $("#phone").removeClass("is-invalid");
      $("#email").removeClass("is-invalid");
      $("#subject").removeClass("is-invalid");
      $("#message").removeClass("is-invalid");
      
      //Get Inputs
      let parentsponsor = document.getElementsByName("parentsponsor"); //Radio button
      let name = document.getElementById("name").value;
      let phone = document.getElementById("phone").value;
      let email = document.getElementById("email").value;
      let subject = document.getElementById("subject").value;
      let message = document.getElementById("message").value;
      let date = new Date();
      let day = date.getDate().toString();
      let month = date.getMonth().toString();
      let year = date.getFullYear().toString();
      date = month + "/" + day + "/" + year;


      //Validation
      
      if(!name)
      {
        $("#name").addClass("is-invalid");
        return;
      }
      if(!phone)
      {
        $("#phone").addClass("is-invalid");
        return;
      }
      if(!email)
      {
        $("#email").addClass("is-invalid");
        return;
      }
      if(!subject)
      {
        $("#subject").addClass("is-invalid");
        return;
      }
      if(!message)
      {
        $("#message").addClass("is-invalid");
        return;
      }

      // Retrive radio button values
      var parentsponsorvalue = "";
      for(var i = 0; i < parentsponsor.length; i++){
        if(parentsponsor[i].checked){
          parentsponsorvalue = parentsponsor[i].value;
        }
      }

      var parents = false; 
      if(parentsponsorvalue=="parents"){
        parents = true;
      }
      var contactData = {
  
        "Name": name,
        "Phone": phone,
        "Email": email,
        "Subject": subject,
        "Message": message,
        "Date": date
      }

      if(parents){
        const newPostRef = push(dbref);
        set(newPostRef, contactData);
      }
      else{
        const newPostRef = push(dbref2);
        set(newPostRef, contactData);
      }

      alert("Message Sent");

      //console.log(name, email, message)
      //Reset the contact form
      document.querySelector(".contact-form").reset();
      
      //sendEmail(name, email, message, subject, phone);
      //alert("Message Sent!");
    });
}

//The function to send data from the message
function sendEmail(name, email, message, subject, phone) {
  Email.send({
    Host : "smtp.gmail.com",
    Username : "cse4317@gmail.com",
    Password : "zkjydyvnssvzezww",
    To : 'potebishesh@gmail.com',
    From : "cse4317@gmail.com",
    Subject: `${subject}`,
    Body: `Name: ${name} <br/> Email: ${email} <br/> Phone: ${phone} <br/> Message: ${message}`
  }).then(
  message => alert("Message was sent successfully!")
  );
}





