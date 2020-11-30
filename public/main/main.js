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
    firstMovieCover = document.getElementById("coverMovieOne");
    secondMovie = document.getElementById("MovieTwo");
    secondMovieCover = document.getElementById("coverMovieTwo");
    thirdMovie = document.getElementById("MovieThree");
    thirdMovieCover = document.getElementById("coverMovieThree");
    fourthMovie = document.getElementById("MovieFour");
    fourthMovieCover = document.getElementById("coverMovieFour");
    fifthMovie = document.getElementById("MovieFive");
    fifthMovieCover = document.getElementById("coverMovieFive");
    sixedMovie = document.getElementById("MovieSix");
    sixedMovieCover = document.getElementById("coverMovieSix");
    movies = await firebase.functions().httpsCallable('database-getAllMovies')();
    console.log(movies);
    i = 0;
    var storage = firebase.storage();
    movies.data.forEach( movie => {
        console.log(movie);
        let content = movie.data;
        if(i == 0) {
            storage.refFromURL(content.cover).getDownloadURL().then(url => {
                firstMovieCover.src = url;
            });
            firstMovieCover.style.width = "90%";
            firstMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 1) {
            storage.refFromURL(content.cover).getDownloadURL().then(url => {
                secondMovieCover.src = url;
            });
            secondMovieCover.style.width = "90%";
            secondMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 2) {
            storage.refFromURL(content.cover).getDownloadURL().then(url => {
                thirdMovieCover.src = url;
            });
            thirdMovieCover.style.width = "90%";
            thirdMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 3) {
            storage.refFromURL(content.cover).getDownloadURL().then(url => {
                fourthMovieCover.src = url;
            });
            fourthMovieCover.style.width = "90%";
            fourthMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 4) {
            storage.refFromURL(content.cover).getDownloadURL().then(url => {
                fifthMovieCover.src = url;
            });
            fifthMovieCover.style.width = "90%";
            fifthMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else if(i == 5) {
            storage.refFromURL(content.cover).getDownloadURL().then(url => {
                sixedMovieCover.src = url;
            });
            sixedMovieCover.style.width = "90%";
            sixedMovie.innerHTML = "<b>" + content.name + "</b><br \\>" + content.description + "<br \\><hr \\>";
        } else {

        }
        i++;
    });
}