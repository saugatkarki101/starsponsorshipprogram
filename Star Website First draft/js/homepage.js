import {db, database} from './firebase.js';
import { collection, addDoc, deleteDoc, getDocs, doc, getDoc, orderBy, onSnapshot, where, query, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import {getDatabase, ref, set, child, update, remove, get} from
"https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

//Initializing an instance of the database stored in the firebase.
const dbref = ref(database);

//If data is stored in "title" within Firebase, it is retrieved and set to the HTML element with id: "title"
get(child(dbref,"title")).then((snapshot)=>{
    if(snapshot.exists())
    {
        var titleDatabase = snapshot.val().info;
        document.getElementById("title").innerHTML = titleDatabase;
    }
})

get(child(dbref,"titleDescription")).then((snapshot)=>{
    if(snapshot.exists())
    {
        var titleDatabase = snapshot.val().info;
        document.getElementById("titleDescription").innerHTML = titleDatabase;
    }
})



//The function to save the changes made by the admin
function save()
{
      //Retrieves the contents of the HTML element with id: 'title' and updates database with the same content
      var editTitleContent = document.getElementById('title').innerHTML;
      update(ref(database,'title'),{
        info: editTitleContent
    });

    //Retrieves the contents of the HTML element with id: 'titleDescription' and updates database with the same content
    var editTitleDescripContent = document.getElementById('titleDescription').innerHTML;
    update(ref(database,'titleDescription'),{
      info: editTitleDescripContent
    });

    //Sends a notification when all the contents are saved.
    alert("Changes Saved!")
}

//Checks if a HTML element with id: 'SaveChanges' is present.
var check = document.getElementById('saveChanges');

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


const storyContainer = document.querySelector('.rowhideme');


//This creates a new section with every other success story
const createCards = (node) => {

  /*
  successStoriesSection.innerHTML += `
  <div class="succStoriesCard" id="succStoriesCardID">

  <div class="cross" id="crossButton" onmouseover="" style="cursor: pointer;" onclick="crossfunc(${node.val().counter})">x</div>
      <img src="${node.val().image}" class="image" alt="">
      <h1 class="name">${node.val().name.substring(0, 100)}</h1>
      <p class="desc">${node.val().desc.substring(0, 200) + '...'}</p>
      <a class="btn dark" id="readButton" onclick="myfunc(${node.val().counter})" href="successStoriesPage.html">Read more..</a>
  </div>
  `;
  */

  //-------- Hard Coded Featured Success Stories ----------//
  /*
  <div class="col-lg-4 col-md-6 col-sm-4 text-center">
    <img class="rounded-circle content-o" alt="140x140" style="width: 200px; height: 200px;" src="images/kids/sam.png" data-holder-rendered="true">

    <h3>Sam Smith</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p><a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" href="#" role="button">READ SAM'S STORY&nbsp; &nbsp;</a>
    </div>

    <div class="col-lg-4 col-md-6 col-sm-12 text-center">
    <img class="rounded-circle " alt="140x140" style="width: 200px; height: 200px;" src="images/kids/tiffany.png" data-holder-rendered="true">
    <h3>Tiffany Johnson</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p><a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" href="#" role="button">READ TIFFANY'S STORY&nbsp;&nbsp;</a>
    </div>

    <div class="col-lg-4 col-md-6 col-sm-12 text-center">
    <img class="rounded-circle " alt="140x140" style="width: 200px; height: 200px;" src="images/kids/jenny.png" data-holder-rendered="true">
    <h3>Jenny Hill</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p><a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" href="#" role="button">READ JENNY'S STORY&nbsp;&nbsp;</a>
	</div> */


  const first = node.val().name.split(/\s+(.*)/);
  const firstName = first[0]
  storyContainer.innerHTML += `
                <div class="col-lg-4 col-md-6 col-sm-12 text-center">
                  <img class="rounded-circle content-o" alt="140x140" style="width: 200px; height: 200px; object-fit: cover;" src="${node.val().image}" data-holder-rendered="true">

                  <h3 class="name">${node.val().name.substring(0, 100)}</h3>
                  <p>${node.val().desc.substring(0, 85) + '...'}</p>
                  <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" id="readButton"  role="button" onclick="myfunc(${node.val().counter})" href="successStoriesPage.html">Read ${firstName}'s story&nbsp; &nbsp;</a>
                  <a class="btn btn-primary btn-lg animate__animated animate__fadeIn btnAdjust" href="successStoriesPage.html" role="button"
                  onclick="myfunc(${node.val().counter})>Read more...&nbsp; &nbsp;</a>
                </div>
          `
}

var storyCounter = 0;
get(child(dbref,"success-stories")).then((snapshot)=>{
  if(snapshot.exists())
  {
      snapshot.forEach(node =>{
          //This ensures only 3 stories are shown in the homepage
          if(storyCounter < 3)
          {
            //every dataset related to every story is passed one by one to createCards() function
            createCards(node);
          }
          storyCounter++;
      })
  }
}) //End Create Card code
