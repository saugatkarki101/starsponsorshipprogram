import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const user = auth.currentUser;
const dbref = ref(database, 'meet-board');
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

    $("#board-image").change(function()
    {
        previewImage(this);
    });
});



//------- Admin Save Changes Function --------//
function save()
{

    $("#board-name").removeClass("is-invalid");
    $("#board-descr").removeClass("is-invalid");
    $("#board-image").removeClass("is-invalid");

    var successName = $("#board-name").val();
    var desc = $("#board-descr").val();
    var picture = $("#board-image").prop("files")[0];

    if(!successName)
    {
        $("#board-name").addClass("is-invalid");
        return;
    }

    if(!desc)
    {
        $("#board-descr").addClass("is-invalid");
        return;
    }

    if(picture == null)
    {
        $("#board-image").addClass("is-invalid");
        return;
    }

    if($.inArray(picture["type"], validImageTypes)<0)
    {
        $("board-image").addClass("is-invalid");
        return;
    }
//-----End Image Validation------//

    //------ Firebase Stuff --------//
    get(child(dbref, "value")).then(function(snapshot)
    {
        var name = picture["name"];
        var dateStr = new Date().getTime();
        var fileCompleteName = dateStr + "_" + name ; //Randomize the image name before going into database!

        const storageRef = sRef(storage, 'board-images'); //Create Storage reference

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
                //alert("Board Member Added Successfully!");
            },
            (error) =>
            {
                console.log(error);
            },
            async () =>
            {
                var userName = document.getElementById('board-name').value;
                var editDesc = document.getElementById('board-descr').value;
                var counter = parseInt(dateStr);
                var descString = "<p>"; //Create Paragraph string 
                const myArray = editDesc.split(","); //Split Strings
                
                //Build HTML Tags from Titles
                for (let i = 0; i < myArray.length; i++) {
                    console.log(myArray[i].trim());
                    descString = descString + myArray[i].trim() + "<br>";
                }
                descString = descString + "</p>" //Close the P tag

                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                {
                    var boardData =
                    {
                        "image": downloadURL,
                        "fname": fileCompleteName,
                        "desc": descString,
                        "name": userName,
                        "counter": counter,
                    };

                    const newPostRef = push(dbref);

                    set(newPostRef, boardData)
                        .then(() => {

                            $("#result").attr("class", "alert alert-success");
                            //alert("Board Member Added Successfully!");
                            $("#result").html("Board Member Updated Succesfully!");

                            //Refresh the page
                            $('#board-form').trigger("reset"); //Clear the form
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



function updateBoardpage()
{
    get(child(dbref2,"meet-board")).then((snapshot)=>{
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
window.updateBoardpage = updateBoardpage



//Checks if a HTML element with id: 'save-story' is present.
var check = document.getElementById('save-board');

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
    console.log("BoardCounter: ",num)

    update(ref(database,'BoardCounter'),{
        counter: num
      });
}

//Function within modules won't be available to access globally.
//So, it needs to be attached to window.
window.myfunc = myfunc

//This function runs when the delete button is clicked
function crossfunc(num)
{
    get(child(dbref2,"meet-board")).then((snapshot)=>{
        if(snapshot.exists())
        {

            snapshot.forEach(node =>{
                //since the key for each dataset is randomized in firebase,
                //we locate the particular dataset by going through each dataset with success-stories and checking if the
                // dataset's counter is same as the counter for story which needs to be deleted.
                if(node.val().counter==num)
                {
                    remove(ref(database,"meet-board/"+node.key))
                    alert("Board member removed!");
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


const meetBoardSection = document.querySelector('.meetBoard-section');

//Code for the "cross" button which is used to delete success stories
let cross = document.createElement('div');
cross.setAttribute("class", "cross-admin");
cross.textContent = 'x';
cross.style.fontSize = "20px";
cross.style.color = "white";

var nodeNum = 0; //Keep in Track of Current node

function loopString(params)
{
    var name = "";
    for (let i = 0; i < params.length; i++) {
        console.log(params[i].trim());
        name = params[i].trim();
        return name;
    }
}
    
//This creates a new section with every other success story
const createCards = (node) => {
    nodeNum++;
    // Remove middle names from full name
    const fullname = node.val().name;
    //const namesplit = fullname.split(' ');
    //const name = namesplit[0] + " " + namesplit[namesplit.length - 1];
    const cardID = "meetBoardCardID" + nodeNum;
    const cardClass = "meetBoardCard" + nodeNum;
    //const myArray = node.val().desc.split(",");
    const i = 0;
    //console.log(cardID); // Show the current Id of the current card
    meetBoardSection.innerHTML += `
    <div class="${cardClass} container testi-container" id="${cardID}">
    <style>
    .cross
    {
        position: center;
        font-size: 20px;
        left: 150px;
    }
    
    
    </style>
    <script> console.log("hello world"); </script>
    <div class="cross" id="crossButton" onmouseover="" style="cursor: pointer;" onclick="crossfunc(${node.val().counter})">x</div>
    <img src="${node.val().image}" class="image" alt="" style="width:120px">
    <p><span>${fullname}</span></p><p> 
    ${node.val().desc}

    </div>
    `;

}


get(child(dbref2,"meet-board")).then((snapshot)=>{
    if(snapshot.exists())
    {
        snapshot.forEach(node =>{
            //every dataset related to every board member is passed one by one to createCards() function
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




/* ---------- Used to Disable/Enable the Form based on Authorization -------------*/

  onAuthStateChanged(auth, (user) => {
    // Elements to show/hide
    const boardContainer = document.getElementById("board_container");
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
