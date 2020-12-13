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
let screeningsMonday = [];
let screeningsTuesday = [];
let screeningsWednesday = [];
let screeningsThursday = [];
let screeningsFriday = [];
let screeningsSaturday = [];
let screeningsSunday = [];
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
    var screeningTable = document.createElement("table");
    screeningTable.setAttribute("border", "1");
    var screeningsForMovie = await functions.httpsCallable("database-getAllScreenings")(paramScreenings);
    screeningData = screeningsForMovie.data;
    screeningData.forEach(screening => {
        singleScreeningData = screening.data;
        date = new Date(singleScreeningData.startTime);
        addScreeningDataToArray(date.getDay(), screening);
    });
    var actualDay = new Date().getDay();
    screeningTable.createCaption().innerHTML = "Vorstellungen";
    var rowheadings;
    var rowScreenings;
    var cell;
    rowheadings = document.createElement("tr");
    console.log(screeningsSunday);
    console.log(screeningsMonday);
    console.log(screeningsTuesday);
    console.log(screeningsWednesday);
    console.log(screeningsThursday);
    console.log(screeningsFriday);
    console.log(screeningsSaturday);
    for(var k = 0; k < days.length; k++) {
        if(actualDay == 7) {
            actualDay = 0;
        } //end of if
        cell = document.createElement("td");
        cell.textContent = days[actualDay];
        rowheadings.appendChild(cell);
        actualDay++;
    } //end of for
    rowScreenings = document.createElement("tr");
    actualDay = new Date().getDay();
    for(var k = 0; k < days.length; k++) {
        if(actualDay == 7) {
            actualDay = 0;
        } //end of if
        addScreeningsToList(actualDay, rowScreenings)
        actualDay++;
    } //end of for
    screeningTable.appendChild(rowheadings);
    screeningTable.appendChild(rowScreenings);
    screeningList.appendChild(screeningTable);
}

async function addScreeningDataToArray(day, data) {
    switch(day) {
        case 0:
            screeningsSunday.push({
                time : data.data.startTime,
                hallId : data.data.hall.id,
                screeningId : data.id
            })
            break;
        case 1:
            screeningsMonday.push({
                time : data.data.startTime,
                hallId : data.data.hall.id,
                screeningId : data.id
            })
            break;
        case 2:
            screeningsTuesday.push({
                time : data.data.startTime,
                hallId : data.data.hall.id,
                screeningId : data.id
            })
            break;
        case 3:
            screeningsWednesday.push({
                time : data.data.startTime,
                hallId : data.data.hall.id,
                screeningId : data.id
            })
            break;
        case 4:
            screeningsThursday.push({
                time : data.data.startTime,
                hallId : data.data.hall.id,
                screeningId : data.id
            })
            break;
        case 5:
            screeningsFriday.push({
                time : data.data.startTime,
                hallId : data.data.hall.id,
                screeningId : data.id
            })
            break;
        case 6:
            screeningsSaturday.push({
                time : data.data.startTime,
                hallId : data.data.hall.id,
                screeningId : data.id
            })
            break;
        default:
            //Nothing todo
    }
}

async function addScreeningsToList(day, row) {
    switch(day) {
        case 0:
           addScreeningToList(screeningsSunday, row);
           break;
        case 1:
            addScreeningToList(screeningsMonday, row);
            break;
        case 2:
            addScreeningToList(screeningsTuesday, row);
            break;
        case 3:
            addScreeningToList(screeningsWednesday, row);
            break;
        case 4:
            addScreeningToList(screeningsThursday, row);
            break;
        case 5:
            addScreeningToList(screeningsFriday, row);
            break;
        case 6:
            addScreeningToList(screeningsSaturday, row);
            break;
        default:
            //Nothing todo
    } //end of switch-case
}

async function addScreeningToList(dataArray, row) {
    var cell = document.createElement("td");
    var placeholder = document.createElement("div");
    console.log(dataArray.length);
    if(dataArray.length != 0) {
        for(var i = 0; i < dataArray.length; i++) {
                var information = dataArray[i];
                var inputScreening = document.createElement("input");
                inputScreening.setAttribute("type", "radio");
                inputScreening.setAttribute("id", information.screeningId);
                inputScreening.setAttribute("name", "time-slot");
                var labelScreening = document.createElement("label");
                labelScreening.setAttribute("for", information.screeningId)
                var dateOfScreening = new Date(information.time);
                var time = dateOfScreening.getHours() + ":" + dateOfScreening.getMinutes() + " Uhr";
                labelScreening.innerHTML = time;
                placeholder.appendChild(inputScreening);
                placeholder.appendChild(labelScreening);
                cell.appendChild(placeholder);
                row.appendChild(cell);
        } //end of for
    } else {
        var emptyText = document.createTextNode(" ");
        placeholder.appendChild(emptyText);
        cell.appendChild(placeholder);
        row.appendChild(cell);
    }
} //end of addScreeningToList