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
let moviesAction = [];
let moviesThriller = [];
let moviesAdventure = [];
let moviesRomantic = [];
let moviesCommedy = [];
let moviesHorror = [];
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
        createResultGraphic(movieInfo.cover, movieInfo.name, movieInfo.category, movieInfo.id);
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
        saveToSpecificInfoArray(category, customizedMovieInfo);
    } //end of for
} //end of saveMovieInfos

function saveToSpecificInfoArray(pCategory, Info) {
    switch(pCategory) {
        case "Abenteuer":
            moviesAdventure.push(Info);
            break;
        case "Horror":
            moviesHorror.push(Info);
            break;
        case "Romantik":
            moviesRomantic.push(Info);
            break;
        case "Komödie":
            moviesCommedy.push(Info);
            break;
        case "Action":
            moviesAction.push(Info);
            break;
        case "Thriller":
            moviesThriller.push(Info);
            break;
        default:
            console.log("Found new movie category!");
            break;
    } //end of switch case
} //end of saveToSpecificInfoArray

async function createResultGraphic(gsLink, title, categorie, id) {
    var refBorder = document.createElement("a");
    refBorder.href = "../movie/?id=" + id;
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
    refBorder.appendChild(movieInfoContainer);
    movieContainer.appendChild(refBorder);
} //end of createResultGraphic

async function getCoverUrl(gsLink) {
    var coverUrl = storage.refFromURL(gsLink).getDownloadURL();
    return coverUrl;
} //end of getCoverUrl

function sortByCategorie() {
    movieContainer.innerHTML = "";
    for(var i = 0; i < moviesThriller.length; i++) {
        var movieInfo = moviesThriller[i];
        var movieId = movieInfo.id;
        var movieData = movieInfo.data;
        var title = movieData.name;
        var category = movieData.category;
        var cover = movieData.cover;
        var description = movieData.description;
        var time = movieData.duration;
        var customizedMovieInfo = {
            id : movieId,
            name : title,
            category : category,
            cover : cover,
            description : description,
            playTime : time
        } //end of customizedMovieInfo
        moviesDataSorted.push(customizedMovieInfo);
    } //end of for
    for(varj = 0; j < moviesAdventure.length; j++) {
        var movieInfo = moviesAdventure[j];
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
        moviesDataSorted.push(customizedMovieInfo);
    } //end of for
    for(var k = 0; k < moviesAction.length; k++) {
        var movieInfo = moviesAction[k];
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
        moviesDataSorted.push(customizedMovieInfo);
    } //end of for
    for(var h = 0; h < moviesRomantic.length; h++) {
        var movieInfo = moviesRomantic[h];
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
        moviesDataSorted.push(customizedMovieInfo);
    } //end of for
    for(var l = 0; l < moviesCommedy.length; l++) {
        var movieInfo = moviesCommedy[l];
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
        moviesDataSorted.push(customizedMovieInfo);
    } //end of for
    for(var m = 0; m < moviesHorror.length; m++) {
        var movieInfo = moviesHorror[m];
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
        moviesDataSorted.push(customizedMovieInfo);
    } //end of for
} //end of sortByCategorie

function sortMoviesASC() {
    movieContainer.innerHTML = "";
    var counter = 0;
    var movieOne;
    var movieTwo;
    var saver;
    while(counter !== moviesDataSorted.length - 1) {
        counter = 0;
        for(var i = 0; i < moviesDataSorted.length - 1; i++) {
            movieOne = moviesDataSorted[i];
            movieTwo = moviesDataSorted[i + 1];
            if(movieOne.name <= movieTwo.name) {
                counter++;
            } else {
                saver = movieTwo;
                movieTwo = movieOne;
                movieOne = saver;
            } //end of if-else
        } //end of for
    } //end of while
    for(var j = 0; j < moviesDataSorted.length; j++) {
        var movie = moviesDataSorted[j];
        createResultGraphic(movie.cover, movie.name, movie.category, movie.id);
    } //end of for
} //end of sortMoviesASC

function sortMoviesDESC() {
    movieContainer.innerHTML = "";
    var counter = 0;
    var movieOne;
    var movieTwo;
    var saver;
    while(counter !== moviesDataSorted.length - 1) {
        counter = 0;
        for(var i = 0; i < moviesDataSorted.length - 1; i++) {
            movieOne = moviesDataSorted[i];
            movieTwo = moviesDataSorted[i + 1];
            if(movieOne.name >= movieTwo.name) {
                counter++;
            } else {
                saver = movieTwo;
                movieTwo = movieOne;
                movieOne = saver;
            } //end of if-else
        } //end of for
    } //end of while
    for(var j = 0; j < moviesDataSorted.length; j++) {
        var movie = moviesDataSorted[j];
        createResultGraphic(movie.cover, movie.name, movie.category, movie.id);
    } //end of for
} //end of sortMoviesASC

function sortMoviesByPlayTime() {
    movieContainer.innerHTML = "";
    var counter = 0;
    var movieOne;
    var movieTwo;
    var saver;
    while(counter !== moviesDataSorted.length - 1) {
        counter = 0;
        for(var i = 0; i < moviesDataSorted.length - 1; i++) {
            movieOne = moviesDataSorted[i];
            movieTwo = moviesDataSorted[i + 1];
            if(parseInt(movieOne.playTime) <= parseInt(movieTwo.playTime)) {
                counter++;
            } else {
                saver = movieTwo;
                movieTwo = movieOne;
                movieOne = saver;
            } //end of if-else
        } //end of for
    } //end of while
    for(var j = 0; j < moviesDataSorted.length; j++) {
        var movie = moviesDataSorted[j];
        createResultGraphic(movie.cover, movie.name, movie.category, movie.id);
    } //end of for
} //end of sortMoviesASC