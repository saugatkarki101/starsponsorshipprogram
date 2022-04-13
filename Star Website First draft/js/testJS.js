import {db, database, storage, auth, onAuthStateChanged} from './firebase.js';
import {getDatabase, ref, set, child, update, remove, get, orderByChild, limitToFirst, onValue} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

console.log("Counter Values");
/*
function retrievefB()
{
    //------- Retrieve Firebase Success Stories --------//
    const dbSuccess = query(ref(database, 'success-stories', orderByChild('counter'), limitToFirst(3))); //Limits to first 3, from lowest counter to newest
    onValue(dbSuccess, (snapshot) => {
        if(snapshot.exists())
        {
            console.log(snapshot.val().counter);
            
            snapshot.forEach(function(singleStory)
            {
              console.log( "counter: " + singleStory.val().counter ); //Will print every counter
            }); 
        }

    });

}//------- END Retrieve Firebase Success Stories --------//
*/
//retrievefB();