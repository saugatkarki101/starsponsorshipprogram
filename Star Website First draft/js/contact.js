document.querySelector(".contact-form").addEventListener("submit", submitForm);


function submitForm(e)
{
    e.preventDefault();
    
    $(document).ready(function()
    {
      $("#name").removeClass("is-invalid");
      $("#phone").removeClass("is-invalid");
      $("#email").removeClass("is-invalid");
      $("#subject").removeClass("is-invalid");
      $("#message").removeClass("is-invalid");
      
      //Get Inputs
      let name = document.getElementById("name").value;
      let phone = document.getElementById("phone").value;
      let email = document.getElementById("email").value;
      let subject = document.getElementById("subject").value;
      let message = document.getElementById("message").value;

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
      
      //console.log(name, email, message)
      //Reset the contact form
      document.querySelector(".contact-form").reset();
      
      sendEmail(name, email, message, subject, phone);
      //alert("Message Sent!");
    });
}

//The function to send data from the message
function sendEmail(name, email, message, subject, phone) {
  Email.send({
    Host : "smtp.gmail.com",
    Username : "cse4317@gmail.com",
    Password : "zkjydyvnssvzezww",
    To : 'miklo14@gmail.com',
    From : "cse4317@gmail.com",
    Subject: `${subject}`,
    Body: `Name: ${name} <br/> Email: ${email} <br/> Phone: ${phone} <br/> Message: ${message}`
  }).then(
  message => alert("Message was sent successfully!")
  );
}





