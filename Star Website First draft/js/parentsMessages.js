import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref as sRef, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";


const dbref = sRef(database);

const messageSection = document.querySelector('.message-section');

function createLine(node){
    const email = node.val().Email;
    const name = node.val().Name;
    const message = node.val().Message;
    const phone = node.val().Phone;
    const subject = node.val().Subject;
    const date = node.val().Date;

    messageSection.innerHTML = `<tr>
        <td>${date}</td>
        <td>${name}</td>
        <td>${email}</td>
        <td>${subject}</td>
        <td>${phone}</td>
        <td>${message}</td>
    </tr>` + messageSection.innerHTML;

}

get(child(dbref, 'ContactFormParents')).then((snapshot) => {
  if (snapshot.exists()) {
    snapshot.forEach(node =>{
        //every dataset related to every story is passed one by one to createCards() function
        createLine(node);   
    }
    )

    messageSection.innerHTML = `<tr>
    <th>Date</th>
    <th>Name</th>
    <th>Email</th>
    <th>Subject</th>
    <th>Phone</th>
    <th>Message</th>
    </tr>` + messageSection.innerHTML;
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});