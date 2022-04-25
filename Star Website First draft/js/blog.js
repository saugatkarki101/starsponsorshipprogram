import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";


const dbref = ref(database, 'blogs');
const dbref2 = ref(database);
var counter = 0;

//NOTE: There's one extra key in the "FeaturedStory", "FeaturedBlogs" child in firebase.
//This ensures there's always some data there and won't be left empty which could cause errors while trying
//to read from those childs. Also, if there's no data there, the whole child is removed as its empty.



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


//------- Admin Save Changes Function --------//
function save()
{
    $("#succ-name").removeClass("is-invalid");
    $("#succ-descr").removeClass("is-invalid");
    $("#success-image").removeClass("is-invalid");

    var successName = $("#succ-name").val();
    var desc = $("#succ-descr").val();
    var picture = $("#success-image").prop("files")[0];
    var validYear = $("#year").val();
    var validMonth = $("#month").val();
    var validDay = $("#day").val();


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
    if(!validYear||isNaN(validYear)||validYear < 1900)
    {
        alert("Please enter a valid numeric value for Year.")
        return;
    }
    if(!validMonth||isNaN(validMonth)||(validMonth>12 || validMonth <1))
    {
        alert("Please enter a valid numeric value for Month from 1-12.")
        return;
    }

    if(!validDay||isNaN(validDay)||(validDay>31 || validDay <1))
    {
        alert("Please enter a numeric value for day from 1-31.")
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
        alert("Please choose a valid picture. (jpg, png, gif, and webp are accepted).")

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
    const dropDownSection = document.querySelector("#dropDownMenu")
    //checking to make sure that the html section actually exists.
    if(dropDownSection)
    {
        dropDownSection.innerHTML += `
        <li><a style="text-decoration:none;" href="individualBlogPage.html" class="blog"  onclick="updateBlogCounter(${arr.counter})">${months[parseInt(arr.month)-1]+" "+ arr.day+", "+ arr.year}</a></li>
        `;
    }
}

const createBlogList = (arr) => {
    const blogListSection = document.querySelector(".blog-post")
    if(blogListSection)
    {
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
}


//Splits array into separate arrays with five elements each
function split(array, n) {
    let [...arr]  = array;
    var res = [];
    while (arr.length) {
      res.push(arr.splice(0, n));
    }
    return res;
  }



get(child(dbref2,"blogs")).then((snapshot)=>{
    //Sorts the dataset giving highest priority to Year, and then month and then day.
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


        //will be used to filter the blogs that are not featured blogs and add them to the blog list
        var duplicateArr = arr.slice();

        get(child(dbref2,"FeaturedBlogs")).then((snapshot2)=>{
            if(snapshot2.exists())
            {
                snapshot2.forEach(node2 =>{
                            arr.forEach(node => {
                                if(node2.val().Counter == node.counter)
                                {
                                    createCards(node);
                                }
                            })
                })
            }})

        //In the first page of blog.html, 5 blogs will show up. When the user presses older button, another 5 blogs will show up.
        //sessionStorage.blogCount will keep track of how many pages of blog.html will show up. If there's only 5 blogs in the "More blogs"
        //section, sessionStorage.blogCount will start at 0 and won't go up. If there's 12 blogs in the "more blogs" section, its value will
        //start at 0 and go until 3 as there will be three pages of blog.html to cover the 12 blogs in total.
        if(!sessionStorage.blogCount)
        {
            sessionStorage.blogCount = 0;
        }
        var i = Number(sessionStorage.blogCount);

        //This makes sure that the "more blogs" section doesn't have featured blogs
        get(child(dbref2,"FeaturedBlogs")).then((snapshot2)=>{
            if(snapshot2.exists())
            {

                snapshot2.forEach(node2 =>{

                            for(var i=0;i<duplicateArr.length;i++)
                            {
                                if(node2.val().Counter == duplicateArr[i].counter)
                                {
                                    duplicateArr.splice(i,1);
                                }
                            }
                })
                //For unidentified reasons, any changes made here inside of this loop in duplicateArr didn't show up outside the loop.
                //So instead, everything needed to be done with slicedArr and slicedArr2 was done here within this loop
                var slicedArr2 = split(duplicateArr,5);
                //say you have 12 blogs to print in the "more blogs" section. Now, it will be divided into 3 arrays with 5,5, and 2 values
                //which are stored within slicedArr.
                //i is equal to sessionStorage.blogcount which refers to the above set of 3 arrays. So, here the value of i goes from 0 to 2.
                //0 means it is referring to the first 5 blogs. 1 means ...
                slicedArr2[i].forEach(node => {
                    createBlogList(node);
                })







        //This couldn't have been done outside of this loop because the changes made to the duplicateArr stayed within the
        //loop even though  duplicateArr was declared outside of the loop
        var slicedArr = split(duplicateArr,5);
        //This means we are at the end of the sets of 5 blogs each. Example: we have 12 blogs, we are at the blog.html page with 2 blogs remaining.
        if(Number(sessionStorage.blogCount) === slicedArr.length-1)
        {
            //checks to make sure olderBtn exists.
            if(olderBtn)
            {
                //Since there's no more blogs to show, even though this class is called "show", this actually disables the olderBtn by making it transparent and unclickable.
                //even
                olderBtn.classList.add("show")
            }
        }

        //This means we are at the beginning of the sets of 5 blogs each. Example: we have 12 blogs, we are at the blog.html page with the first 5 blogs.
        if(Number(sessionStorage.blogCount) === 0)
        {
            if(newerBtn)
            {
                //Since there's no newer blogs than what we have, the newer btn is disabled.
                newerBtn.classList.add("show")
            }
            if(Number(sessionStorage.blogCount) === slicedArr.length-1)
            {

            }
        }

        //Checks to make sure the older btn exists.
        if(olderBtn)
        {
            olderBtn.addEventListener
            ('click', e =>
            {
                //This condition being true means we are at the end and there's no more blogs to print. So, adding "show" basically
                //disables the olderBtn to make sure its disabled(which it already most likely is).
                if(Number(sessionStorage.blogCount) === slicedArr.length-1)
                {
                    olderBtn.classList.add("show")
                }
                //This condition being true means we have more blogs to print.
                else
                {
                    //So, if the older button is disabled before, we enable it.
                    if(olderBtn.classList.contains("show"))
                    {
                      olderBtn.classList.remove("show")
                    }

                    //Then, we increase the blogCount by 1 so that we can move on to the next set of 5 blogs or so.
                    sessionStorage.blogCount = Number(sessionStorage.blogCount) + 1
                    //Now, if this condition holds true, it means that we won't have any more blogs to print once the next set of blogs is printed.
                    if(Number(sessionStorage.blogCount) === slicedArr.length-1)
                    {
                        //That's why we disable the older button
                        olderBtn.classList.add("show")
                    }
                    //Now, we reload the page which then prints the new set of blogs in the "more blogs" section
                    window.location.reload()
                }
            }
            )

        }

        //Same procedure as above
        if(newerBtn)
        {
            newerBtn.addEventListener
            ('click', e =>
            {
                //
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
        }

            }})

        //Creates the drop down list
        arr.forEach(node => {
            createDropDown(node);
        })


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
  if(menu)
  {
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

  }
