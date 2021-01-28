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


async function loadUserDetails() {

    await new Promise(resolve => setTimeout(resolve, 2500));
    
    if(firebase.auth().currentUser !== null){
        const param = {};
        const result = await functions.httpsCallable('database-getInformationOfCurrentUser')(param);
        const userData = result.data.data;
        document.getElementById("Vorname").value = userData.firstName === undefined ? "" : userData.firstName;
        document.getElementById("Nachname").value = userData.lastName === undefined ? "" : userData.lastName;
        document.getElementById("Email").value = userData.email === undefined ? "" : userData.email;
        document.getElementById("Rufnummer").value = userData.phone === undefined ? "" : userData.phone;
        document.getElementById("Postleitzahl").value = userData.zipCode === undefined ? "" : userData.zipCode;
        document.getElementById("Stadt").value = userData.city === undefined ? "" : userData.city;
        document.getElementById("Straße").value = userData.primaryAddress === undefined ? "" : userData.primaryAddress;
        document.getElementById("Zusatz").value = userData.secondaryAddress === undefined ? "" : userData.secondaryAddress;

        document.getElementById("fullName").innerHTML = userData.firstName === undefined ? "" : userData.firstName + " ";
        document.getElementById("fullName").innerHTML += userData.lastName === undefined ? "" : userData.lastName;
        document.getElementById("fullEmail").innerHTML = userData.email === undefined ? "" : userData.email;
        document.getElementById("fullStraße").innerHTML = userData.primaryAddress === undefined ? "" : userData.primaryAddress;
        document.getElementById("fullStadt").innerHTML = userData.city === undefined ? "" : userData.city;
    }else {
        window.location = "../account"
        return ;
    }
    endLoading();
}

function logout() {
    firebase.auth().signOut();
    window.location = "../account";
}

async function updateDetails() {

    const pVorname = document.getElementById("Vorname").value;
    const pNachname = document.getElementById("Nachname").value;
    const pRufnummer = document.getElementById("Rufnummer").value;
    const pPostleitzahl = document.getElementById("Postleitzahl").value;
    const pStadt = document.getElementById("Stadt").value;
    const pStraße = document.getElementById("Straße").value;
    const pZusatz = document.getElementById("Zusatz").value;

    const param = {
        newData: {
            firstName: pVorname,
            lastName: pNachname,
            phone: pRufnummer,
            zipCode: pPostleitzahl,
            city: pStadt,
            primaryAddress: pStraße,
            secondaryAddress: pZusatz
        }
    }

    const result = await functions.httpsCallable('database-updateInformationOfCurrentUser')(param);
    const userData = result.data.data;

    var x = [];

    userData.firstName === pVorname ? x[0] = true : alert('Vorname konnte nicht übernommen werden');
    userData.lastName === pNachname ? x[1] = true : alert('Nachname konnte nicht übernommen werden');
    userData.phone === pRufnummer ? x[3] = true : alert('Rufnummer konnte nicht übernommen werden');
    userData.zipCode === pPostleitzahl ? x[4] = true : alert('Postleitzahl konnte nicht übernommen werden');
    userData.city === pStadt ? x[5] = true : alert('Stadt konnte nicht übernommen werden');
    userData.primaryAddress === pStraße ? x[6] = true : alert('Straßekonnte nicht übernommen werden');
    userData.secondaryAddress === pZusatz ? x[7] = true : alert('Zusatz konnte nicht übernommen werden');

    if(x.every((e) => e === true)) {
        alert('Ihr Update war erfolgreich');
    }
}

function loadLastTickets(count) {
    document.getElementById("tickets").innerHTML = "";
    //getTickets
    var tickets = ["", "", "", "", "", "", "", "", "", "", "", ""];
    var displayCount = count;
    if(count === -1 || count > tickets.length){
        displayCount = tickets.length;
    }
    for (let index = 0; index < displayCount; index++) {
        const element = tickets[index];
        createTicket("Geiler Film", "7", "4", (index+1), "22.10.2021", "www.google.de")
    }
}

function createTicket(title, hall, row, seat, date, value) {
    var tickets = document.getElementById("tickets");
    var ticket = document.createElement("div");
    ticket.classList.add("ticket");
    var ticketInformation = document.createElement("div");
    ticketInformation.classList.add("ticketInformation");
        var movieTitle = document.createElement("div");
        movieTitle.classList.add("ticketMovieTitle");
        movieTitle.innerHTML = title;
    ticketInformation.appendChild(movieTitle);
        var detailsTable = document.createElement("table");
        var rowHall = document.createElement("tr");
        var tHall = document.createElement("td");
        tHall.innerHTML = "Saal";
        var tHallValue = document.createElement("td");
        tHallValue.innerHTML = hall;
        rowHall.appendChild(tHall);
        rowHall.appendChild(tHallValue);
        detailsTable.appendChild(rowHall);
        var rowRow = document.createElement("tr");
        var tRow = document.createElement("td");
        tRow.innerHTML = "Reihe";
        var tRowValue = document.createElement("td");
        tRowValue.innerHTML = row;
        rowRow.appendChild(tRow);
        rowRow.appendChild(tRowValue);
        detailsTable.appendChild(rowRow);
        var rowSeat = document.createElement("tr");
        var tSeat = document.createElement("td");
        tSeat.innerHTML = "Sitz";
        var tSeatValue = document.createElement("td");
        tSeatValue.innerHTML = seat;
        rowSeat.appendChild(tSeat);
        rowSeat.appendChild(tSeatValue);
        detailsTable.appendChild(rowSeat);
        var rowDate = document.createElement("tr");
        var tDate = document.createElement("td");
        tDate.innerHTML = "Datum";
        var tDateValue = document.createElement("td");
        tDateValue.innerHTML = date;
        rowDate.appendChild(tDate);
        rowDate.appendChild(tDateValue);
        detailsTable.appendChild(rowDate);
    ticketInformation.appendChild(detailsTable);
    ticket.appendChild(ticketInformation);
    tickets.appendChild(ticket);
    createQrCode(ticket, value);
}

function createQrCode(element, textValue) {
    var qrContainer = element.appendChild(document.createElement("div"));
    qrContainer.classList.add("qr");
    var qrcode = new QRCode(qrContainer, {
        text: "https://www.google.de",
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    qrcode.makeCode(textValue);
}