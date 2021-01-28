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

//loadQRCodes();
let numberOfTickets;
let ticketsInfo = [];

function loadContent() {
  numberOfTickets = parseInt(sessionStorage.getItem("NumberOfTickets"));
  ticketsInfo = JSON.parse(sessionStorage.getItem("Tickets"));
  console.log(ticketsInfo);
} //end of loadContent

function home() {
  window.location.href = "../index/";
}

function loadQRCodes() {
  if(numberOfTickets > 0) {
    for(var i = 0; i < numberOfTickets; i++) {
      var actualTicket = ticketsInfo[i].data.data;
      if(actualTicket !== null) {
        var ticketid = actualTicket.id;
        createQrCode(ticketid);
      } //end of if
    } //end of for
  } //end of if
} //end of loadQRCodes



function loadTicketsWithQRCode() {
  for(var i = 0; i < ticketsInfo.length; i++) {
    var actualTicket = ticketsInfo[i].data;
    if(actualTicket !== null) {
      var movieTitle = actualTicket.data.screening.data.movie.data.name;
      var ticketId = actualTicket.id;
      var hallId = actualTicket.data.screening.data.hall.data.name;
      var dateOfScreening = new Date(parseInt(actualTicket.data.screening.data.startTime));
      var date = (dateOfScreening.getDay() + 1) + "." + (dateOfScreening.getMonth() + 1) + "." + dateOfScreening.getFullYear();
      createTicket(movieTitle, hallId, actualTicket.data.row, actualTicket.data.seat, date, ticketId);
    } //end of if
  } //end of for
  
  /*
  for(var i = 0; i < 5; i++) {
    //var actualTicket = ticketsInfo[i];
    var movieTitle = "Title"+i;
    var ticketId = "www.google.de/"+i+".html";
    var hallId = "Hall"+i;
    var dateOfScreening = new Date(Date.now());
    var date = (dateOfScreening.getDay() + 1) + "." + (dateOfScreening.getMonth() + 1) + "." + dateOfScreening.getFullYear();
    createTicket(movieTitle, hallId, i, i, date, ticketId);
  }*/
} //end of loadTicketsWithQRCode

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