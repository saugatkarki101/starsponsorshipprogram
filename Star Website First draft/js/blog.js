import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";


const dbref = ref(database, 'blogs');
const dbref2 = ref(database);
var counter = 0;

//Initializing an instance of the database stored in the firebase. 
//const dbref = ref(database);






$.noConflict();
var validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];

//---- Image Validation (Not fully functioning) ----//
$(document).ready(function()
{
    $("#selected-image").hide();

    function previewImage(image_success)
    {
        if(image_success.files && image_success.files[0])
        {
            var reader = new FileReader();
            reader.onload = function(e)
            {
                $("#selected-image").attr('src', e.target.result);
                $("#selected-image").addClass('fadeIn');
            }
            reader.readAsDataURL(image_success.files[0]);

            $("#selected-image").show();
        }
    }

    $("#success-image").change(function()
    {
        previewImage(this);
    });
});

$(document).ready(function()
{

});

//------- Admin Save Changes Function --------//
function save()
{
    $("#succ-name").removeClass("is-invalid");
    $("#succ-descr").removeClass("is-invalid");
    $("#success-image").removeClass("is-invalid");

    var successName = $("#succ-name").val();
    var desc = $("#succ-descr").val();
    var picture = $("#success-image").prop("files")[0];

    if(!successName)
    {
        $("#succ-name").addClass("is-invalid");
        return;
    }

    if(!desc)
    {
        $("#succ-descr").addClass("is-invalid");
        return;
    }

    if(picture == null)
    {
        $("#success-image").addClass("is-invalid");
        return;
    }

    if($.inArray(picture["type"], validImageTypes)<0)
    {
        $("success-image").addClass("is-invalid");
        return;
    } 
//-----End Image Validation------//

    //------ Firebase Stuff --------//
    get(child(dbref, "value")).then(function(snapshot)
    {
        var name = picture["name"];
        var dateStr = new Date().getTime();
        var fileCompleteName = dateStr + "_" + name ; //Randomize the image name before going into database!
   
        const storageRef = sRef(storage, 'blog-images'); //Create Storage reference
       
        const successStorageRef = sRef(storageRef, fileCompleteName); 

        const uploadTask = uploadBytesResumable(successStorageRef, picture);
        //Upload Picture
        uploadTask.on(
            "state_changed",
            (snapshot) =>
            {
                const percentage = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
                //console.log('Upload is ' + progress + '% done');
                $("#upload-progress").html(Math.round(percentage) + "%");
                $("#upload-progress").attr('style', 'width:' + percentage + '%');
            },
            (error) =>
            {
                console.log(error);
            },
            async () =>
            {
                var userName = document.getElementById('succ-name').value;
                var editDesc = document.getElementById('succ-descr').value;
                var year = document.getElementById('year').value;
                var month = document.getElementById('month').value;
                var day = document.getElementById('day').value;
                var counter = parseInt(dateStr);
              
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
                {
                    var successData = 
                    {
                        "image": downloadURL,
                        "fname": fileCompleteName,
                        "desc": editDesc,
                        "name": userName,
                        "year": year,
                        "month": month,
                        "day": day,
                        "counter": counter,
                    };

                    const newPostRef = push(dbref);

                    set(newPostRef, successData)
                        .then(() => {
                        
                            $("#result").attr("class", "alert alert-success");
                            $("#result").html("Success Story Updated Succesfully!");

                            //Refresh the page
                            $('#blog-form').trigger("reset"); //Clear the form
                            //Add a delay and reset the rest of the form
                            setTimeout(function(){
                                $("#selected-image").hide();
                                //$("#selected-image").addClass("animate__fadeOut animate__slower");
                                $("#upload-progress").html("0%");
                                $("#upload-progress").attr('style', 'width:' + '0' + '%');
                                //Reset the success div
                                $("#result").html("");
                                $("#result").attr("class", "fadeOut");
                                //$("#result").addClass("animate__fadeOut animate__slower");

                            },1500);
                            location.reload();    
                        })
                        .catch((error) =>
                        {
                            $("#result").attr("class", "alert alert-danger");
                            $("#result").html(err.message);
                        }); 
                    
                });
            }
        );
    });
    
} //End Save Function


function updateHomepage()
{
    get(child(dbref2,"success-stories")).then((snapshot)=>{
        if(snapshot.exists())
        {
           // let successStoriesDatabase =  snapshot.val().desc;
           // console.log(successStoriesDatabase);

            snapshot.forEach(node =>{
                //console.log(node.val().fname)
            })

           // document.getElementById("description").innerHTML = successStoriesDatabase;
        }
      })
}
window.updateHomepage = updateHomepage


//Checks if a HTML element with id: 'save-blog' is present. 
var check = document.getElementById('save-blog');

if(check)
{
    //When the "Submit" button is clicked, it calls the save function.
    check.addEventListener
    ('click', e =>
    {
        save();
    }
    )
}


//This function updates the value of CurrentCounter in the firebase with the counter of the story that is clicked. . 
function updateBlogCounter(num)
{
    update(ref(database,'CurrentBlogCounter'),{
        counter: num
      });
}

//Function within modules won't be available to access globally.
//So, it needs to be attached to window.
window.updateBlogCounter = updateBlogCounter




const blogSection = document.querySelector('#firstRow');
const dropDownSection = document.querySelector("#dropDownMenu")
const blogListSection = document.querySelector(".blog-post")
const olderBtn = document.querySelector("#olderBtn")
const newerBtn = document.querySelector("#newerBtn")

//Code for the "cross" button which is used to delete success stories
let cross = document.createElement('div');
cross.setAttribute("class", "cross-admin");
cross.textContent = 'x';
cross.style.fontSize = "20px";
cross.style.color = "white";

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

//This creates a new section with every other success story 
const createCards = (node) => {

    blogSection.innerHTML += `
    <div class="col-md-6" >
    <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative" id="featuredBlog">
    <div class="col-auto d-none d-lg-block " >
    <!--<svg class="bd-placeholder-img" width="200" height="250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>-->
  <img src="${node.image}"   height="250" width="540" style="object-fit: cover;"
    alt="image"/> </div><div class="col p-4 d-flex flex-column position-static " id="featured" m-0 >
      <h3 class="mb-0">${node.name.substring(0, 100)}</h3>
      <div class="mb-1 text-muted">${months[node.month-1]+' '+node.day+', '+node.year}</div>
      <p class="card-text mb-auto">${node.desc.substring(0, 200) + '...'}</p>
      <a href="individualBlogPage.html" onClick="updateBlogCounter(${node.counter})" class="stretched-link">Continue reading</a>
    </div>
    </div>
 </div>
    `;    
}

const createDropDown = (arr) => {
    dropDownSection.innerHTML += `
    <li><a style="text-decoration:none;" href="individualBlogPage.html" class="blog"  onclick="updateBlogCounter(${arr.counter})">${months[parseInt(arr.month)-1]+" "+ arr.day+", "+ arr.year}</a></li>
    `;    
}

const createBlogList = (arr) => {
    blogListSection.innerHTML += `
    <style>
    #blogDate{
        margin: 0;
        padding: 0;
    }
    .blog-post-title
    {
        margin: 0;
        padding: 0;
    }
    </style>
    <div class="blog-post-meta" id="blogDate">${months[parseInt(arr.month)-1]+" "+ arr.day+", "+ arr.year}</div>
    <a href="individualBlogPage.html" style="text-decoration:none;color:black;"> <h2 class="blog-post-title" style="cursor:pointer;"  onclick="updateBlogCounter(${arr.counter})">${arr.name}</h2></a>
    <br>
    `;    
}


function split(array, n) {
    let [...arr]  = array;
    var res = [];
    while (arr.length) {
      res.push(arr.splice(0, n));
    }
    return res;
  }



get(child(dbref2,"blogs")).then((snapshot)=>{
    if(snapshot.exists())
    {
        var arr = Object.values(snapshot.val());
        arr.sort(function(a,b){
            var year1 = parseInt(a.year)
            var year2 = parseInt(b.year)
            var month1 = parseInt(a.month)
            var month2 = parseInt(b.month)
            var day1 = parseInt(a.day)
            var day2 = parseInt(b.day)

            if (year1 === year2)
            {
                if(month1===month2)
                {
                    return day1-day2 
                }
                if(month1<month2)
                return -1
                else
                return 1

            }
            if (year1 < year2)
            return -1 
            else
            return 1
        })

        arr.reverse();


        get(child(dbref2,"FeaturedBlogs")).then((snapshot2)=>{
            if(snapshot2.exists())
            {

                //stores the counter of the story the reader wants to read
                //blogCounter = snapshot2.val().counter;  

                snapshot2.forEach(node2 =>{
                
                            arr.forEach(node => {

                                if(node2.val().Counter == node.counter)
                                {
                                    createCards(node);
                                }
                            })            
                })


        
                /*
                //Goes through every story
                snapshot.forEach(node =>{


                    snapshot2.forEach(node2 =>{
                        if(node.val().counter==node2.val().Counter)
                        {
                            //every dataset related to every story is passed one by one to createCards() function
                            createCards(node);
                        }
     
                    })

                })
                */
            }})
        




    /*    snapshot.forEach(node =>{
            //every dataset related to every story is passed one by one to createCards() function
            createCards(node);

        }) */

        arr.forEach(node => {
            createDropDown(node);
        })


        var slicedArr = split(arr,5);
        if(!sessionStorage.blogCount)
        {
            sessionStorage.blogCount = 0;
        }
        var i = Number(sessionStorage.blogCount);

        slicedArr[i].forEach(node => {
            createBlogList(node);
        })  

        if(Number(sessionStorage.blogCount) === slicedArr.length-1)
        {

            olderBtn.classList.add("show")
        }
        if(Number(sessionStorage.blogCount) === 0)
        {
            newerBtn.classList.add("show")
        }



        olderBtn.addEventListener
        ('click', e =>
        {
            if(Number(sessionStorage.blogCount) === slicedArr.length-1)
            {

                olderBtn.classList.add("show")

            }
            else
            {
                if(olderBtn.classList.contains("show"))
                {
                  olderBtn.classList.remove("show")
                }


                sessionStorage.blogCount = Number(sessionStorage.blogCount) + 1
                if(Number(sessionStorage.blogCount) === slicedArr.length-1)
                {
                    olderBtn.classList.add("show")    
                }

                window.location.reload()    
            }
        }
        )

        newerBtn.addEventListener
        ('click', e =>
        {
            if(Number(sessionStorage.blogCount) === 0)
            {
                newerBtn.classList.add("show")
            }
            else
            {
                if(newerBtn.classList.contains("show"))
                {
                  newerBtn.classList.remove("show")
                }


                sessionStorage.blogCount = Number(sessionStorage.blogCount) - 1
                if(Number(sessionStorage.blogCount) === 0)
                {
                    newerBtn.classList.add("show")    
                }

                window.location.reload()    
            }
        }
        )






/*        for (let i = 0; i < slicedArr.length ; i++) {
            slicedArr[i].forEach(node => {
                createBlogList(node);
            })        

            olderBtn.addEventListener
            ('click', e =>
            {
                window.location.reload()
            }
            )
        }
        */
        
        
        
        /* ---------- Used to Disable/Enable the Form based on Authorization -------------*/

  onAuthStateChanged(auth, (user) => {
    // Elements to show/hide
    const boardContainer = document.getElementById("blog_container");
    //const deleteStory = document.getElementById("crossButton")
    if(user) {
        const uid = user.uid;

        if(boardContainer) {boardContainer.style.display = "block"};
        // Redirects to home page when user is logged in
        console.log("Check Status: User signed in.");
    }
    else {

        if(boardContainer) {boardContainer.style.display = "none"};
        //if(deleteStory) {deleteStory.style.display = "none"};
        console.log("Check Status: User logged out.");
    }
});

        //Auth State Changed Code, Jquery to hide the cross buttons (Only way that worked for me)
        onAuthStateChanged(auth, (user) => {
            $(document).ready(function() {
                if(user) {
                    const uid = user.uid;
                    $('*[id*=crossButton]:invisible').each( function(i){
                        $(this).show();
                    });        
                }
                else{
                    //Start Disable Cross Button
                    $('*[id*=crossButton]:visible').each( function(i){
                        $(this).hide();
                    });    
                    //End Disable Cross Button
                }
            });//End Document.Ready Jquery
        }); //End Auth State Changed
    }
  }) //End Create Card code


  const menu = document.querySelector('#menu');
  const dropDownMenu = document.querySelector('#dropDownMenu');

   menu.addEventListener
  ('click', e =>
  {
      if(dropDownMenu.classList.contains("show"))
      {
        dropDownMenu.classList.remove("show")
      }
      else
      {
        dropDownMenu.classList.add("show")
      }
  }
  )