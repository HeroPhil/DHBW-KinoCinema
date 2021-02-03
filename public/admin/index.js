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
let rows = [];
let file;
let activeMovieID;

document.addEventListener('DOMContentLoaded', () => {
    OnLoad();
});

function endLoading() {
    document.getElementById("loading").hidden = true;
    document.getElementById("contentToHide").hidden = false;
}

function startLoading() {
    document.getElementById("loading").hidden = false;
    document.getElementById("contentToHide").hidden = true;
}

async function OnLoad(){
    await functions.httpsCallable('database-checkIfCurrentUserIsAdmin')({}).then((admin) => {
        if(admin.data.error){
            window.location = "../index";
        }
        return;
    }).catch((error) => {
        window.location = "../index";
        return;
    });
    
    switchEditOption(1);
    loadDropdownHalls();
    loadDropdownRowTypes();
    addNeededEventListerns();
    
    endLoading();
}

function addNeededEventListerns(){
    document.getElementById("SearchInput").addEventListener('focusout', () => {
        searchMovie();
    });
    document.getElementById("SearchInput").addEventListener("keyup", event => {
        if(event.key === "Enter"){
            document.getElementById("SearchButton").focus();
        }
    });
    document.getElementById("MovieIDInput").addEventListener('focusout', () => {
        loadDatabaseMovie();
    });
    document.getElementById("MovieIDInput").addEventListener("keyup", event => {
        if(event.key === "Enter"){
            document.getElementById("SearchButton").focus();
        }
    });
    document.getElementById("Movie_Cover_URL").addEventListener('focusout', () => {
        document.getElementById("Movie_IMG").src = document.getElementById("Movie_Cover_URL").value;
    });
    document.getElementById("EDIT_Movie_Cover_Upload").addEventListener('input', () => {
        setCoverFile();
    });
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
            document.getElementById("addHall").hidden = true;
            document.getElementById("editUserPermissions").hidden = true;
            break;
        case 2:
            listItems[1].classList.add("checked");
            document.getElementById("editMovie").hidden = false;
            document.getElementById("movieInformation").hidden = true;
            document.getElementById("addHall").hidden = true;
            document.getElementById("editUserPermissions").hidden = true;
            loadDropdownMovies();
            break;
        case 3:
            listItems[2].classList.add("checked");
            document.getElementById("editMovie").hidden = true;
            document.getElementById("movieInformation").hidden = true;
            document.getElementById("addHall").hidden = false;
            document.getElementById("editUserPermissions").hidden = true;
            break;
        case 4:
            listItems[3].classList.add("checked");
            document.getElementById("editMovie").hidden = true;
            document.getElementById("movieInformation").hidden = true;
            document.getElementById("addHall").hidden = true;
            document.getElementById("editUserPermissions").hidden = false;
            break;
    }
}



var API_Key = "d67e6d39e535da8b280d6346698efb87";

function searchMovie() {
    startLoading();
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

    endLoading();
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
            document.getElementById("Movie_Duration").value = movie_data.runtime;
            var categories = document.getElementById("Movie_Category");
            categories.value = "";
            movie_data.genres.forEach(genre => {
                categories.value = categories.value + genre.name + "|";
            });
            categories.value = categories.value.substring(0, categories.value.length-1);
            document.getElementById("Movie_Rating").value = movie_data.vote_average;
            document.getElementById("Movie_Cover_URL").value = "https://image.tmdb.org/t/p/w500" + movie_data.poster_path;
            document.getElementById("Movie_IMG").src = "https://image.tmdb.org/t/p/w500" + movie_data.poster_path;
        }else {
            console.log('error')
        }
    }
    
    movie_request.send();
}


async function addMovie(){
    startLoading();
    let title = document.getElementById("Movie_Title").value;
    let description = document.getElementById("Movie_Description").value;
    let duration = document.getElementById("Movie_Duration").value;
    let categoriesAsString = document.getElementById("Movie_Category").value;
    let categories = categoriesAsString.split("|");
    let rating = Number(document.getElementById("Movie_Rating").value);
    rating = rating * 10;
    let coverURL = document.getElementById("Movie_IMG").src;

    const param = {
        name: title,
        description: description,
        duration: duration,
        categories: categories,
        priority: rating
    };
    console.log(param);
    let movie = await functions.httpsCallable('database-addMovie')(param);
    console.log(movie);
    if(movie.data.error) {
        alert(movie.data.error.message);
    }
    let movieID = movie.data.id;
    let newCoverUrl = await firebase.storage().ref().child('/live/events/movies/cover/' + movieID).put(await (await fetch(coverURL)).blob());
    console.log(newCoverUrl);
    endLoading();
}


async function loadDropdownMovies(){
    
    let movies = await functions.httpsCallable('database-getAllMovies')({});
    
    var dropdown_content = document.getElementById("dropdown-content");

    while(dropdown_content.firstChild){
        dropdown_content.removeChild(dropdown_content.lastChild);
    }

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
    loadDatabaseMovie();
}

async function loadDropdownHalls(){
    
    let halls = await functions.httpsCallable('database-getAllHalls')({});
    
    var dropdown_contentEDIT = document.getElementById("dropdownHalls-content");
    var dropdown_contentADD = document.getElementById("dropdownHallsADD-content");

    halls.data.forEach( hall => {
        let hall_content = hall.data;
        var entryEDIT = document.createElement("a");
        entryEDIT.onclick = function() {
            selectDropdownHallEDIT(hall.id);
        };
        entryEDIT.innerHTML = hall_content.name;
        dropdown_contentEDIT.appendChild(entryEDIT);

        var entryADD = document.createElement("a");
        entryADD.onclick = function() {
            selectDropdownHallADD(hall.id);
        };
        entryADD.innerHTML = hall_content.name;
        dropdown_contentADD.appendChild(entryADD);
    });
}

async function loadDropdownRowTypes(){
    let rowTypes = await functions.httpsCallable('database-getAllRowTypes')({});
    rowTypesData = rowTypes.data;
    var dropdown_content_rows = document.getElementById("dropdownRowTypes-content");

    rowTypesData.forEach( row => {
        var entryType = document.createElement("a");
        entryType.onclick = function() {
            selectDropdownRowType(row.id);
        };
        entryType.innerHTML = row.data.name;
        dropdown_content_rows.appendChild(entryType);
    });
}

function selectDropdownHallEDIT(id){
    document.getElementById("EDIT_Screening_Hall").value = id;
}
function selectDropdownHallADD(id){
    document.getElementById("EDIT_ADD_Screening_Hall").value = id;
}

function selectDropdownIncrement(value){
    document.getElementById("EDIT_ADD_Increment").value = value;
}

function selectDropdownRowType(type){
    document.getElementById("ADD_Row_Type").value = type;
}

async function loadDatabaseMovie(){
    startLoading();
    var id = document.getElementById("MovieIDInput").value;
    document.getElementById("editMovieContent").hidden = false;
    document.getElementById("editScreenings").hidden = false;
    document.getElementById("UpdateInformationButton").hidden = false;
    const param = {id: id};

    let result = await functions.httpsCallable('database-getMovieByID')(param);
    console.log(result);
    var movie = result.data.data;
    document.getElementById("EDIT_Movie_Title").value = movie.name;
    document.getElementById("EDIT_Movie_Description").value = movie.description;
    document.getElementById("EDIT_Movie_Duration").value = movie.duration;
    document.getElementById("EDIT_Movie_Category").value = movie.categories.join("|");
    document.getElementById("EDIT_Movie_Rating").value = movie.priority;
    document.getElementById("EDIT_Movie_Cover_URL").value = movie.cover;
    loadScreenings(id);
    document.getElementById("EDIT_Movie_IMG").src = await firebase.storage().refFromURL(movie.cover).getDownloadURL();
    endLoading();
}

async function loadScreenings(pID) {
    const date = Math.floor(Date.now());
    const param2 = {
        sublevel: 4,
        since: date,
        id: pID
    };

    let screenings = await functions.httpsCallable('database-getScreeningsOfMovieByID')(param2);
    
    var table = document.getElementById("screeningsTable");

    
    while(table.rows.length > 1){
        table.deleteRow(-1);
    }
    table.setAttribute("movieID", pID);
    screenings.data.forEach(screening => {
        var row = document.createElement("tr");
        var tID = document.createElement("td");
        var tHall = document.createElement("td");
        var tPrice = document.createElement("td");
        var tStartTime = document.createElement("td");
        tID.innerHTML = screening.id;
        tHall.innerHTML = screening.data.hall.data.name;
        tHall.setAttribute("hallID", screening.data.hall.id);
        tPrice.innerHTML = screening.data.price;
        var options = { weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: '2-digit', second: '2-digit'};
        tStartTime.innerHTML = new Date(screening.data.startTime).toLocaleString("en-DE", options);
        tStartTime.setAttribute("timeInMS", screening.data.startTime);
        row.appendChild(tID);
        row.appendChild(tHall);
        row.appendChild(tPrice);
        row.appendChild(tStartTime);
        table.appendChild(row);
        row.onclick = function() {loadScreeningRow(screening.id);}
        console.log(screening.data.startTime);
    });
    sortTable(3);
}

function loadScreeningRow(id){
    var table = document.getElementById("screeningsTable");
    var rows = table.getElementsByTagName("tr");
    for (let index = 1; index < rows.length; index++) {
        if(rows[index].getElementsByTagName("td")[0].innerHTML === id){
            document.getElementById("EDIT_Screening_Hall").setAttribute("selectedScreeningID", rows[index].getElementsByTagName("td")[0].innerHTML);
            document.getElementById("EDIT_Screening_Hall").value = rows[index].getElementsByTagName("td")[1].getAttribute("hallID");
            document.getElementById("EDIT_Screening_Price").value = rows[index].getElementsByTagName("td")[2].innerHTML;
            var time = Number(rows[index].getElementsByTagName("td")[3].getAttribute("timeInMS"));
            time = time + (new Date().getTimezoneOffset() * -60000);
            var date = new Date(time).toISOString();
            document.getElementById("EDIT_Screening_StartTime").value = date.substring(0, date.length-5);
        }
    }
}

async function updateScreeningInformation(){
    startLoading();
    var sID = document.getElementById("EDIT_Screening_Hall").getAttribute("selectedScreeningID");
    var sHall = document.getElementById("EDIT_Screening_Hall").value;
    var sPrice = document.getElementById("EDIT_Screening_Price").value;
    var timeString = document.getElementById("EDIT_Screening_StartTime").value;
    var sTime = new Date(timeString).getTime();

    const param = {
        id: sID,
        newData: {
            hall: sHall,
            price: sPrice,
            startTime: sTime
        }
    };

    let screening = await functions.httpsCallable('database-updateScreening')(param);
    if(screening.data.error) {
        alert(screening.data.error.message);
    }
    loadScreenings(document.getElementById("screeningsTable").getAttribute("movieID"));
    endLoading();
}

async function updateInformationOfMovie(){
    startLoading();
    let id =  document.getElementById("MovieIDInput").value;
    let title = document.getElementById("EDIT_Movie_Title").value;
    let description = document.getElementById("EDIT_Movie_Description").value;
    let duration = document.getElementById("EDIT_Movie_Duration").value;
    let categories = document.getElementById("EDIT_Movie_Category").value.split("|");
    let rating = Number(document.getElementById("EDIT_Movie_Rating").value);
    let coverURL = document.getElementById("EDIT_Movie_Cover_URL").value;

    const param = {
        id: id,
        newData: {
            name: title,
            description: description,
            duration: duration,
            categories: categories,
            priority: rating,
            cover: coverURL
        }
    };

    let movie = await functions.httpsCallable('database-updateMovie')(param);
    if(movie.data.error) {
        alert(movie.data.error.message);
    }
    console.log(movie);
    endLoading();
}

async function addScreenings(){
    startLoading();
    var movieID = document.getElementById("MovieIDInput").value;
    var sHall = document.getElementById("EDIT_ADD_Screening_Hall").value;
    var sPrice = document.getElementById("EDIT_ADD_Screening_Price").value;
    var timeString = document.getElementById("EDIT_ADD_Screening_StartTime").value;
    var sTime = new Date(timeString).getTime();
    var sRep = document.getElementById("EDIT_ADD_Repetitions").value;
    var sInc = document.getElementById("EDIT_ADD_Increment").value;

    const param = {
        movie: movieID,
        hall: sHall,
        price: sPrice,
        startTime: sTime,
        repetitions: sRep,
        increments: sInc
    };

    let screening = await functions.httpsCallable('database-addScreening')(param);
    if(screening.data.error) {
        alert(screening.data.error.message);
    }
    console.log(screening);
    loadScreenings(document.getElementById("screeningsTable").getAttribute("movieID"));
    endLoading();
}

function setCoverFile(){
    if(document.getElementById("EDIT_Movie_Cover_Upload").files[0] !== null){
        file = document.getElementById("EDIT_Movie_Cover_Upload").files[0];
    }
}

async function uploadCover(){
    startLoading();
    if(file !== null){
        var movieID = document.getElementById("MovieIDInput").value;
        let newCoverUrl = await firebase.storage().ref().child('/live/events/movies/cover/' + movieID).put(file);
        console.log(newCoverUrl);
        document.getElementById("EDIT_Movie_Rating").value = newCoverUrl;
        const param2 = {
            id: movieID,
            newData: {
                cover: newCoverUrl
            }
        };
        let movieWithCover = await functions.httpsCallable('database-updateMovie')(param2);
        if(movieWithCover.data.error) {
            alert(movieWithCover.data.error.message);
        }
        console.log(movieWithCover);
        loadDatabaseMovie();
    }
    endLoading();
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("screeningsTable");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir === "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir === "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount === 0 && dir === "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}


async function addHall(){
    startLoading();
    var hallName = document.getElementById("ADD_Hall_Name").value;
    console.log(rows);
    var hallRows = rows;
    var hallWidth = document.getElementById("ADD_Hall_Width").value;
    const param = {
        name: hallName,
        rows: hallRows,
        width: hallWidth
    };
    console.log(param);
    let hall = await functions.httpsCallable('database-addHall')(param);
    if(hall.data.error) {
        alert(hall.data.error.message);
    }
    console.log(hall);
    endLoading();
}

function addRow(){
    var pType = document.getElementById("ADD_Row_Type").value;
    var pCount = document.getElementById("ADD_Row_Count").value;
    const row = {
        id: pType,
        count: pCount
    }
    rows.push(row);
    displayRows();
}

function displayRows(){
    var table = document.getElementById("rowsTable");

    while(table.rows.length > 1){
        table.deleteRow(-1);
    }
    console.log(rows);
    rows.forEach(row => {
        var tRow = document.createElement("tr");
        var tType = document.createElement("td");
        tType.innerHTML = row.id;
        var tCount = document.createElement("td");
        tCount.innerHTML = row.count;
        tRow.appendChild(tType);
        tRow.appendChild(tCount);
        table.appendChild(tRow);
    });
}


async function seatGeneration() {
    
    var seatContainer = document.getElementById("seatContainer");
    while(seatContainer.firstChild){
        seatContainer.removeChild(seatContainer.lastChild);
    }

    var rowScreen = document.createElement("div");
    var numberOfSeats = document.getElementById("ADD_Hall_Width").value === "" ? 0 : parseInt(document.getElementById("ADD_Hall_Width").value);
    console.log(numberOfSeats);
    var rowCounter = 0;
    rowScreen.classList.add("seat-row");
    var screen = document.createElement("div");
    screen.classList.add("screen");
    rowScreen.appendChild(screen);
    seatContainer.appendChild(rowScreen);
    for(var i = 0; i < rows.length; i++) {
      var rowAmount = rows[i].count;
      var seatType = rows[i].id;
      seatType = seatType.replace("\"", "");
      seatType = seatType.trim();
  
      for(var k = 0; k < rowAmount; k++) {
        var row = document.createElement("div");
        row.classList.add("seat-row");
        for(var j = 0; j < numberOfSeats; j++) {
          var seat = document.createElement("div");
          seat.classList.add("seat");
          seatType = seatType.replace(/\s/g, '');
          seat.classList.add(seatType);
          
          if(seat.classList.contains('withspecialneeds')) {
            var design = document.createElement("img");
            design.setAttribute("id", "seatDesign");
            design.setAttribute("src", "../icons/png/special.png");
            seat.appendChild(design);
          }
          if(seat.classList.contains('lodge')) {
            var lodgDesin = document.createElement("img");
            lodgDesin.setAttribute("id", "seatDesign");
            lodgDesin.setAttribute("src", "../icons/png/krone1.png");
            seat.appendChild(lodgDesin);
          }
          
          row.appendChild(seat);
        } //end of for
        seatContainer.appendChild(row);
        rowCounter++;
      } //end of for
    } //end of for
  } //end of seatGeneration

function removeLastRow(){
    rows.pop();
    displayRows();
}

async function promoteToAdmin() {
    startLoading();
    var uid = document.getElementById("EDIT_PERMISSION_UID").value;

    const param = {
        id: uid
    };

    let user = await functions.httpsCallable('database-promoteUserToAdminByID')(param);
    console.log(user);
    if(user.data.error) {
        alert(user.data.error.message);
    }
    endLoading();
}

async function degradeToUser() {
    startLoading();
    var uid = document.getElementById("EDIT_PERMISSION_UID").value;

    const param = {
        id: uid
    };

    let user = await functions.httpsCallable('database-degradeAdminToUserByID')(param);
    console.log(user);
    if(user.data.error) {
        alert(user.data.error.message);
    }
    endLoading();
}