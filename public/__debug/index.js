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
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥


const nameCollectionPath = 'temp/demo/names/';

function getNumber() {
    let ausgabeP = document.getElementById("ausgabe");
    firebase.functions().httpsCallable('temp-randomNumber')()
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

    firebase.functions().httpsCallable('database-getDocumentByID')(param)
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

    await firebase.functions().httpsCallable('database-setDocumentByID')(param);
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

    await firebase.functions().httpsCallable('database-updateDocumentByID')(param);
    ausgabeP.innerHTML = "successfully updated";
}

async function getMovies() {
    let ausgabeP = document.getElementById("ausgabe");

    ausgabeP.innerHTML = "";

    let movies = await firebase.functions().httpsCallable('database-getAllMovies')();
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

    firebase.functions().httpsCallable('database-getMovieByID')(param)
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

    let movies = await firebase.functions().httpsCallable('database-getTopMovies')(param);

    console.log(movies);

    let ausgabeString = "";
    movies.data.forEach( movie => {
        console.log(movie);
        let content = movie.data;
        ausgabeString += "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
    });
    ausgabeP.innerHTML = ausgabeString;
}