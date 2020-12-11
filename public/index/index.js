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
    var i = 0;
    var storage = firebase.storage();
    var amount = "5";
    var param = {amount : amount};
    var topMovies = await functions.httpsCallable('database-getTopMovies')(param);
    topMovies.data.forEach( movie => {
        console.log(movie);
        content = movie.data;
        var dot = document.createElement("span");
        dot.classList.add("dot");
        dot.setAttribute("onclick", "currentSlide("+i+")");
        document.getElementById("dots").appendChild(dot);


        var slide = document.createElement("div");
            slide.classList.add("mySlides");
            slide.classList.add("fade");
            var slideContent = document.createElement("div");
                slideContent.classList.add("slideContent");
                var link = document.createElement("a");
                    //
                    link.href = "../movie/movie.html?id="+movie.id;
                    var box = document.createElement("div");
                        box.classList.add("box");
                        var table = document.createElement("table");
                            table.classList.add("tableSl");
                            var row1 = document.createElement("tr");
                                var imageSl = document.createElement("td");
                                    imageSl.classList.add("imageSl");
                                    imageSl.rowSpan = "2";
                                        var image = document.createElement("img");
                                        storage.refFromURL(content.cover).getDownloadURL().then( url => {
                                            image.src = url;
                                        })
                                imageSl.appendChild(image);
                                var title = document.createElement("td");
                                title.classList.add("titleSl");
                                //
                                title.textContent = content.name;
                            row1.appendChild(imageSl);
                            row1.appendChild(title);
                            var row2 = document.createElement("tr")
                                var desc = document.createElement("td");
                                desc.classList.add("descriptionSl");
                                //
                                desc.textContent = content.description;
                            row2.appendChild(desc);
                        table.appendChild(row1);
                        table.appendChild(row2);
                    box.appendChild(table);
                link.appendChild(box);
            slideContent.appendChild(link);
        slide.appendChild(slideContent);

        document.getElementById("slideshow-container").appendChild(slide);
    });

    var prevBut = document.createElement("a");
    prevBut.classList.add("prev");
    prevBut.setAttribute("onclick", "plusSlides(-1)");
    prevBut.text = "❮";
    var nextBut = document.createElement("a");
    nextBut.classList.add("next");
    nextBut.setAttribute("onclick", "plusSlides(1)");
    nextBut.text = "❯";
    document.getElementById("slideshow-container").appendChild(prevBut);
    document.getElementById("slideshow-container").appendChild(nextBut);

    showSlides(1);
}


var slideIndex = 1;

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