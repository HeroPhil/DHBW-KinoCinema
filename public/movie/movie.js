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
const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
document.addEventListener("DOMContentLoaded", event => {
    app = firebase.app();
    functions = app.functions("europe-west1");
});
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

async function loadContent() {
    var id = location.search;
    id = id.replace("?id=", "");
    var paramMovie = {id: id};
    var movie = await functions.httpsCallable('database-getMovieByID')(paramMovie);
    var movieData = movie.data;
    console.log(movieData);
    var title = document.getElementById("movie-title");
    var description = document.getElementById("movie-description");
    var cover = document.getElementById("movie-cover");
    var storage = firebase.storage();
    title.innerHTML = movieData.data.name;
    description.innerHTML = movieData.data.description;
    storage.refFromURL(movieData.data.cover).getDownloadURL().then(url => {
       cover.src = url;
    });
    var subLevel = 4;
    var date = Math.floor(Date.now());
    var paramScreenings = {
        sublevel : subLevel,
        since : date
    };
    var singleScreeningData
    var screeningList = document.getElementById("movie-screening-list");
    var screeningsForMovie = await functions.httpsCallable("database-getAllScreenings")(paramScreenings);
    screeningData = screeningsForMovie.data;
    screeningData.forEach(screening => {
        singleScreeningData = screening.data;
        var screeningInput = document.createElement("input");
        screeningInput.setAttribute("type", "radio");
        screeningInput.setAttribute("id", screening.id);
        var screeninglabel = document.createElement("label");
        screeninglabel.setAttribute("for", screening.id);
        date = new Date(singleScreeningData.startTime);
        var text = days[date.getDay()] + "(" + date.getDate() + "." + date.getMonth() + 1 + "." + date.getFullYear() + ")<br>" + date.getHours() + ":" + date.getMinutes() + " Uhr";
        screeninglabel.innerHTML = text;
        screeningList.appendChild(screeningInput);
        screeningList.appendChild(screeninglabel);
    });
    console.log(screeningsMonday);
    var j = new Date().getDay();
    var i;
    screeningTable.createCaption().innerHTML = "Vorstellungen";
    var headings = screeningTable.insertRow(0);
    for(i = 0; i < days.length; i++) {
        if(j == 7) {
            j = 0;
        }
        headings.insertCell().innerHTML = days[j];
        j++;
    }
    screeningList.appendChild(screeningTable);
}