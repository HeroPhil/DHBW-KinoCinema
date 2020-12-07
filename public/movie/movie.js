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

async function loadMovie() {
    var id = "2q0KTjjgsK2RNRg65OX6";
    movieData = await firebase.functions().httpsCallable('database-getMovieByID')(id);
    title = document.getElementsByClassName("title");
    description = document.getElementsByClassName("description");
    cover = document.getElementsByClassName("movie-poster");
    var storage = firebase.storage();
    title.innerHTML = movieData.data.name;
    description.innerHTML = movieData.data.description;
    //storage.refFromURL(movieData.data.cover).getDownloadURL().then(url => {
    //   cover.src = url;
    //});
}