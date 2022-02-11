import {db, database} from './firebase.js';
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import {getDatabase, ref, set, child, update, remove, get} from 
"https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

//Initializing an instance of the database stored in the firebase. 
const dbref = ref(database);

//If data is stored in "title" within Firebase, it is retrieved and set to the HTML element with id: "title"
get(child(dbref,"title")).then((snapshot)=>{
    if(snapshot.exists())
    {
        var titleDatabase = snapshot.val().info;
        document.getElementById("title").innerHTML = titleDatabase;
    }
})

get(child(dbref,"titleDescription")).then((snapshot)=>{
    if(snapshot.exists())
    {
        var titleDatabase = snapshot.val().info;
        document.getElementById("titleDescription").innerHTML = titleDatabase;
    }
})



//The function to save the changes made by the admin 
function save()
{
  //Retrieves the contents of the HTML element with id: 'title' and updates database with the same content
  var editTitleContent = document.getElementById('title').innerHTML;
  update(ref(database,'title'),{
    info: editTitleContent
});

//Retrieves the contents of the HTML element with id: 'titleDescription' and updates database with the same content
var editTitleDescripContent = document.getElementById('titleDescription').innerHTML;
update(ref(database,'titleDescription'),{
  info: editTitleDescripContent
});

//Sends a notification when all the contents are saved. 
alert("Changes Saved!")
}

//Checks if a HTML element with id: 'SaveChanges' is present. 
var check = document.getElementById('saveChanges');

if(check)
{
  //When the "Save Changes" button is clicked, it calls the save function.
  check.addEventListener
  ('click', e =>
  {
  save();
  }
  )
}