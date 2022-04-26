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

        get(child(dbref,"FeaturedStories")).then((snapshot2)=>{
          if(snapshot2.exists())
          {
              //stores the counter of the story the reader wants to read
              snapshot2.forEach(node2 =>{

                              if(node2.val().Counter == node.val().counter)
                              {
                                  //This ensures only 3 stories are shown in the homepage
                                  if(storyCounter < 3)
                                  {
                                    //every dataset related to every story is passed one by one to createCards() function
                                    createCards(node);
                                  }
                                  storyCounter++;
                              }
              })
          }})

      })




  }
}) //End Create Card code

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






const inTheNews = document.querySelector("#inTheNews")
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

//This creates a new section with every other success story
const createBlogs = (node) => {


  const first = node.val().name.split(/\s+(.*)/);
  const firstName = first[0]
  inTheNews.innerHTML += `

  <div class="col-md-6">
  <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
  <div class="col p-4 d-flex flex-column position-static">
  <strong class="d-inline-block mb-2 text-primary" style="color:black !important;">${node.val().name}</strong>
  <h3 class="mb-0"></h3>
  <div class="mb-1 text-muted">${months[node.val().month-1]+' '+node.val().day+', '+node.val().year}</div>
  <p class="card-text mb-auto">${node.val().desc.substring(0, 85) + '...'}</p>
  <a href="individualBlogPage.html" onClick="updateBlogCounter(${node.val().counter})" class="stretched-link">Continue reading</a>
  </div>
  <div class="col-auto d-none d-lg-block">
  <!--<svg class="bd-placeholder-img" width="200" height="250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>-->
  <img src="${node.val().image}" width="200" height="250" style="object-fit:cover;" alt=""/> </div>
  </div>
  </div>


          `
}

var storyCounter = 0;
get(child(dbref,"blogs")).then((snapshot)=>{
  if(snapshot.exists())
  {
      snapshot.forEach(node =>{

        get(child(dbref,"InTheNews")).then((snapshot2)=>{
          if(snapshot2.exists())
          {
              //stores the counter of the blog the reader wants to read
              snapshot2.forEach(node2 =>{

                              if(node2.val().Counter == node.val().counter)
                              {
                                  //This ensures only 3 stories are shown in the homepage
                                 // if(storyCounter < 3)
                                  {
                                    //every dataset related to every story is passed one by one to createCards() function
                                    createBlogs(node);
                                  }
                                  storyCounter++;
                              }
              })
          }})

      })




  }
}) //End Create Card code
