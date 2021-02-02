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
let storage;
document.addEventListener("DOMContentLoaded", event => {
    app = firebase.app();
    storage = firebase.storage();
    if (location.hostname === "127.0.0.1" || location.hostname === "localhost") {
        console.log('This is local emulator environment');
        functions = firebase.functions();
        functions.useFunctionsEmulator("http://localhost:5001");
    } else {
        functions = app.functions("europe-west1");
    }
});
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

let moviesData = [];
let moviesDataSorted = [];
let movieContainer;

async function loadContent() {
    movieContainer = document.getElementById("Movie-Container");
    var allMovies = await functions.httpsCallable('database-getAllMovies')({});
    saveMovieInfos(allMovies);
    moviesDataSorted = moviesData;
    addMoviesToWebsite();
} ///end of loadContent

function addMoviesToWebsite() {
    var numberOfMovies = parseInt(moviesDataSorted.length);
    for(var i = 0; i < numberOfMovies; i++) {
        var movieInfo = moviesDataSorted[i];
        createResultGraphic(movieInfo.cover, movieInfo.name, movieInfo.category);
    } //end of for
} //end of addMoviesToWebsite

function saveMovieInfos(movieInfos) {
    console.log(movieInfos);
    var numberOfMovies = parseInt(movieInfos.data.length);
    movies = movieInfos.data;
    for(var i = 0; i < numberOfMovies; i++) {
        var movieInfo = movies[i];
        var movieId = movieInfo.id;
        var movieData = movieInfo.data;
        var title = movieData.name;
        var category = movieData.category;
        var cover = movieData.cover;
        var description = movieData.description;
        var customizedMovieInfo = {
            id : movieId,
            name : title,
            category : category,
            cover : cover,
            description : description
        } //end of customizedMovieInfo
        moviesData.push(customizedMovieInfo);
    } //end of for
} //end of saveMovieInfos

async function createResultGraphic(gsLink, title, categorie) {
    var movieInfoContainer = document.createElement("div");
    movieInfoContainer.classList.add("resultMovie");
    var movieCover = document.createElement("img");
    movieCover.src = await getCoverUrl(gsLink);
    var movieTitle = document.createElement("div");
    movieTitle.classList.add("movieTitle");
    movieTitle.innerHTML = title;
    var movieCategorie = document.createElement("div");
    movieCategorie.classList.add("movieTitle");
    movieCategorie.innerHTML = categorie;
    movieInfoContainer.appendChild(movieCover);
    movieInfoContainer.appendChild(movieTitle);
    movieInfoContainer.appendChild(movieCategorie);
    movieContainer.appendChild(movieInfoContainer);
} //end of createResultGraphic

async function getCoverUrl(gsLink) {
    var coverUrl = storage.refFromURL(gsLink).getDownloadURL();
    return coverUrl;
} //end of getCoverUrl