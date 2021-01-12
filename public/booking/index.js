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

let seatCounter = 0;
let seatsMap = [];
let selectedSeats = [];
let blockedSeats = [];
let seatsWithBookingConflict = [];
let screeningReference = "";
let bookedTickets = [];

const container = document.querySelector('.container');
const seats = document.querySelectorAll('.seat-row .seat:not(.occupied)');
const count = document.getElementById('count');
const price = document.getElementById('price');

let ticketPrice = Number(document.getElementById('movie').getAttribute('value'));

const populateUI = () => {
  const selectedSeatsInfo = document.querySelectorAll('.seat-row .selected');
  if (selectedSeatsInfo !== null && selectedSeatsInfo.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeatsInfo.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  } //end of if
}; //end of lambda expression

populateUI();


const updateSelectedSeatsCount = () => {
  const selectedSeats = document.querySelectorAll('.seat-row .selected');
  var sum = 0;
  var countedSelectedSeats = 0;
  for(var i = 0; i < selectedSeats.length; i++) {
    sum = sum + parseFloat(selectedSeats[i].getAttribute("value"));
    countedSelectedSeats++;
  } //end of for
  count.innerText = countedSelectedSeats;
  price.innerText = sum;
}; //end of lambda expression

// Seat select event
container.addEventListener('click', e => {
  if (
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
  ) {
    e.target.classList.toggle('selected');
    var seat = e.target.getAttribute("id");
    if(e.target.classList.contains('selected')) {
      selectedSeats.push(seatsMap[seat]);
      console.log(selectedSeats);
    } else {
      for(var i = 0; i < selectedSeats.length; i++) {
        if((selectedSeats[i] !== null)) {
          if((parseInt(seat) === parseInt(selectedSeats[i].id))) {
            selectedSeats[i] = null;
          } //end of if
        } //end of if
      } //end of for
      console.log(selectedSeats);
    } //end of if-else
    updateSelectedSeatsCount();
  } //end of if-else
}); //end of eventhandler

async function loadContent() {
  var information = sessionStorage.getItem('informationOfBooking');
  information = JSON.parse(information);
  console.log(information);
  screeningReference = information.screeningId;
  var movieTitle = sessionStorage.getItem('movieTitle');
  var titlePlaceHolder = document.getElementById("movie-title");
  titlePlaceHolder.innerHTML = movieTitle;
  var hallInfo = information.hall.data;
  seatGeneration(hallInfo);
  var param = {id: information.screeningId};
  var blockedSeats = await functions.httpsCallable('database-getBookedSeatsByScreeningID')(param);
  blockAlreadyBookedSeats(blockedSeats);
  endLoading();
} //end of loadContent

// dynamic seats
function seatGeneration(hallInfo) {
  var seatContainer = document.getElementById("seatContainer");
  var rowScreen = document.createElement("div");
  var numberOfSeats = parseInt(hallInfo.width);
  var rowCounter = 0;
  rowScreen.classList.add("seat-row");
  var screen = document.createElement("div");
  screen.classList.add("screen");
  rowScreen.appendChild(screen);
  seatContainer.appendChild(rowScreen);
  for(var i = 0; i < hallInfo.rows.length; i++) {
    var rowAmount = hallInfo.rows[i].count;
    var seatPrice = hallInfo.rows[i].type.data.price;
    var seatType = hallInfo.rows[i].type.data.name;
    seatType = seatType.replace("\"", "");
    seatType = seatType.trim();
    for(var k = 0; k < rowAmount; k++) {
      var row = document.createElement("div");
      row.classList.add("seat-row");
      for(var j = 0; j < numberOfSeats; j++) {
        var seat = document.createElement("div");
        var seatIdentificationObject = {
          id : seatCounter,
          row : rowCounter,
          seat : j
        } //end of seatObject
        seatsMap[seatCounter] = seatIdentificationObject;
        seat.id = seatCounter;
        seatCounter++;
        seat.setAttribute("value", seatPrice);
        seat.classList.add("seat");
        var type = identifySeatType(seatType);
        seat.classList.add(type.value);
        row.appendChild(seat);
      } //end of for
      seatContainer.appendChild(row);
      rowCounter++;
    } //end of for
  } //end of for
} //end of seatGeneration

async function identifySeatType(seat) {
  if(seat.includes("special")) {
    var type = "special";
    return type;
  } else {
    return seat;
  } //end of if-else
} //end of identifySeatType

async function blockAlreadyBookedSeats(seatInfo) {
  var blockedSeatsInfo = seatInfo.data;
  var rowInfo;
  var blocked;
  var blockedSeatId = 0;
  for(var i = 0; i < parseInt(blockedSeatsInfo.length); i++) {
    rowInfo = blockedSeatsInfo[i];
    for(var j = 0; j < parseInt(rowInfo.length); j++) {
      blocked = rowInfo[j];
      blocked = blocked.toString();
      if(blocked.localeCompare("true") === 0) {
        var seat = document.getElementById(blockedSeatId);
        blockedSeats.push(seatsMap[blockedSeatId]);
        seat.classList.add('occupied');
      } //end of if
      blockedSeatId++;
    } //end of for
  } //end of for
} //end of blockAlreadyBookedSeats

/*
 * --------------------------------------------------------------------------
 */

function jumpToZahlung() {
   document.getElementById("ZahlungDetails").open = true;
   document.getElementById("selectionDetails").open = false;
   document.getElementById("ZahlungDetails").hidden = false;
   location.href = '#Zahlung';
}

//Checkbox Rechnungsadresse
function otherAdr() {
  var adresse = document.getElementById("check");
  if(adresse.checked === true) {
    document.getElementById("Rechnungsadresse").innerHTML = "";
  }else {
    var element1 = document.createElement("div");
    element1.classList.add("field");
    var element2 = document.createElement("div");
    element2.classList.add("field");
    var element3 = document.createElement("div");
    element3.classList.add("field");
    var element4 = document.createElement("div");
    element4.classList.add("field");
    var element5 = document.createElement("div");
    element5.classList.add("field");
    var element6 = document.createElement("div");
    element6.classList.add("field");
    var element7 = document.createElement("div");
    element7.classList.add("field");
    
    
    var vorname = document.createElement("input");
    vorname.setAttribute("id", "Vorname2");
    vorname.setAttribute("type", "text");
    vorname.classList.add("input");
    vorname.setAttribute("placeholder", "Vorname");
    vorname.required = true;
    var name = document.createElement("input");
    name.setAttribute("id", "Nachname2");
    name.setAttribute("type", "text");
    name.classList.add("input");
    name.setAttribute("placeholder", "Nachname");
    name.required = true;
    var postleit = document.createElement("input");
    postleit.setAttribute("id", "Postleitzahl2");
    postleit.setAttribute("type", "number");
    postleit.classList.add("input");
    postleit.setAttribute("placeholder", "Postleitzahl");
    postleit.required = true;
    var stadt = document.createElement("input");
    stadt.setAttribute("id", "Stadt2");
    stadt.setAttribute("type", "text");
    stadt.classList.add("input");
    stadt.setAttribute("placeholder", "Stadt");
    stadt.required = true;
    var straße = document.createElement("input");
    straße.setAttribute("id", "Straße2");
    straße.setAttribute("type", "text");
    straße.classList.add("input");
    straße.setAttribute("placeholder", "Straße");
    straße.required = true;
    var nummer = document.createElement("input");
    nummer.setAttribute("id", "Hausnummer2");
    nummer.setAttribute("type", "number");
    nummer.classList.add("input");
    nummer.setAttribute("placeholder", "Hausnummer");
    nummer.required = true;
    var zusatz = document.createElement("input");
    zusatz.setAttribute("id", "Adress-Zusatz2");
    zusatz.setAttribute("type", "text");
    zusatz.classList.add("input");
    zusatz.setAttribute("placeholder", "Adress-Zusatz");
    zusatz.required = true;


    var container = document.getElementById("Rechnungsadresse");
    
    element1.appendChild(vorname);
    element2.appendChild(name);
    element3.appendChild(postleit);
    element4.appendChild(stadt);
    element5.appendChild(straße);
    element6.appendChild(nummer);
    element7.appendChild(zusatz);
    container.appendChild(element1);
    container.appendChild(element2);
    container.appendChild(element3);
    container.appendChild(element4);
    container.appendChild(element5);
    container.appendChild(element6);
    container.appendChild(element7);
  }
}

//Checkbox Zahlungsmethode
function pay(id) {
  var ausgabe = document.getElementById("radioAus");
  switch(id) {
    case 0:
      ausgabe.innerHTML = "";
      break;
    case 1:
      ausgabe.innerHTML = "";
      var field1 = document.createElement("div");
      field1.classList.add("field");
      var field2 = document.createElement("div");
      field2.classList.add("field");
      var field3 = document.createElement("div");
      field3.classList.add("field");
      var field4 = document.createElement("div");
      field4.classList.add("field");
  
      var kartennummer = document.createElement("input");
      kartennummer.setAttribute("id", "Kartennummer");
      kartennummer.setAttribute("type", "number");
      kartennummer.classList.add("input");
      kartennummer.setAttribute("placeholder", "Kartennummer");
      kartennummer.required = true;
      var datum = document.createElement("input");
      datum.setAttribute("id", "Ablaufdatum");
      datum.setAttribute("type", "month");
      datum.classList.add("input");
      datum.setAttribute("placeholder", "Ablaufdatum");
      datum.required = true;
      var inhaber = document.createElement("input");
      inhaber.setAttribute("id", "Karteninhaber");
      inhaber.classList.add("input");
      inhaber.setAttribute("placeholder", "Karteninhaber");
      inhaber.required = true;
      var num = document.createElement("input");
      num.setAttribute("id", "number");
      num.classList.add("input");
      num.setAttribute("placeholder", "CVV");
      num.setAttribute("max", "999");
      num.required = true;
  
      field1.appendChild(kartennummer);
      field2.appendChild(datum);
      field3.appendChild(inhaber);
      field4.appendChild(num);
      ausgabe.appendChild(field1);
      ausgabe.appendChild(field2);
      ausgabe.appendChild(field3);
      ausgabe.appendChild(field4);
      break;
    case 2:
      ausgabe.innerHTML = "";
      var button1 = document.createElement("button");
      button1.classList.add("button");
      button1.setAttribute("id","GooglePay");
      button1.innerHTML = "Google Pay";
      ausgabe.appendChild(button1);
      break;
    case 3:
      ausgabe.innerHTML = "";
      var button2 = document.createElement("button");
      button2.classList.add("button");
      button2.setAttribute("id","ApplePay");
      button2.innerHTML = "Apple Pay";
      ausgabe.appendChild(button2);
      break;
    case 4:
      ausgabe.innerHTML = "";
      var button3 = document.createElement("button");
      button3.classList.add("button");
      button3.setAttribute("id","PayPal");
      button3.innerHTML = "PayPal";
      ausgabe.appendChild(button3);
      break;
  }
}
 
//weiter Button click event zur Zusammenfassung
function ausgabe() {
  document.getElementById("ausVorname").innerHTML = document.getElementById("Vorname").value;
  document.getElementById("ausNachname").innerHTML = document.getElementById("Nachname").value;
  document.getElementById("ausEmail").innerHTML = document.getElementById("Email").value;
  document.getElementById("ausRufnummer").innerHTML = document.getElementById("Rufnummer").value;
  document.getElementById("ausPLZ").innerHTML = document.getElementById("Postleitzahl").value + " " + document.getElementById("Stadt").value;
  document.getElementById("ausStraße").innerHTML = document.getElementById("Straße").value + " " + document.getElementById("Hausnummer").value;

  var payment = document.getElementById("Zahlungsmethode");
  var ausPayment = document.getElementById("ausKartennummer");
  if(payment.checked === true) {
    ausPayment.innerHTML = "<td colspan=\"2\"><center>Vor Ort Bezahlung</center></td>"
  } else {
    document.getElementById("ausKartennummer").innerHTML = "<td>Kartennummer:</td><td>" + document.getElementById("Kartennummer").value + "</td>";
  }
  

  document.getElementById("zusammenfassungDetails").open = true;
  document.getElementById("ZahlungDetails").open = false;
  document.getElementById("zusammenfassungDetails").hidden = false;
  location.href = '#Zusammenfassung';
  test();
}


/*__________________________________Ticket-Preview_____________________________________________________*/

function test() {
  createTicket("Geiler Film", "7", "4", "8", "22.10.2021", "www.google.de")
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
    //createQrCode(ticket, value);
    movieLogo(ticket);
}

function movieLogo(element) {
  var movieContainer = element.appendChild(document.createElement("div"));
  movieContainer.classList.add("pic");
  var picContainer = movieContainer.appendChild(document.createElement("div"));
  picContainer.classList.add("image");
  picContainer.innerHTML = "<img src=\"../icons/jpg/JamesBond.jpg\"></img>";
}

/*
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
*/

/*______________________________________________________________________________________________*/

async function compareToSelectedSeats(blockedSeatId) {
  var selectedSeatInfo;
  var seatWasBlocked = false;
  for(var i = 0; i < selectedSeats.length; i++) {
    if(selectedSeats[i] !== null) {
      selectedSeatInfo = selectedSeats[i];
      if(selectedSeatInfo !== null) {
        if(parseInt(selectedSeatInfo.id) === parseInt(blockedSeatId)) {
          console.log("Blocked seat is " + blockedSeatId);
          seatWasBlocked = true;
        } //end of if
      } //end of if
    } //end of if
  } //end of for
  return seatWasBlocked;
} //end of compareToSelectedSeats

async function checkSeatsAreNotAlreadyBooked(hallInfo) {
  var blockedSeatsInfo = hallInfo.data;
  var rowInfo;
  var blocked;
  var corrupedSeatExists = false;
  var blockedSeatId = 0;
  for(var i = 0; i < parseInt(blockedSeatsInfo.length); i++) {
    rowInfo = blockedSeatsInfo[i];
    for(var j = 0; j < parseInt(rowInfo.length); j++) {
      blocked = rowInfo[j];
      blocked = blocked.toString();
      if(blocked.localeCompare("true") === 0) {
        var seatWasBlocked = compareToSelectedSeats(blockedSeatId);
        seatWasBlocked = seatWasBlocked.value;
        if(seatWasBlocked) {
          seatsWithBookingConflict.push(blockedSeatId);
          corrupedSeatExists = true;
        } //end of if
      } //end of if
      blockedSeatId++;
    } //end of for
  } //end of for
  return corrupedSeatExists;
} //end of checkSeatAreNotAlreadyBooked

async function bookSeat(params) {
  console.log("Created new ticket");
  var ticket = await functions.httpsCallable('database-createTicket')(params);
  bookedTickets.push(ticket);
} //end of bookSeat

async function book() {
  var bookingConflict = false;
  if(seatCounter > 0) {
    var paramBlockedSeats = {id: screeningReference};
    var blockedSeats = await functions.httpsCallable('database-getBookedSeatsByScreeningID')(paramBlockedSeats);
    var corruptedSeats = checkSeatsAreNotAlreadyBooked(blockedSeats);
    var bookingError = Boolean(corruptedSeats.value);
    if(bookingError) {
      bookingConflict = true;
    } else {
      for(var i = 0; i < selectedSeats.length; i++) {
        var seatInfo = selectedSeats[i];
        if(seatInfo !== null) {
          var ticketParam = {
            screening : screeningReference,
            row : (parseInt(seatInfo.row) + 1),
            seat : (parseInt(seatInfo.seat) + 1)
          } //end of ticketParam
          bookSeat(ticketParam);
        } //end of if
      } //end of for
    } //end of if-else
    console.log(bookedTickets);
    window.location.href = "../confirmation/";
  } //end of if
} //end of book