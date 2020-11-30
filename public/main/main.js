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

async function loadMovies() {
    firstMovie = document.getElementById("MovieOne");
    secondMovie = document.getElementById("MovieTwo");
    thirdMovie = document.getElementById("MovieThree");
    fourthMovie = document.getElementById("MovieFour");
    fifthMovie = document.getElementById("MovieFive");
    sixedMovie = document.getElementById("MovieSix");
    movies = await firebase.functions().httpsCallable('database-getAllMovies')();
    console.log(movies);
    i = 0;
    movies.data.forEach( movie => {
        console.log(movie);
        let content = movie.data;
        if(i == 0) {
            firstMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 1) {
            secondMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 2) {
            thirdMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 3) {
            fourthMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 4) {
            fifthMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 5) {
            sixedMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else {

        }
        i++;
    });
}