/*
  INFO: the index.js file contains all the JS code for the business logic of the 
  app. You don't need to touch that at all, but maybe take a quick look just to 
  get a sense of it.

  This file makes sure that all the other code works regardless of whether we have 
  an Internet connection or not.

  Remember that, when everything is working well, all our data is stored and accessed 
  from the database on our server (MySQL, Mongo, whatever).

  But if the Internet is down, how can we store that database content in the browser? We
  can't use cookies, and localStorage isn't built for real database-type data. So we use 
  indexedDB 
*/


/*
  INFO: Different browsers can have different names for the indexedDB object, so we 
  standardize that here.
*/
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;

/*
  TODO: Let's create a few variables for stuff we'll be referencing throughout the 
  code below. We'll create a variable for the database itself, and for the Object 
  Store in that database. An ObjectStore is sort of like a database table.

  For the database, I recommend something like "budget".
  For the object store, something like "transactions".
*/

const database = "your-variable-name-here"
const objectStore = "your-variable-name-here"

/*
  INFO: Here we tell indexedDb to open (or create) whatever database we 
  want to work with. The 1 is sort of like a versioning indicator.
*/
const request = indexedDB.open(database, 1);

/*
  INFO: We set up the Object Store below. Don't ask me why the method 
  that does this is named "onupgradeneeded" -- stuff like this gives 
  me migraines.
*/
request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore(objectStore, { autoIncrement: true });
};

/*
  INFO: If everything has been set up ok, we want to see whether the browser is 
  online or not. If it is online, we want IndexedDB to update the server with any 
  new data that has been collected or modified since the Internet went down. The 
  checkDatabase() method takes care of that.

  TODO: call the method I just named in line 74 below.
*/
request.onsuccess = ({ target }) => {
  db = target.result;
  // check if app is online before reading from db
  if (navigator.onLine) {
    // method goes here
  }
};

/* INFO: Simple error handler. Nothing to see here. Move along. */
request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

/*
  INFO: This method is called whenever it's time to save some data 
  to indexedDB. It's called from the index.js file anytime there is 
  an error saving to the server.

  TODO: replace the string named "OBJECT_STORE" with the objectStore 
  variable.
*/
function saveRecord(record) {
  const transaction = db.transaction(["OBJECT_STORE"], "readwrite");
  const store = transaction.objectStore("OBJECT_STORE");
  store.add(record);
}

/*
  INFO: When our Internet connection is restored, we need to update
  the server with any new/changed data.

  We have a route on the server which will be listening for anytime 
  we need to to a bulk upodate. This name of this route is:

  /api/transaction/bulk

  TODO: replace the string named "OBJECT_STORE" with the objectStore 
  variable.
*/
function checkDatabase() {
  const transaction = db.transaction(["OBJECT_STORE"], "readwrite");
  const store = transaction.objectStore("OBJECT_STORE");
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      
      /*
        INFO: This is a route we would create in Express (it's already done)
        to handle this kind of bulk update.
      */

      /*
        TODO: Insert the route name specified above.
      */

      fetch("INSERT_UPDATE_ROUTE_NAME_HERE", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => {        
        return response.json();
      })
      .then(() => {
        // delete indexedDB records if the update is successful
        const transaction = db.transaction([objectStore], "readwrite");
        const store = transaction.objectStore(objectStore);
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);