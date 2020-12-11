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

async function loadContent() {
    var id = location.search;
    id = id.replace("?id=", "");
    var param = {id: id};
    var movie = await functions.httpsCallable('database-getMovieByID')(param);
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
}