import {db, database, storage} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";


const dbref = ref(database);


const outer = document.querySelector('.outer');
const personName = document.querySelector('.personName');
const description = document.querySelector('.description');


//
const createStory = (node) => {
    outer.innerHTML +=  `<img src="${node.val().image}" alt=" "class="story-image">`;
    personName.innerHTML += node.val().name;
    description.innerHTML += node.val().desc;
}

//
var storyCounter= 0;

//
get(child(dbref,"success-stories")).then((snapshot)=>{
    if(snapshot.exists())
    {
       //CurrentCounter stores the counter for the specific story which the reader wants to read.
       //So, we retrieve the story whose counter is equal to CurrentCounter.
       get(child(dbref,"CurrentCounter")).then((snapshot2)=>{
        if(snapshot2.exists())
        {
            //stores the counter of the story the reader wants to read
            storyCounter = snapshot2.val().counter;

            //Goes through every story
            snapshot.forEach(node =>{
                if(node.val().counter==storyCounter)
                {
                    createStory(node);
                }
            })

        }})
    }
  })
