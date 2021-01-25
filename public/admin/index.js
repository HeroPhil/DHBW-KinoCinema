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

let activeMovieID;

document.addEventListener('DOMContentLoaded', function() {
    OnLoad();
})

async function OnLoad(){
    switchEditOption(1);
    loadDropdown();
}

function switchEditOption(index){
    var listItems = document.getElementById("editOptions").getElementsByTagName("li");
    for (let index = 0; index < listItems.length; index++) {
        listItems[index].classList.remove("checked");
    }
    
    switch (index) {
        case 1:
            listItems[0].classList.add("checked");
            document.getElementById("editMovie").hidden = true;
            document.getElementById("movieInformation").hidden = false;
            break;
        case 2:
            listItems[1].classList.add("checked");
            document.getElementById("editMovie").hidden = false;
            document.getElementById("movieInformation").hidden = true;
            break;
    }
}



var API_Key = "d67e6d39e535da8b280d6346698efb87";

function searchMovie() {
    var search_content = document.getElementById("SearchInput").value;
    var movie_id = "36547";

    var searchQuery = "https://api.themoviedb.org/3/search/movie?api_key="+API_Key+"&query="+search_content;
    

    console.log(searchQuery);

    var search_request = new XMLHttpRequest();
    search_request.open('GET', searchQuery, true);
    search_request.onload = function() {
        var data = JSON.parse(this.response);
        if (search_request.status >= 200 && search_request.status < 400) {
            console.log(data.results);
            movie_id = data.results[0].id;
            loadMovie(movie_id);
        }else {
            console.log('error')
        }
    }
    
    search_request.send();

    
}

function loadMovie(movie_id) {
    console.log(movie_id);

    var getQuery = "https://api.themoviedb.org/3/movie/"+movie_id+"?api_key="+API_Key+"&language=en-US";
    var movie_request = new XMLHttpRequest();
    movie_request.open('GET', getQuery, true);
    movie_request.onload = function() {
        var movie_data = JSON.parse(this.response);
        if (movie_request.status >= 200 && movie_request.status < 400) {
            console.log(movie_data)
            document.getElementById("Movie_Title").value = movie_data.original_title;
            document.getElementById("Movie_Description").value = movie_data.overview;
            document.getElementById("Movie_Abstract").value = movie_data.overview;
            document.getElementById("Movie_Duration").value = movie_data.runtime;
            var categories = document.getElementById("Movie_Category");
            categories.value = "";
            movie_data.genres.forEach(genre => {
                categories.value = categories.value + genre.name + "|";
            });
            categories.value = categories.value.substring(0, categories.value.length-1);
            document.getElementById("Movie_Rating").value = movie_data.vote_average;
            document.getElementById("Movie_IMG").src = "https://image.tmdb.org/t/p/w500" + movie_data.poster_path;
        }else {
            console.log('error')
        }
    }
    
    movie_request.send();
}


function addMovie(){

}

async function loadDropdown(){
    
    let movies = await functions.httpsCallable('database-getAllMovies')({});
    
    var dropdown_content = document.getElementById("dropdown-content");

    movies.data.forEach( movie => {
        let content = movie.data;
        var entry = document.createElement("a");
        entry.onclick = function() {
            selectDropdownMovie(movie.id);
        };
        entry.innerHTML = content.name;
        dropdown_content.appendChild(entry);
    });
}

function selectDropdownMovie(id){
    document.getElementById("MovieIDInput").value = id;
}

async function loadDatabaseMovie(){
    var id = document.getElementById("MovieIDInput").value;
    
    const param = {id: id};

    let result = await functions.httpsCallable('database-getMovieByID')(param);
    var movie = result.data.data;
    document.getElementById("EDIT_Movie_Title").value = movie.name;
    document.getElementById("EDIT_Movie_Description").value = movie.description;
    document.getElementById("EDIT_Movie_Abstract").value = movie.description;
    document.getElementById("EDIT_Movie_Duration").value = movie.duration;
    document.getElementById("EDIT_Movie_Category").value = movie.category;
    document.getElementById("EDIT_Movie_Rating").value = movie.priority;

    const date = Math.floor(Date.now());
    const param2 = {
        sublevel: 4,
        since: date,
        id: id
    };

    let screenings = await functions.httpsCallable('database-getScreeningsOfMovieByID')(param2);
    console.log(screenings);
    var table = document.getElementById("screeningsTable");
    screenings.data.forEach(screening => {
        var row = document.createElement("tr");
        var tID = document.createElement("td");
        var tHall = document.createElement("td");
        var tPrice = document.createElement("td");
        var tStartTime = document.createElement("td");
        tID.innerHTML = screening.id;
        tHall.innerHTML = screening.data.hall.data.name;
        tPrice.innerHTML = screening.data.price;
        tStartTime.innerHTML = screening.data.startTime;
        row.appendChild(tID);
        row.appendChild(tHall);
        row.appendChild(tPrice);
        row.appendChild(tStartTime);
        table.appendChild(row);
        row.onclick = function() {test2(screening.id);}
    });
}







function test2(index){
    console.log(index);
}




function test(index) {
    var search_content = document.getElementById("SearchInput").value.replace(" ", "+");
    console.log(search_content);
    var API_Key = "d67e6d39e535da8b280d6346698efb87";
    var searchQuery = "https://api.themoviedb.org/3/search/movie?api_key="+API_Key+"&query="+search_content;
    console.log(searchQuery);
}
