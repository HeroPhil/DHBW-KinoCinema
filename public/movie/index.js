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

let screenings = 0;
const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let screeningsMonday = [];
let screeningsTuesday = [];
let screeningsWednesday = [];
let screeningsThursday = [];
let screeningsFriday = [];
let screeningsSaturday = [];
let screeningsSunday = [];

document.addEventListener('click', e => {
    if (e.target.matches("input[name='time-slot']")) {
        changeStateOfBookingButton();
        return ;
    }
}); //end of eventhandler

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
    sessionStorage.setItem('movieTitle', movieData.data.name);
    description.innerHTML = movieData.data.description;
    var url = await storage.refFromURL(movieData.data.cover).getDownloadURL();
    sessionStorage.setItem('movieCover', url);
    cover.src = url;
    var subLevel = 4;
    var sinceDate = Math.floor(Date.now());
    var untilDate = Math.floor(Date.now() + (1000 * 60 *60 *24 *7));
    var paramScreenings = {
        id : movieData.id,
        sublevel : subLevel,
        since : sinceDate,
        until : untilDate
    };
    var singleScreeningData
    var screeningList = document.getElementById("movie-screening-list");
    var screeningTable = document.createElement("table");
    screeningTable.setAttribute("border", "1");
    var screeningsForMovie = await functions.httpsCallable("database-getScreeningsOfMovieByID")(paramScreenings);
    console.log(screeningsForMovie);
    screeningData = screeningsForMovie.data;
    screeningData.forEach(screening => {
        singleScreeningData = screening.data;
        date = new Date(singleScreeningData.startTime);
        addScreeningDataToArray(date.getDay(), screening);
    });
    sortInfoArrays();
    var actualDay = new Date().getDay();
    screeningTable.createCaption().innerHTML = "Performances for the next 7 days:";
    var rowheadings;
    var rowScreenings;
    var cell;
    rowheadings = document.createElement("tr");
    for(var k = 0; k < days.length; k++) {
        if(actualDay === 7) {
            actualDay = 0;
        } //end of if
        cell = document.createElement("th");
        cell.textContent = days[actualDay];
        rowheadings.appendChild(cell);
        actualDay++;
    } //end of for
    rowScreenings = document.createElement("tr");
    actualDay = new Date().getDay();
    for(k = 0; k < days.length; k++) {
        if(actualDay === 7) {
            actualDay = 0;
        } //end of if
        addScreeningsToList(actualDay, rowScreenings)
        actualDay++;
    } //end of for
    screeningTable.appendChild(rowheadings);
    screeningTable.appendChild(rowScreenings);
    screeningList.appendChild(screeningTable);
    endLoading();
}

async function addScreeningDataToArray(day, data) {
    switch(day) {
        case 0:
            screeningsSunday.push({
                time : data.data.startTime,
                price : data.data.price,
                hallId : data.data.hall.id,
                hall : data.data.hall,
                screeningId : data.id
            })
            break;
        case 1:
            screeningsMonday.push({
                time : data.data.startTime,
                price : data.data.price,
                hallId : data.data.hall.id,
                hall : data.data.hall,
                screeningId : data.id
            })
            break;
        case 2:
            screeningsTuesday.push({
                time : data.data.startTime,
                price : data.data.price,
                hallId : data.data.hall.id,
                hall : data.data.hall,
                screeningId : data.id
            })
            break;
        case 3:
            screeningsWednesday.push({
                time : data.data.startTime,
                price : data.data.price,
                hallId : data.data.hall.id,
                hall : data.data.hall,
                screeningId : data.id
            })
            break;
        case 4:
            screeningsThursday.push({
                time : data.data.startTime,
                price : data.data.price,
                hallId : data.data.hall.id,
                hall : data.data.hall,
                screeningId : data.id
            })
            break;
        case 5:
            screeningsFriday.push({
                time : data.data.startTime,
                price : data.data.price,
                hallId : data.data.hall.id,
                hall : data.data.hall,
                screeningId : data.id
            })
            break;
        case 6:
            screeningsSaturday.push({
                time : data.data.startTime,
                price : data.data.price,
                hallId : data.data.hall.id,
                hall : data.data.hall,
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

function sortInfoArrays() {
    sortInfoArray(screeningsSunday);
    sortInfoArray(screeningsMonday);
    sortInfoArray(screeningsTuesday);
    sortInfoArray(screeningsWednesday);
    sortInfoArray(screeningsThursday);
    sortInfoArray(screeningsFriday);
    sortInfoArray(screeningsSaturday);
} //end of sortInfoArrays

function sortInfoArray(array) {
    var counter = 0;
    var sortingFinished = false;
    var save = null;
    if(array.length > 1) {
        while(!sortingFinished) {
            for(var i = 0; (i < array.length - 1); i++) {
                if(parseInt(array[i].time) > parseInt(array[i + 1].time)) {
                    save = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = save;
                    counter++;
                } //end of if
            } //end of for
            if(counter === 0) {
                sortingFinished = true;
            } //end of if
            counter = 0; 
        } //end of if
    } //end of while
} //end of sortInfoArray

function checkForCorrectMinuteWriting(timeStamp) {
    if(timeStamp < 10) {
        return "0" + timeStamp;
    } else {
        return timeStamp;
    } //end of if-else
} //end of checkForCorrectMinuteWriting

function changeStateOfBookingButton() {
    var button = document.getElementById("book-button");
    var selectedButtons = document.querySelector('input[name="time-slot"]:checked');
    if(selectedButtons !== null) {
        button.style.display = "flex";
        button.disabled = false;
    } else {
        button.style.display = "flex";
        button.disabled = true;
    } //end of if-else
} //end of changeStateOfBookingButton

async function addScreeningToList(dataArray, row) {
    var cell = document.createElement("td");
    var placeholder = document.createElement("div");
    if(dataArray.length !== 0) {
        for(var i = 0; i < dataArray.length; i++) {
                var information = dataArray[i];
                var inputScreening = document.createElement("input");
                inputScreening.setAttribute("type", "radio");
                inputScreening.setAttribute("id", information.screeningId);
                inputScreening.setAttribute("value", screenings);
                sessionStorage.setItem(screenings, JSON.stringify(information));
                screenings++;
                inputScreening.setAttribute("name", "time-slot");
                var labelScreening = document.createElement("label");
                labelScreening.setAttribute("for", information.screeningId);
                var dateOfScreening = new Date(information.time);
                var minutes = String(checkForCorrectMinuteWriting(dateOfScreening.getMinutes()));
                var time = dateOfScreening.getHours() + ":" + minutes;
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

async function analyzeRadioInput() {
    var screening = document.querySelector('input[name="time-slot"]:checked');
    if(screening !== null) {
        var information = sessionStorage.getItem(screening.value);
        sessionStorage.setItem('informationOfBooking', information);
        var reference = "../booking/";
        window.location = reference;
    }//end of if
} //end of analyzeRadioInput
