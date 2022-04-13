import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const user = auth.currentUser;
const dbref = ref(database);
const dbref2 = ref(database);


const outer = document.querySelector('.outer');
const blogTitle = document.querySelector('.blogTitle');
const description = document.querySelector('.description');
//const deleteBlog = document.querySelector('#deleteBlog');
const btns = document.querySelector('.Btns');



console.log("cheak")


// Check User Status
onAuthStateChanged(auth, (user) => {
    // Elements to show/hide
    const deleteBlog = document.getElementById("deleteBlog");
    const removeFeature = document.getElementById("makeFeaturedBlog");

    if(user) {
        const uid = user.uid;
        
        //Make buttons available if admin is signed in
        deleteBlog.style.display = "block";
        removeFeature.style.display = "block";
     
        console.log("Check Status: Admin signed in.");
    }
    else {
        deleteBlog.style.display = "none"; 
        removeFeature.style.display = "none";
        console.log("Check Status: Admin logged out.");
    }
});


function deletefunc(num)
{
 
    get(child(dbref,"FeaturedBlogs")).then((snapshot)=>{
        if(snapshot.exists())
        {
            snapshot.forEach(node =>{
                //since the key for each dataset is randomized in firebase, 
                //we locate the particular dataset by going through each dataset with success-stories and checking if the
                // dataset's counter is same as the counter for story which needs to be deleted.

                if(node.val().Counter==num)
                {
                    remove(ref(database,"FeaturedBlogs/"+node.key))
                    //After the story is successfully removed, we reload the window. 
                    alert("The blog has been removed as a featured blog!")
                }

            })
        }
    })


            get(child(dbref,"blogs")).then((snapshot)=>{
                if(snapshot.exists())
                {
                    snapshot.forEach(node =>{
                        //since the key for each dataset is randomized in firebase, 
                        //we locate the particular dataset by going through each dataset with success-stories and checking if the
                        // dataset's counter is same as the counter for story which needs to be deleted.
 
                        if(node.val().counter==num)
                        {
                            deleteObject(sRef(storage,`blog-images/${node.val().fname}`))
                            remove(ref(database,"blogs/"+node.key))
                            //After the story is successfully removed, we reload the window. 
                            alert("The blog has been deleted!")
                            //location.reload()
                            window.location.href = "blog.html";
                        }

                    })
                }
            })
}

window.deletefunc = deletefunc;


function makeFeaturedBlog(num)
{
    //checks if the blog that the admin is trying to make as a featured blog
    var check = 0;
    get(child(dbref,"FeaturedBlogs")).then((snapshot)=>{
        if(snapshot.exists())
        {
                //goes through the counter of every featured blog
                snapshot.forEach(node =>{
                    if(node.val().Counter==num)
                    {
                        check = 1;
                    }
                })
                if(check == 0)
                {
                    push(ref(database,'FeaturedBlogs'),{
                    Counter: num
                    });
                    alert("The blog has been added as a featured blog!")
                }
                else
                {
                    alert("This blog is already a featured blog!")
                }
                location.reload()
            
        }
      })
}

window.makeFeaturedBlog = makeFeaturedBlog;


function removeFeaturedBlog(num)
{
    get(child(dbref,"FeaturedBlogs")).then((snapshot)=>{
        if(snapshot.exists())
        {
            snapshot.forEach(node =>{
                //since the key for each dataset is randomized in firebase, 
                //we locate the particular dataset by going through each dataset with success-stories and checking if the
                // dataset's counter is same as the counter for story which needs to be deleted.

                if(node.val().Counter==num)
                {
                    remove(ref(database,"FeaturedBlogs/"+node.key))
                    //After the story is successfully removed, we reload the window. 
                    alert("The blog has been removed as a featured blog!")
                    location.reload();
                }

            })
        }
    })


}












window.removeFeaturedBlog = removeFeaturedBlog;


const createBlog = (node) => {
    btns.innerHTML += `<a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="makeFeaturedBlog" href="#"  onclick="makeFeaturedBlog(${node.val().counter})" role="button" style="position: absolute; left: 500px;">Make this a featured blog&nbsp; &nbsp;</a>
    <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="deleteBlog" href="#" role="button" onclick="deletefunc(${node.val().counter})" style="position: absolute; right: 500px;">Delete this blog&nbsp; &nbsp;</a> `

    outer.innerHTML +=  `<img src="${node.val().image}" alt="" class="story-image img-fluid" height="650" width="550">`;
    blogTitle.innerHTML += node.val().name;
    description.innerHTML += node.val().desc;    
}

const createBlog2 = (node) => {
    btns.innerHTML += `<a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="makeFeaturedBlog" href="#"  onclick="removeFeaturedBlog(${node.val().counter})" role="button" style="position: absolute; left: 500px;">Remove this as a featured blog&nbsp; &nbsp;</a>
    <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="deleteBlog" href="#" role="button" onclick="deletefunc(${node.val().counter})" style="position: absolute; right: 500px;">Delete this blog&nbsp; &nbsp;</a> `

    outer.innerHTML +=  `<img src="${node.val().image}" alt="" class="story-image img-fluid" height="650" width="550">`;
    blogTitle.innerHTML += node.val().name;
    description.innerHTML += node.val().desc;
}


//
var blogCounter;
//checks if the blog is a featured blog or not. 
let temp = 0;

//
get(child(dbref,"blogs")).then((snapshot)=>{
    if(snapshot.exists())
    {
        sessionStorage.temp = 0;

       //CurrentCounter stores the counter for the specific blog which the reader wants to read. 
       //So, we retrieve the blog whose counter is equal to CurrentCounter. 
       get(child(dbref,"CurrentBlogCounter")).then((snapshot2)=>{
        if(snapshot2.exists())
        {
          
            //value is reset for every new loop
            //stores the counter of the blog the reader wants to read
            blogCounter = snapshot2.val().counter;   

            //Goes through every blog
            snapshot.forEach(node =>{
                if(node.val().counter==blogCounter)
                {
                    console.log("sike!");
                }
    
                console.log("temp1",sessionStorage.temp)

                get(child(dbref,"FeaturedBlogs")).then((snapshot3)=>{
                    if(snapshot3.exists())
                    {

                            snapshot3.forEach(node2 =>{

                                if(node.val().counter==blogCounter && node.val().counter==node2.val().Counter)
                                {
                                    createBlog2(node);
                                    sessionStorage.temp = 1;

                                }  
                            })
                            
                if (node.val().counter==blogCounter && sessionStorage.temp==0)
                {
                    createBlog(node);
                }

                            console.log("sessionStoage.temp",sessionStorage.temp)
 
                    }

                }
                )

                console.log("temp2",sessionStorage.temp)

            })
        }})
    }
  })




    // Check User Status
onAuthStateChanged(auth, (user) => {
    // Elements to show/hide
    const deleteBlog = document.getElementById("deleteBlog");
    const removeFeature = document.getElementById("makeFeaturedBlog");

    if(user) {
        const uid = user.uid;
        
        //Make buttons available if admin is signed in
        deleteBlog.style.display = "block";
        removeFeature.style.display = "block";
     
        console.log("Check Status: Admin signed in.");
    }
    else {
        deleteBlog.style.display = "none"; 
        removeFeature.style.display = "none";
        console.log("Check Status: Admin logged out.");
    }
});






/*
var blogCounter2;

  //This function runs when the "delete blog" button is clicked
function deletefunc()
{ 

    get(child(dbref,"blogs")).then((snapshot)=>{
        if(snapshot.exists())
        {
           //CurrentCounter stores the counter for the specific story which the reader wants to read. 
           //So, we retrieve the story whose counter is equal to CurrentCounter. 



           get(child(dbref,"CurrentBlogCounter")).then((snapshot2)=>{
            alert("check")

            if(snapshot2.exists())
            {
                //stores the counter of the story the reader wants to read
                blogCounter = snapshot2.val().counter;   
    
                //Goes through every story
                snapshot.forEach(node =>{
                    if(node.val().counter==blogCounter)
                    {
                        //remove(ref(database,"blogs/"+node.key))
                    }
                })
        
            }})
        }
      })

      */
    












/*   
    get(child(dbref,"CurrentBlogCounter")).then((snapshot2)=>{
        if(snapshot2.exists())
        {
            //stores the counter of the story the reader wants to read
            blogCounter2 = snapshot2.val().counter;       
            alert("Check1!")
            get(child(dbref,"blogs")).then((snapshot)=>{
                if(snapshot.exists())
                {
                    alert("Check2!")
                    snapshot.forEach(node =>{
                        //since the key for each dataset is randomized in firebase, 
                        //we locate the particular dataset by going through each dataset with success-stories and checking if the
                        // dataset's counter is same as the counter for story which needs to be deleted.
 
                        if(node.val().counter==blogCounter2)
                        {

                            remove(ref(database,"blogs/"+node.key))
                            //After the story is successfully removed, we reload the window. 
                            alert("The blog has been deleted!")
                        }

                    })
                }
            })
                    

    }})
*/

/*
if(deleteBlog)
{
    //When the "delete blog" button is clicked, it calls the deletefunc() function.
    deleteBlog.addEventListener
    ('click', e =>
    {
        deletefunc();
    }
    )
}
*/