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

<<<<<<< HEAD
function loadMovies() {
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
    var i = 0;
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

    //slideBarItemOne = document.getElementByID("slidebar-item-one");
    //slideBarItemTwo = document.getElementByID("slidebar-item-two");
    //slideBarItemThree = document.getElementByID("slidebar-item-three");
    //slideBarItemFour = document.getElementByID("slidebar-item-four");
    //slideBarItemFive = document.getElementByID("slidebar-item-five");
    //slideBarItemSix = document.getElementByID("slidebar-item-six");
    //slideBarItemOne.onlick = loadMovie('2q0KTjjgsK2RNRg65OX6'); 
    //slideBarItemTwo.onlick = loadMovie('J4ABKzgdB9JpmfULVfkm');
    //slideBarItemThree.onlick = loadMovie('hP8S6gTaj7VrgEuTYg3u');
    //slideBarItemFour.onlick = loadMovie('j84TwNaznmd6vowZXVHB');
    //slideBarItemFive.onlick = loadMovie('jQdquoErNFeLBVh644NA');
    //slideBarItemSix.onlick = loadMovie('jytDV8mdKIff8kleVEOc');
}
=======
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

>>>>>>> e2b9b090a1b7cd959006f0ad705476cced9af6a0
