import {db, database, storage} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL,deleteObject  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";


const dbref = ref(database);


const outer = document.querySelector('.outer');
const btns = document.querySelector(".Btns");
const personName = document.querySelector('.personName');
const description = document.querySelector('.description');





function deletefunc(num)
{
 
    get(child(dbref,"FeaturedStories")).then((snapshot)=>{
        if(snapshot.exists())
        {
            snapshot.forEach(node =>{
                //since the key for each dataset is randomized in firebase, 
                //we locate the particular dataset by going through each dataset with success-stories and checking if the
                // dataset's counter is same as the counter for story which needs to be deleted.

                if(node.val().Counter==num)
                {
                    remove(ref(database,"FeaturedStories/"+node.key))
                    //After the story is successfully removed, we reload the window. 
                    alert("The story has been removed as a featured story!")
                }

            })
        }
    })


    get(child(dbref,"success-stories")).then((snapshot)=>{
        if(snapshot.exists())
        {
            snapshot.forEach(node =>{
                //since the key for each dataset is randomized in firebase, 
                //we locate the particular dataset by going through each dataset with success-stories and checking if the
                // dataset's counter is same as the counter for story which needs to be deleted.
                if(node.val().counter==num)
                {
                    deleteObject(sRef(storage,`success-images/${node.val().fname}`))
                    remove(ref(database,"success-stories/"+node.key))
                    //After the story is successfully removed, we reload the window. 
                    alert("The story has been deleted!")
                    window.location.href = "success_stories.html";
                }

            })
        }
    })
}

window.deletefunc = deletefunc;




function makeFeaturedStory(num)
{
    //checks if the story that the admin is trying to make as a featured story
    var check = 0;
    get(child(dbref,"FeaturedStories")).then((snapshot)=>{
        if(snapshot.exists())
        {
                //goes through the counter of every featured story
                snapshot.forEach(node =>{
                    //checks if the story is already a featured story
                    if(node.val().Counter==num)
                    {
                        check = 1;
                    }
                })
                if(check == 0)
                {
                    push(ref(database,'FeaturedStories'),{
                    Counter: num
                    });
                    alert("The story has been added as a featured story!")
                }
                else
                {
                    alert("This story is already a featured story!")
                }
                location.reload()
            
        }
      })
}

window.makeFeaturedStory = makeFeaturedStory;


function removeFeaturedStory(num)
{
    get(child(dbref,"FeaturedStories")).then((snapshot)=>{
        if(snapshot.exists())
        {
            snapshot.forEach(node =>{
                //since the key for each dataset is randomized in firebase, 
                //we locate the particular dataset by going through each dataset with success-stories and checking if the
                // dataset's counter is same as the counter for story which needs to be deleted.

                if(node.val().Counter==num)
                {
                    remove(ref(database,"FeaturedStories/"+node.key))
                    //After the story is successfully removed, we reload the window. 
                    alert("The story has been removed as a featured story!")
                    location.reload();
                }

            })
        }
    })


}
window.removeFeaturedStory = removeFeaturedStory;



//This is called if the story is already a featured story. 
const createStory = (node) => {
    btns.innerHTML += `<a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="makeFeaturedstory" href="#"  onclick="makeFeaturedStory(${node.val().counter})" role="button" style="position: absolute; top: 30px; left: 440px;">Make this a featured story&nbsp; &nbsp;</a>
    <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="deletestory" onclick="deletefunc(${node.val().counter})" href="#" role="button"  style="position: absolute; top: 30px;right: 500px;">Delete this story&nbsp; &nbsp;</a> `

    outer.innerHTML +=  `<img src="${node.val().image}" alt=" "class="story-image">`;
    personName.innerHTML += node.val().name;
    description.innerHTML += node.val().desc;
}

//This is called if the story is not yet a featured story
const createStory2 = (node) => {
    btns.innerHTML += `<a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="makeFeaturedstory" href="#"  onclick="removeFeaturedStory(${node.val().counter})" role="button" style="position: absolute; top: 30px; left: 440px;">Remove this as a featured story&nbsp; &nbsp;</a>
    <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="deletestory" href="#" role="button" onclick="deletefunc(${node.val().counter})" style="position: absolute; top: 30px;right: 500px;">Delete this story&nbsp; &nbsp;</a> `

    outer.innerHTML +=  `<img src="${node.val().image}" alt=" "class="story-image">`;
    personName.innerHTML += node.val().name;
    description.innerHTML += node.val().desc;
}







var storyCounter= 0;


get(child(dbref,"success-stories")).then((snapshot)=>{
    if(snapshot.exists())
    {
        sessionStorage.temp = 0;

       //CurrentCounter stores the counter for the specific story which the reader wants to read.
       //So, we retrieve the story whose counter is equal to CurrentCounter.
       get(child(dbref,"CurrentCounter")).then((snapshot2)=>{
        if(snapshot2.exists())
        {

            //stores the counter of the story the reader wants to read
            storyCounter = snapshot2.val().counter;

            //Goes through every story
            snapshot.forEach(node =>{

                get(child(dbref,"FeaturedStories")).then((snapshot3)=>{
                    if(snapshot3.exists())
                    {
                            snapshot3.forEach(node2 =>{
                                
                                //Runs if the story is already a featured story
                                if(node.val().counter==storyCounter && node.val().counter==node2.val().Counter)
                                {
                                    createStory2(node);
                                    sessionStorage.temp = 1;

                                }  
                            })
                            
                //Runs if the story is not a featured story
                if (node.val().counter==storyCounter && sessionStorage.temp==0)
                {
                    createStory(node);
                }
 
                    }

                }
                )
            })

        }})
    }
  })
