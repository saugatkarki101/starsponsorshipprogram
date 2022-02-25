import {db, database, storage} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";

const dbref = ref(database, 'success-stories');
$.noConflict();
var validImageTypes = ["image/gif", "image/jpeg", "image/png"];

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
              
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
                {
                    var successData = 
                    {
                        "image": downloadURL,
                        "fname": fileCompleteName,
                        "desc": editDesc,
                        "name": userName,
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

                            },5000); 
                            
                            

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

//Checks if a HTML element with id: 'SaveChanges' is present. 
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
