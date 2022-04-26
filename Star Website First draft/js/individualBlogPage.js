import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const user = auth.currentUser;
const dbref = ref(database);
const dbref2 = ref(database);
const dbref3 = ref(database);
const dbref4 = ref(database);


const outer = document.querySelector('.outer');
const blogTitle = document.querySelector('.blogTitle');
const description = document.querySelector('.description');
const btns = document.querySelector('.Btns');
const btns2 = document.querySelector('.Btns2');


//NOTE: There's one extra key whose counter doesn't match with any of the actual dataset in the "FeaturedStory", "FeaturedBlogs", "InTheNews" child in firebase. 
//This ensures there's always some data there and won't be left empty which could cause errors while trying 
//to read from those childs. Also, if there's no data there, the whole child is removed as its empty. 



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


    get(child(dbref,"InTheNews")).then((snapshot)=>{
        if(snapshot.exists())
        {
            snapshot.forEach(node =>{
                //since the key for each dataset is randomized in firebase, 
                //we locate the particular dataset by going through each dataset with success-stories and checking if the
                // dataset's counter is same as the counter for story which needs to be deleted.

                if(node.val().Counter==num)
                {
                    remove(ref(database,"InTheNews/"+node.key))
                    //After the story is successfully removed, we reload the window. 
                    alert("The blog has been removed from 'In the News' section!")
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


function addToInTheNews(num)
{
        //checks if the blog that the admin is trying to add to homepage
        var check = 0;
        get(child(dbref,"InTheNews")).then((snapshot)=>{
            if(snapshot.exists())
            {
                    //goes through the counter of every blog in "In The News" section
                    snapshot.forEach(node =>{
                        if(node.val().Counter==num)
                        {
                            check = 1;
                        }
                    })
                    if(check == 0)
                    {
                        push(ref(database,'InTheNews'),{
                        Counter: num
                        });
                        alert("The blog has been added to 'In The News' section in homepage!")
                    }
                    else
                    {
                        alert("This blog is already in 'In the News' section in homepage!")
                    }
                    location.reload()
            }
          })    
}

window.addToInTheNews = addToInTheNews;

function removeFromInTheNews(num)
{

    get(child(dbref,"InTheNews")).then((snapshot)=>{
        if(snapshot.exists())
        {
            snapshot.forEach(node =>{
                if(node.val().Counter==num)
                {
                    remove(ref(database,"InTheNews/"+node.key))
                    alert("The blog has been removed from 'In the News' section!")
                    location.reload();
                }
            })
        }
    })
}
window.removeFromInTheNews =  removeFromInTheNews;


const createInTheNewsAddButton = (node) => {
    btns2.innerHTML +=
     ` <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="addToInTheNews" href="#" role="button" onclick="addToInTheNews(${node.val().counter})" style="position: absolute; left: 300px;">Add this to "In the News" section in homepage &nbsp; &nbsp;</a>
    `
}

const removeInTheNewsAddButton = (node) => {
    btns2.innerHTML +=
     `    <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="addToInTheNews" href="#" role="button" onclick="removeFromInTheNews(${node.val().counter})" style="position: absolute; left: 300px;">Remove this from "In the News" section in homepage &nbsp; &nbsp;</a>    

    `
}


//gets called if the blog is not a featured blog and not in "In the News" section
const createBlog = (node) => {
    btns.innerHTML += `<a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="makeFeaturedBlog" href="#"  onclick="makeFeaturedBlog(${node.val().counter})" role="button" style="position: absolute; left: 650px;">Make this a featured blog&nbsp; &nbsp;</a>
    <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="deleteBlog" href="#" role="button" onclick="deletefunc(${node.val().counter})" style="position: absolute; right: 500px;">Delete this blog&nbsp; &nbsp;</a>
    `

    outer.innerHTML +=  `<img src="${node.val().image}" alt="" class="story-image img-fluid" height="650" width="550">`;
    blogTitle.innerHTML += node.val().name;
    description.innerHTML += node.val().desc;    
}



//gets called if the blog is already a featured blog and is in "In the News" section
const createBlog2 = (node) => {
    btns.innerHTML += `<a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="makeFeaturedBlog" href="#"  onclick="removeFeaturedBlog(${node.val().counter})" role="button" style="position: absolute; left: 650px;">Remove this as a featured blog&nbsp; &nbsp;</a>
    <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="deleteBlog" href="#" role="button" onclick="deletefunc(${node.val().counter})" style="position: absolute; right: 500px;">Delete this blog&nbsp; &nbsp;</a> 
    `

    outer.innerHTML +=  `<img src="${node.val().image}" alt="" class="story-image img-fluid" height="650" width="550">`;
    blogTitle.innerHTML += node.val().name;
    description.innerHTML += node.val().desc;
}



var blogCounter;
//checks if the blog is a featured blog or not. 
let temp = 0;



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
 
                    }

                }
                )


            })
        }})
    }
  })


  get(child(dbref,"blogs")).then((snapshot)=>{
    if(snapshot.exists())
    {
        sessionStorage.temp2 = 0;

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
            
     
                get(child(dbref,"InTheNews")).then((snapshot3)=>{

                    if(snapshot3.exists())
                    {

                            snapshot3.forEach(node2 =>{
        
                                //If the blog is the blog that we wanted to print and it is in "In The News" section
                                if(node.val().counter==blogCounter && node.val().counter==node2.val().Counter)
                                {
                                    removeInTheNewsAddButton(node);
                                    sessionStorage.temp2 = 1;
                                }  
                            })
                            //If the blog is the blog that we wanted to print and it is not in "In The News" section
                            if(node.val().counter==blogCounter)
                            {
                                //alert("blogs"+blogCounter+"sessionStorage.temp: "+sessionStorage.temp)
                            }

                            if (node.val().counter==blogCounter && sessionStorage.temp2==0)
                            {
                                createInTheNewsAddButton(node);
                            }
 
                    }

                }
                )


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