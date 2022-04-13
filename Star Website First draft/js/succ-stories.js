import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";


const dbref = ref(database, 'success-stories');
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

        const storageRef = sRef(storage, 'success-images'); //Create Storage reference

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
                var counter = parseInt(dateStr);

                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                {
                    var successData =
                    {
                        "image": downloadURL,
                        "fname": fileCompleteName,
                        "desc": editDesc,
                        "name": userName,
                        "counter": counter,
                    };

                    const newPostRef = push(dbref);

                    set(newPostRef, successData)
                        .then(() => {

                            $("#result").attr("class", "alert alert-success");
                            $("#result").html("Success Story Updated Succesfully!");

                            //Refresh the page
                            $('#success-form').trigger("reset"); //Clear the form
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


//Checks if a HTML element with id: 'save-story' is present.
var check = document.getElementById('save-story');

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


//This function updates the value of CurrentCounter in the firebase with the counter of the story that is clicked. .
function myfunc(num)
{
    console.log("CurrentCounter: ",num)

    update(ref(database,'CurrentCounter'),{
        counter: num
      });
}

//Function within modules won't be available to access globally.
//So, it needs to be attached to window.
window.myfunc = myfunc

//This function runs when the delete button is clicked
function crossfunc(num)
{
    get(child(dbref2,"success-stories")).then((snapshot)=>{
        if(snapshot.exists())
        {

            snapshot.forEach(node =>{
                //since the key for each dataset is randomized in firebase,
                //we locate the particular dataset by going through each dataset with success-stories and checking if the
                // dataset's counter is same as the counter for story which needs to be deleted.
                if(node.val().counter==num)
                {
                    remove(ref(database,"success-stories/"+node.key))
                    //After the story is successfully removed, we reload the window.
                    location.reload();
                }

            })
        }
      })

}

//Function within modules won't be available to access globally.
//So, it needs to be attached to window.
window.crossfunc = crossfunc


const successStoriesSection = document.querySelector('.successStories-section');

//Code for the "cross" button which is used to delete success stories
let cross = document.createElement('div');
cross.setAttribute("class", "cross-admin");
cross.textContent = 'x';
cross.style.fontSize = "20px";
cross.style.color = "white";

//This creates a new section with every other success story
const createCards = (node) => {
    // Remove middle names from full name
    const fullname = node.val().name;
    const namesplit = fullname.split(' ');
    const name = namesplit[0] + " " + namesplit[namesplit.length - 1];

    successStoriesSection.innerHTML += `
    <div class="succStoriesCard" id="succStoriesCardID">
    <style>
    .cross
    {
        position: center;
        font-size: 20px;
        left: 150px;
    }

    </style>

        <div class="cross" id="crossButton" onmouseover="" style="cursor: pointer;" onclick="crossfunc(${node.val().counter})">x</div>
        <a class="btn dark" id="readButton" onclick="myfunc(${node.val().counter})" href="successStoriesPage.html">
        <img src="${node.val().image}" class="image" alt="">
        </a>
        <h1 class="name">${name.substring(0, 30)}</h1>
        <p class="desc">${node.val().desc.substring(0, 112) + '...'}</p>
        <a class="btn dark" id="readButton" onclick="myfunc(${node.val().counter})" href="successStoriesPage.html">
        Read More
        </a>

    </div>
    `;
}


get(child(dbref2,"success-stories")).then((snapshot)=>{
    if(snapshot.exists())
    {
        snapshot.forEach(node =>{
            //every dataset related to every story is passed one by one to createCards() function
            createCards(node);
        })

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

  onAuthStateChanged(auth, (user) => {
    // Elements to show/hide
    const successContainer = document.getElementById("success_container");
    //const deleteStory = document.getElementById("crossButton")
    if(user) {
        const uid = user.uid;

        if(successContainer) {successContainer.style.display = "block"};
        // Redirects to home page when user is logged in
        console.log("Check Status: User signed in.");
    }
    else {

        if(successContainer) {successContainer.style.display = "none"};
        //if(deleteStory) {deleteStory.style.display = "none"};
        console.log("Check Status: User logged out.");
    }
});
