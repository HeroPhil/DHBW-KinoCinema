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
let foundResults = [];
let sortNameMode = false;
let sortRatingMode = false;
let preSearchRedirection;
let movieContainer;

async function loadContent() {
    try {
        var preSearch = sessionStorage.getItem("Search");
        if(preSearch.localeCompare("used") !== 0) {
            preSearchRedirection = true;
        } else {
            preSearchRedirection = false;
        } //end of if-else
        sessionStorage.setItem("Search", "used");
    } catch(err) {
        preSearchRedirection = false;
    }
    movieContainer = document.getElementById("Movie-Container");
    var allMovies = await functions.httpsCallable('database-getAllMovies')({});
    console.log(allMovies);
    saveMovieInfos(allMovies);
    moviesDataSorted = moviesData;
    if(preSearchRedirection) {
        searchWithParameter(preSearch);
    } else {
        addMoviesToWebsite();
    } //end of if-else

    endLoading();
} ///end of loadContent

function addMoviesToWebsite() {
    var numberOfMovies = parseInt(moviesDataSorted.length);
    for(var i = 0; i < numberOfMovies; i++) {
        var movieInfo = moviesDataSorted[i];
        createResultGraphic(movieInfo.cover, movieInfo.name, movieInfo.rating, movieInfo.id , i);
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
        var playTime = movieData.duration;
        var rating = movieData.priority;
        var customizedMovieInfo = {
            id : movieId,
            name : title,
            category : category,
            cover : cover,
            description : description,
            playTime : playTime,
            rating : rating
        } //end of customizedMovieInfo
        moviesData.push(customizedMovieInfo);
    } //end of for
} //end of saveMovieInfos


async function createResultGraphic(gsLink, title, rating, id , position) {
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
    movieCategorie.classList.add("movieCategory");
    movieCategorie.innerHTML = "Rating : ";
    var ratingSpan = document.createElement("span");
    ratingSpan.innerHTML = (rating / 10).toFixed(1) + "&#x269D;";
    movieCategorie.appendChild(ratingSpan);
    movieInfoContainer.appendChild(movieCover);
    movieInfoContainer.appendChild(movieTitle);
    movieInfoContainer.appendChild(movieCover);
    movieInfoContainer.appendChild(movieCategorie);
    refBorder.appendChild(movieInfoContainer);
    var orderPosition = "order : " + position;
    refBorder.setAttribute("style", orderPosition);
    movieContainer.appendChild(refBorder);
} //end of createResultGraphic

async function getCoverUrl(gsLink) {
    var coverUrl = storage.refFromURL(gsLink).getDownloadURL();
    return coverUrl;
} //end of getCoverUrl

function sortMoviesASC() {
    movieContainer.innerHTML = "";
    moviesDataSorted.sort((movieOne, movieTwo) => {
        var nameOne = new String(movieOne.name); // eslint-disable-line no-new-wrappers
        var nameTwo = new String(movieTwo.name); // eslint-disable-line no-new-wrappers
        return nameOne.localeCompare(nameTwo);
    });
    console.log(moviesDataSorted);
    for(var j = 0; j < moviesDataSorted.length; j++) {
        var movie = moviesDataSorted[j];
        console.log("Created element : " + movie.name);
        createResultGraphic(movie.cover, movie.name, movie.rating, movie.id , j);
    } //end of for
} //end of sortMoviesASC

function sortMoviesDESC() {
    movieContainer.innerHTML = "";
    moviesDataSorted.sort((movieOne, movieTwo) => {
        var nameOne = new String(movieOne.name); // eslint-disable-line no-new-wrappers
        var nameTwo = new String(movieTwo.name); // eslint-disable-line no-new-wrappers
        return nameTwo.localeCompare(nameOne);
    });
    console.log(moviesDataSorted);
    for(var j = 0; j < moviesDataSorted.length; j++) {
        var movie = moviesDataSorted[j];
        createResultGraphic(movie.cover, movie.name, movie.rating, movie.id, j);
    } //end of for
} //end of sortMoviesDESC

function sortMoviesByPlayTime() {
    movieContainer.innerHTML = "";
    moviesDataSorted.sort((movieOne, movieTwo) =>{
        if(movieTwo.playTime < movieOne.playTime) {
            return 1;
        } else if(movieTwo.playTime > movieOne.playTime) {
            return -1;
        } else {
            return 0;
        } //end of if-else 
    });
    console.log(moviesDataSorted);
    for(var j = 0; j < moviesDataSorted.length; j++) {
        var movie = moviesDataSorted[j];
        createResultGraphic(movie.cover, movie.name, movie.rating, movie.id, j);
    } //end of for
} //end of sortMoviesByPlayTime

function sortMoviesByRating() {
    if(sortRatingMode) {
        sortMoviesByRatingASC();
    } else {
        sortMoviesByRatingDESC();
    } //end of if-else
    sortRatingMode = !sortRatingMode;
} //end of sortMoviesByPlayTime

function sortMoviesByRatingASC() {
    movieContainer.innerHTML = "";
    moviesDataSorted.sort((movieOne, movieTwo) => {
        if(movieTwo.rating < movieOne.rating) {
            return -1;
        } else if(movieTwo.rating > movieOne.rating) {
            return 1;
        } else {
            return 0;
        } //end of if-else 
    });
    console.log(moviesDataSorted);
    for(var j = 0; j < moviesDataSorted.length; j++) {
        var movie = moviesDataSorted[j];
        createResultGraphic(movie.cover, movie.name, movie.rating, movie.id, j);
    } //end of for
} //end of sortMoviesByPlayTime

function sortMoviesByRatingDESC() {
    movieContainer.innerHTML = "";
    moviesDataSorted.sort((movieOne, movieTwo) => {
        if(movieTwo.rating < movieOne.rating) {
            return 1;
        } else if(movieTwo.rating > movieOne.rating) {
            return -1;
        } else {
            return 0;
        } //end of if-else 
    });
    console.log(moviesDataSorted);
    for(var j = 0; j < moviesDataSorted.length; j++) {
        var movie = moviesDataSorted[j];
        createResultGraphic(movie.cover, movie.name, movie.rating, movie.id, j);
    } //end of for
} //end of sortMoviesByPlayTime

function sortName() {
    if(sortNameMode) {
        sortMoviesDESC();
    } else {
        sortMoviesASC();
    } //end of if-else
    sortNameMode = !sortNameMode;
} //end of sortName

function search() {
    var input = document.getElementById("search-input");
    console.log(input.value);
    var searchString = input.value;
    searchWithParameter(searchString);
}

function searchWithParameter(searchString) {
    console.log(searchString);
    document.getElementById("search-input").value = searchString;
    searchString = searchString.toLocaleLowerCase();

    const foundResultsByTitle = [];
    const foundResultsByDescription = [];
    var movie, searchableTitle, searchableDescription;

    moviesData.forEach((movie) => {
        searchableTitle = movie.name.toLocaleLowerCase();
        searchableDescription = movie.description.toLocaleLowerCase();
        if (searchableTitle.includes(searchString)) {
            foundResultsByTitle.push(movie);
        } else if (searchableDescription.includes(searchString))  {
            foundResultsByDescription.push(movie);
        }
    }); //end of for

    const foundResults = foundResultsByTitle.sort().concat(foundResultsByDescription.sort());
    movieContainer.innerHTML = "";
    if(foundResults.length > 0) {
        for(var j = 0; j < foundResults.length; j++) {
            movie = foundResults[j];
            createResultGraphic(movie.cover, movie.name, movie.rating, movie.id, j);
        } //end of for
        moviesDataSorted = foundResults;
        return;
    } // end of if
    moviesDataSorted = moviesData;
} // end of search
