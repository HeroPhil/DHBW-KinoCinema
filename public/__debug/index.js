// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// // The Firebase SDK is initialized and available here!
//
// firebase.auth().onAuthStateChanged(user => { });
// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
// firebase.firestore().doc('/foo/bar').get().then(() => { });
// firebase.functions().httpsCallable('yourFunction')().then(() => { });
// firebase.messaging().requestPermission().then(() => { });
// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
// firebase.analytics(); // call to activate
// firebase.analytics().logEvent('tutorial_completed');
// firebase.performance(); // call to activate
let app;
let functions;
document.addEventListener("DOMContentLoaded", event => {
    app = firebase.app();
    functions = app.functions("europe-west1");
});
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥


const { gunzipSync } = require("zlib");



var functions = firebase.app().functions('europe-west1');

const nameCollectionPath = 'temp/demo/names/';

function getNumber() {
    let ausgabeP = document.getElementById("ausgabe");
    functions.httpsCallable('temp-randomNumber')()
    .then(result => {
        console.log(result.data);
        ausgabeP.innerHTML = result.data;
    });
}

function getName() {
    let eingabeID = document.getElementById("eingabeID");
    let eingabeData = document.getElementById("eingabeData");
    let ausgabeP = document.getElementById("ausgabe");

    ausgabeP.innerHTML = "";

    const id = nameCollectionPath+eingabeID.value;
    const param = {id: id};

    functions.httpsCallable('database-getDocumentByID')(param)
    .then(result => {
        console.log(result.data);
        eingabeData.value = result.data.name;
    });
}

async function addName() {
    let eingabeID = document.getElementById("eingabeID");
    let eingabeData = document.getElementById("eingabeData");
    let ausgabeP = document.getElementById("ausgabe");

    ausgabeP.innerHTML = "";

    const id = nameCollectionPath+eingabeID.value;
    const param = {
        id: id,
        data: {
            name: eingabeData.value
        }
    };

    await functions.httpsCallable('database-setDocumentByID')(param);
    ausgabeP.innerHTML = "successfully added";
}

async function updateName() {
    let eingabeID = document.getElementById("eingabeID");
    let eingabeData = document.getElementById("eingabeData");
    let ausgabeP = document.getElementById("ausgabe");

    ausgabeP.innerHTML = "";

    const id = nameCollectionPath+eingabeID.value;
    const param = {
        id: id,
        data: {
            name: eingabeData.value
        }
    };

    await functions.httpsCallable('database-updateDocumentByID')(param);
    ausgabeP.innerHTML = "successfully updated";
}

async function getMovies() {
    let ausgabeP = document.getElementById("ausgabe");

    ausgabeP.innerHTML = "";

    let movies = await functions.httpsCallable('database-getAllMovies')({});
    console.log(movies);

    let ausgabeString = "";
    movies.data.forEach( movie => {
        console.log(movie);
        let content = movie.data;
        ausgabeString += "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
    });
    ausgabeP.innerHTML = ausgabeString;
}

async function getOneMovie() {
    let eingabeID = document.getElementById("eingabeID");
    let ausgabeP = document.getElementById("ausgabe");

    const id = eingabeID.value;

    ausgabeP.innerHTML = "";

    const param = {id: id};

    functions.httpsCallable('database-getMovieByID')(param)
        .then(result => {
            console.log(result.data);
        });
}

async function getTopMovies() {
    let eingabeID = document.getElementById("eingabeID");
    let ausgabeP = document.getElementById("ausgabe");

    const amount = eingabeID.value;

    ausgabeP.innerHTML = "";

    const param = {amount: amount};

    let movies = await functions.httpsCallable('database-getTopMovies')(param);

    console.log(movies);

    let ausgabeString = "";
    movies.data.forEach( movie => {
        console.log(movie);
        let content = movie.data;
        ausgabeString += "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
    });
    ausgabeP.innerHTML = ausgabeString;
}


async function getAllScreenings() {

    let ausgabeP = document.getElementById("ausgabe");
    ausgabeP.innerHTML = "";

    const date = Math.floor(Date.now() / 1000);
    const param = {
        sublevel: 4,
        since: date
    };

    let screenings = await functions.httpsCallable('database-getAllScreenings')(param);

    console.log(screenings);
}

async function getScreeningsOfMovie() {
    let ausgabeP = document.getElementById("ausgabe");
    let eingabeID = document.getElementById("eingabeID");

    ausgabeP.innerHTML = "";

    const date = Math.floor(Date.now() / 1000);
    const param = {
        sublevel: 4,
        since: date,
        id: eingabeID.value
    };

    let screenings = await functions.httpsCallable('database-getScreeningsOfMovieByID')(param);

    console.log(screenings);
}

function getImage() {
    eingabeID = document.getElementById("eingabeID");
    image = document.getElementById("image");

    firebase.storage().refFromURL(eingabeID.value).getDownloadURL().then(url => {
        image.src = url;
    });
}


function signIn() {
    let ausgabeP = document.getElementById("ausgabe");
    let email = document.getElementById("email");
    let pass = document.getElementById("pass");

    ausgabeP.innerHTML = "";

    firebase.auth().signInWithEmailAndPassword(email.value, pass.value)
    .then((user) => {
        // Signed in 
        console.log(user);
        email.innerHTML = "";
        pass.innerHTML = "";
        ausgabeP.innerHTML = "Signed in as user with uid: "+ user.user.uid;
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    });   
}

function signOut(){
    let ausgabeP = document.getElementById("ausgabe");

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        ausgabeP.innerHTML = "Signed out";
      }).catch(function(error) {
        // An error happened.
      });
}

async function getSecuredData() {
    let ausgabeP = document.getElementById("ausgabe");
    let eingabeID = document.getElementById("eingabeID");

    ausgabeP.innerHTML = "";

    const param = {
        
    };

    let result = await functions.httpsCallable('database-getSecuredData')(param);

    console.log(result);
    
    if (result.data.error) {
        ausgabeP.innerHTML = "ERROR! You are not signed in!";
    } else{ 
        ausgabeP.innerHTML = "Look into the console";
    }
}

async function googleLogin() {
    ausgabeP = document.getElementById("ausgabe");
    const providerGoogle = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(providerGoogle).then(result => {
        const user = result.user;
        ausgabeP.innerHTML = user.displayName;
        console.log(user);
    }).catch(console.log)
}