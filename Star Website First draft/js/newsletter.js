import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";


const dbref = ref(database, 'newsletter');
const dbref2 = ref(database);
var counter = 0;



$.noConflict();
var validFileTypes = ["application/pdf"];

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

    $("#pdf-file").change(function()
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
    $("#newsletter-name").removeClass("is-invalid");
    $("#pdf-file").removeClass("is-invalid");


    var successName = $("#newsletter-name").val();
    var pdf = $("#pdf-file").prop("files")[0];
    var validYear = $("#year").val();
    var validQuarter = $("#quarter").val();

    if(!successName)
    {
        $("#newsletter-name").addClass("is-invalid");
        return;
    }

    if(!validYear||isNaN(validYear))
    {
        alert("Please enter a numeric value for Year.")
        return;
    }

    if((!validQuarter)||isNaN(validQuarter)||((validQuarter!=1)&&(validQuarter!=2)&&(validQuarter!=3)&&(validQuarter!=4)))
    {
        alert("Please enter a numeric value between 1-4 for Quarter.")
        return;
    }


    if(pdf == null)
    {
        $("#pdf-file").addClass("is-invalid");
        return;
    }


    if($.inArray(pdf["type"], validFileTypes)<0)
    {
        $("#pdf-file").addClass("is-invalid");
        return;
    }


//-----End pdf Validation------//

    //------ Firebase Stuff --------//
    get(child(dbref, "value")).then(function(snapshot)
    {
        var name = pdf["name"];
        var dateStr = new Date().getTime();
        var fileCompleteName = dateStr + "_" + name ; //Randomize the image name before going into database!

        const storageRef = sRef(storage, 'newsletter-pdf'); //Create Storage reference

        const successStorageRef = sRef(storageRef, fileCompleteName);

        const uploadTask = uploadBytesResumable(successStorageRef, pdf);
        //Upload pdf
        uploadTask.on(
            "state_changed",
            (snapshot) =>
            {
                const percentage = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
                $("#upload-progress").html(Math.round(percentage) + "%");
                $("#upload-progress").attr('style', 'width:' + percentage + '%');
            },
            (error) =>
            {
                console.log(error);
            },
            async () =>
            {
                var userName = document.getElementById('newsletter-name').value;
                var year = document.getElementById('year').value;
                var quarter = document.getElementById('quarter').value;
                var counter = parseInt(dateStr);

                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                {
                    var successData =
                    {
                        "pdf": downloadURL,
                        "fname": fileCompleteName,
                        "name": userName,
                        "year": year,
                        "quarter": quarter,
                        "counter": counter,
                    };

                    const newPostRef = push(dbref);

                    set(newPostRef, successData)
                        .then(() => {

                            $("#result").attr("class", "alert alert-success");
                            $("#result").html("Newsletter Updated Succesfully!");

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



//Checks if a HTML element with id: 'save-newsletter' is present.
var check = document.getElementById('save-newsletter');

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




const newsletterSection = document.querySelector('#newsletterSection');

var quarter = ["Spring","Summer","Fall","Winter"]


const createNewsletterList = (arr,temp) => {

    //This prints the year of the newsletter
    //Say the arr passed stores the data for two newsletter published in 2022.
    //Now, both have dates equal to 2022. So, we just do arr[0].year.
    newsletterSection.innerHTML += `
    <div class="row">&nbsp;
    <div class="col-md-8 blog-main">
          <h3 class="pb-4 mb-4 font-italic border-bottom  dateNews">
            ${arr[0].year}
          </h3>
    </div>
    </div>`;

    //This adds section for the actual newsletters
    //Say for 2022, we have one of this. Again for 2021, we will another of this which should have a unique ID
    //than the other one because it needs to be accessed later as you can see. That's why we have this temp
    //variable that is passed to the function which is unique for each array that's passed. Since one arr passed
    //refers to one year's newsletters, temp will be unique for each year.
    newsletterSection.innerHTML +=
    `<div class="row mb-2" id="innerSection${temp}">
    </div>
    `;

    const innerSection = document.querySelector(`#innerSection${temp}`);

    //Sorts the array in this order: Spring, Summer, Fall, Winter
    arr.sort(function(a,b){
        var quarter1 = parseInt(a.quarter)
        var quarter2 = parseInt(b.quarter)

            if(quarter1<quarter2)
            return -1
            if (quarter1 === quarter2)
            return 0
            else
            return 1

    })

    function crossFunction(num)
    {

        get(child(dbref2,"newsletter")).then((snapshot)=>{
            if(snapshot.exists())
            {

                snapshot.forEach(node =>{
                    //since the key for each dataset is randomized in firebase,
                    //we locate the particular dataset by going through each dataset with success-stories and checking if the
                    // dataset's counter is same as the counter for story which needs to be deleted.

                    if(node.val().counter==num)
                    {
                        alert(`ael newsletter-pdf/${node.val().fname}`)
                        deleteObject(sRef(storage,`newsletter-pdf/${node.val().fname}`))
                        remove(ref(database,"newsletter/"+node.key))
                        //After the story is successfully removed, we reload the window.
                        alert("The newsletter has been deleted!")
                        location.reload()
                    }

                })
            }
        })
    }
    window.crossFunction = crossFunction

    //Code for the "cross" button which is used to delete newsletters
    let cross = document.createElement('div');
    cross.setAttribute("class", "cross-admin");
    cross.textContent = 'x';
    cross.style.fontSize = "20px";
    cross.style.color = "white";

    //This will run as many times as there are newsletters in the particular year
    for(var i=0;i<arr.length;i++)
    {
        innerSection.innerHTML += `
        <div class="row-md-6" style="padding:10px;">
            <div class="cross" id="crossButton" onmouseover="" style="cursor: pointer;" onclick="crossFunction(${arr[i].counter})">x</div>
            <style>
            .cross
            {
                position: relative;
                font-size: 20px;
                left: 110px;
            }
            </style>
            <div  class="col no-gutters border rounded overflow-hidden flex-md-row  mb-4 shadow-sm h-md-250 position-relative" style="height: 350px; width:230px;" >
            <div class="col-auto d-none d-lg-block ">
            <iframe src="${arr[i].pdf}" frameborder="0" scrolling="no" frameborder="0" height="250px" width="200" style="padding-top:10px;cursor:pointer;"></iframe>
            <div class="col p-4 d-flex flex-column position-static">
            <a style="align-self:center;" target="_blank" href="${arr[i].pdf}"><strong style="cursor:pointer;"class="d-inline-block mb-2 topic-type" >${arr[i].name}</strong></a>
            <h3 style="align-self:center;" class="mb-0">${quarter[arr[i].quarter-1]}</h3>
            </div>
            </div>
            </div>
    `;
    }
}

  //
  function split(array) {
    let [...arr]  = array;
    var res = [];
    var currentYear;
    var counter=0;
    var lengthCounter=0;
    while (arr.length)
    {
        currentYear =  parseInt(arr[0].year);
        if(lengthCounter!=arr.length)
        {
            lengthCounter++;

            if(parseInt(arr[counter].year)==currentYear)
            {
                counter++;
            }

            else
            {
              res.push(arr.splice(0, counter));
              lengthCounter=0;
              counter = 0;
            }
        }
        else
        {
            res.push(arr.splice(0, counter));
            break;
        }
    }
    return res;
  }



get(child(dbref2,"newsletter")).then((snapshot)=>{
    if(snapshot.exists())
    {
        //snapshot.val() returns an object which has multiple objects inside of it as key-value pair.
        //object.values() function returns an array of given object's values. By extracting what we need and puttting it into an array,
        //we can then sort it, reverse it, and make other changes to it more easily now.
        var arr = Object.values(snapshot.val());
        //this is the sorting function that will sort the array giving most priority to the year value, and then to the quarter value
        arr.sort(function(a,b){
            var year1 = parseInt(a.year)
            var year2 = parseInt(b.year)
            var quarter1 = parseInt(a.quarter)
            var quarter2 = parseInt(b.quarter)

            if (year1 === year2)
            {
                if(quarter1<quarter2)
                return -1
                if (quarter1 === quarter2)
                return 0
                else
                return 1

            }
            if (year1 < year2)
            return -1
            else
            return 1
        })

        arr.reverse();
        console.log(arr)

        //splits the array based on the year.
        var slicedArr = split(arr);
        var temp=0;
        slicedArr.forEach(node => {
            createNewsletterList(node,temp);
            temp++;
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
