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
let storage;
document.addEventListener("DOMContentLoaded", event => {
    app = firebase.app();
    storage = firebase.storage();
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

let seatCounter = 0;
let seatsMap = [];
let selectedSeatCount = 0;
let selectedSeats = [];
let blockedSeats = [];
let seatsWithBookingConflict = [];
let screeningReference = "";
let screeningTime;
let cinemaName;
let movieName;
let movieCoverReference;
let normalTicketPrice = 0;
let bookedTickets = [];
let corruptedSeats = [];
let loggedIn = false;
let infoCurrentUser;
let userDataMissing = true;

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
  var button = document.getElementById("NextButtonSeatSelection");
  const selectedSeats = document.querySelectorAll('.seat-row .selected');
  var sum = 0;
  for(var i = 0; i < selectedSeats.length; i++) {
    sum += parseFloat(selectedSeats[i].getAttribute("value")) * 100;
    sum = Math.floor(sum);
  } //end of for
  sum = sum / 100;
  count.innerText = selectedSeats.length;
  price.innerText = formatAsCurrency(sum);
  if(selectedSeats.length !== 0) {
    button.style.display = "flex";
  } else {
    button.style.display = "none";
  }//end of if
}; //end of lambda expression

function formatAsCurrency(number) {
  return number.toFixed(2);
}

// Seat select event
container.addEventListener('click', e => {
  if (
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
  ) {
    if(e.target.classList.contains('lodge')) {
      e.target.innerHTML = "";
      var selectDes = document.createElement("img");
      selectDes.setAttribute("id", "seatDesign");
      selectDes.setAttribute("src", "../icons/png/krone2.png");
      e.target.appendChild(selectDes);
    }
    e.target.classList.toggle('selected');
    var seat = e.target.getAttribute("id");
    if(e.target.classList.contains('selected')) {
      selectedSeats.push(seatsMap[seat]);
      selectedSeatCount++;
    } else {
      if(e.target.classList.contains('lodge')) {
        e.target.innerHTML = "";
        var unSelectDes = document.createElement("img");
        unSelectDes.setAttribute("id", "seatDesign");
        unSelectDes.setAttribute("src", "../icons/png/krone1.png");
        e.target.appendChild(unSelectDes);
      }
      for(var i = 0; i < selectedSeats.length; i++) {
        if((selectedSeats[i] !== null)) {
          if((parseInt(seat) === parseInt(selectedSeats[i].id))) {
            selectedSeats[i] = null;
          } //end of if
        } //end of if
      } //end of for
      selectedSeatCount--;
    } //end of if-else
    updateSelectedSeatsCount();
  } //end of if-else
}); //end of eventhandler

async function loadContent() {
  try {
    var information = sessionStorage.getItem('informationOfBooking');
    var button = document.getElementById("NextButtonSeatSelection");
    button.hidden = true;
    information = JSON.parse(information);
    console.log(information);
    screeningReference = information.screeningId;
    screeningTime = information.time;
    var screeningDate = new Date(screeningTime);
    screeningDate = screeningDate.getDate() + "." + (screeningDate.getMonth() + 1) + "." + screeningDate.getFullYear() + " - " + screeningDate.getHours() + ":" + checkForCorrectMinuteWriting(screeningDate.getMinutes()) + " Uhr";
    var movieTitle = sessionStorage.getItem('movieTitle');
    movieName = sessionStorage.getItem('movieTitle');
  } catch(err) {
    console.log(err);
    window.location.href = "../index/";
  } //end of try-catch
  var titlePlaceHolder = document.getElementById("movie");
  titlePlaceHolder.innerHTML = movieTitle + "<br>" + screeningDate;
  var hallInfo = information.hall.data;
  normalTicketPrice = parseFloat(information.price);
  cinemaName = hallInfo.name;
  movieCoverReference = sessionStorage.getItem('movieCover');
  seatGeneration(hallInfo);
  var param = {id: information.screeningId};
  var blockedSeats = await functions.httpsCallable('database-getBookedSeatsByScreeningID')(param);
  blockAlreadyBookedSeats(blockedSeats);
  endLoading();
  loadCurrentUserData();
} //end of loadContent

function checkForCorrectMinuteWriting(timeStamp) {
  if(timeStamp < 10) {
      return "0" + timeStamp;
  } else {
      return timeStamp;
  } //end of if-else
} //end of checkForCorrectMinuteWriting

// dynamic seats
async function seatGeneration(hallInfo) {
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
    console.log(hallInfo.rows[i]);
    var rowAmount = hallInfo.rows[i].count;
    var seatPrice = hallInfo.rows[i].type.data.price;
    seatPrice = normalTicketPrice * parseFloat(seatPrice);
    var seatType = hallInfo.rows[i].type.data.name;
    seatType = seatType.replace("\"", "");
    seatType = seatType.trim();

    for(var k = 0; k < rowAmount; k++) {
      var row = document.createElement("div");
      row.classList.add("seat-row");
      for(var j = 0; j < numberOfSeats; j++) {
        console.log(seatType);
        try {
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
          seatType = seatType.replace(/\s/g, '');
          seat.classList.add(seatType);
          
          if(seat.classList.contains('withspecialneeds')) {
            document.getElementById("specialPrice").innerHTML = formatAsCurrency(seatPrice) + "€";
            var design = document.createElement("img");
            design.setAttribute("id", "seatDesign");
            design.setAttribute("src", "../icons/png/special.png");
            seat.appendChild(design);
          }
          if(seat.classList.contains('lodge')) {
            document.getElementById("lodgePrice").innerHTML = formatAsCurrency(seatPrice) + "€";
            var lodgDesin = document.createElement("img");
            lodgDesin.setAttribute("id", "seatDesign");
            lodgDesin.setAttribute("src", "../icons/png/krone1.png");
            seat.appendChild(lodgDesin);
          }
          if(seat.classList.contains('normal')) {
            document.getElementById("normalPrice").innerHTML = formatAsCurrency(seatPrice) + "€";
          }
        } catch(err) {
          console.log(err);
        } //end of try-catch
        row.appendChild(seat);
      } //end of for
      seatContainer.appendChild(row);
      rowCounter++;
    } //end of for
  } //end of for
} //end of seatGeneration

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
        if(seat.classList.contains('lodge')) {
          seat.innerHTML = "";
          var occupiedDes = document.createElement("img");
          occupiedDes.setAttribute("id", "seatDesign");
          occupiedDes.setAttribute("src", "../icons/png/krone3.png");
          seat.appendChild(occupiedDes);
        }
      } //end of if
      blockedSeatId++;
    } //end of for
  } //end of for
} //end of blockAlreadyBookedSeats

/*
 * --------------------------------------------------------------------------
 */

function jumpToZahlung() {
  if(selectedSeatCount !== 0) {  
  document.getElementById("ZahlungDetails").open = true;
  document.getElementById("selectionDetails").open = false;
  document.getElementById("ZahlungDetails").hidden = false;
  location.href = '#Zahlung';
  } else {
    printError(3, "Please select a seat!")
  } //end of if
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
    vorname.setAttribute("placeholder", "First name");
    vorname.required = true;
    var name = document.createElement("input");
    name.setAttribute("id", "Nachname2");
    name.setAttribute("type", "text");
    name.classList.add("input");
    name.setAttribute("placeholder", "Last Name");
    name.required = true;
    var postleit = document.createElement("input");
    postleit.setAttribute("id", "Postleitzahl2");
    postleit.setAttribute("type", "number");
    postleit.classList.add("input");
    postleit.setAttribute("placeholder", "Post code");
    postleit.required = true;
    var stadt = document.createElement("input");
    stadt.setAttribute("id", "Stadt2");
    stadt.setAttribute("type", "text");
    stadt.classList.add("input");
    stadt.setAttribute("placeholder", "City");
    stadt.required = true;
    var straße = document.createElement("input");
    straße.setAttribute("id", "Straße2");
    straße.setAttribute("type", "text");
    straße.classList.add("input");
    straße.setAttribute("placeholder", "Street + House Number");
    straße.required = true;
    var zusatz = document.createElement("input");
    zusatz.setAttribute("id", "Adress-Zusatz2");
    zusatz.setAttribute("type", "text");
    zusatz.classList.add("input");
    zusatz.setAttribute("placeholder", "Addition");
    zusatz.required = true;


    var container = document.getElementById("Rechnungsadresse");
    
    element1.appendChild(vorname);
    element2.appendChild(name);
    element3.appendChild(postleit);
    element4.appendChild(stadt);
    element5.appendChild(straße);
    element7.appendChild(zusatz);
    container.appendChild(element1);
    container.appendChild(element2);
    container.appendChild(element3);
    container.appendChild(element4);
    container.appendChild(element5);
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
      kartennummer.setAttribute("placeholder", "Card Number");
      kartennummer.required = true;
      var datum = document.createElement("input");
      datum.setAttribute("id", "Ablaufdatum");
      datum.setAttribute("type", "month");
      datum.classList.add("input");
      datum.setAttribute("placeholder", "Expiry Date");
      datum.required = true;
      var inhaber = document.createElement("input");
      inhaber.setAttribute("id", "Karteninhaber");
      inhaber.classList.add("input");
      inhaber.setAttribute("placeholder", "Cardholder");
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
    /*case 2:
      ausgabe.innerHTML = "";
      var button3 = document.createElement("button");
      button3.classList.add("button");
      button3.setAttribute("id","PayPal");
      button3.innerHTML = "PayPal";
      ausgabe.appendChild(button3);
      break;*/
  }
}
 
//weiter Button click event zur Zusammenfassung
async function ausgabe() {
  document.getElementById("hiddenInfo").hidden = true;
  document.getElementById("loadWhile").hidden = false;

  document.getElementById("ausVorname").innerHTML = document.getElementById("Vorname").value;
  document.getElementById("ausNachname").innerHTML = document.getElementById("Nachname").value;
  document.getElementById("ausEmail").innerHTML = document.getElementById("Email").value;
  document.getElementById("ausRufnummer").innerHTML = document.getElementById("Rufnummer").value;
  document.getElementById("ausPLZ").innerHTML = document.getElementById("Postleitzahl").value + " " + document.getElementById("Stadt").value;
  document.getElementById("ausStraße").innerHTML = document.getElementById("Straße").value;

  var payment = document.getElementById("Zahlungsmethode");
  var ausPayment = document.getElementById("ausKartennummer");
  if(payment.checked === true) {
    ausPayment.innerHTML = "<td colspan=\"2\"><center>Pay on Site</center></td>"
  } else {
    document.getElementById("ausKartennummer").innerHTML = "<td>Card Number:</td><td>" + document.getElementById("Kartennummer").value + "</td>";
  }
  
  if(document.getElementById("saveCeck").checked === true) {
    updateUserDetails();
  }

  if(firebase.auth().currentUser !== null) {
    var userInfo = await functions.httpsCallable('database-getInformationOfCurrentUser')({});
    console.log("User-Information:");
    console.log(userInfo);
    console.log(userDataMissing);
    if((!userDataMissing) || (userInfo.data.data !== null)) {
      addTicketsToWebsite();
      loggedIn = true;
      document.getElementById("zusammenfassungDetails").open = true;
      document.getElementById("ZahlungDetails").open = false;
      document.getElementById("zusammenfassungDetails").hidden = false;
      location.href = '#Zusammenfassung';
    } else {
      //document.getElementById("anmeldung").hidden = true;
      //document.getElementById("guestLogin").hidden = true;
      userDataMissing = false;
    } //end of if-else
  } //end of if
  document.getElementById("hiddenInfo").hidden = false;
  document.getElementById("loadWhile").hidden = true;
} //end of ausgabe

async function updateUserDetails() {
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

  userData.firstName === pVorname ? "" : alert('We could not save the First Name, please try again!');
  userData.lastName === pNachname ? "" : alert('We could not save the Surname, please try again!');
  userData.phone === pRufnummer ? "" : alert('We could not save the Phone Number, please try again!');
  userData.zipCode === pPostleitzahl ? "" : alert('We could not save the Post Code, please try again!');
  userData.city === pStadt ? "" : alert('We could not save the City, please try again!');
  userData.primaryAddress === pStraße ? "" : alert('We could not save the Street + House Number, please try again!');
  userData.secondaryAddress === pZusatz ? "": alert('We could not save the Addition, please try again!');

}


/*__________________________________Ticket-Preview_____________________________________________________*/

function addTicketsToWebsite() {
  document.getElementById("tickets").innerHTML = "";
  if(selectedSeats.length > 0) {
    var date = new Date(screeningTime);
    var dateAsString = (date.getDay() + 1) + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ", " + date.getHours() + ":" + checkForCorrectMinuteWriting(date.getMinutes());
    console.log(selectedSeats[0]);
    for(var i = 0; i < selectedSeats.length; i++) {
      var seat = selectedSeats[i];
      if(seat !== null) {
        var seatObject = document.getElementById(seat.id);
        var seatPrice = seatObject.getAttribute("value");
        createTicket(movieName, cinemaName, (seat.row + 1), (seat.seat + 1), dateAsString, seatPrice);
      } //end of if
    } //end of for
  } //end of if
}

function createTicket(title, hall, row, seat, date, price) {
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
              tHall.innerHTML = "Hall";
              var tHallValue = document.createElement("td");
              tHallValue.innerHTML = hall;
              rowHall.appendChild(tHall);
              rowHall.appendChild(tHallValue);
              var tDate = document.createElement("td");
              tDate.innerHTML = "Date";
              var tDateValue = document.createElement("td");
              tDateValue.innerHTML = date;
              rowHall.appendChild(tDate);
              rowHall.appendChild(tDateValue);
          detailsTable.appendChild(rowHall);
          var rowRow = document.createElement("tr");
              var tRow = document.createElement("td");
              tRow.innerHTML = "Row";
              var tRowValue = document.createElement("td");
              tRowValue.innerHTML = row;
              rowRow.appendChild(tRow);
              rowRow.appendChild(tRowValue);
              var tPrice = document.createElement("td");
              tPrice.innerHTML = "Price";
              var tPriceValue = document.createElement("td");
              tPriceValue.innerHTML = formatAsCurrency(price) + " €";
              rowRow.appendChild(tPrice);
              rowRow.appendChild(tPriceValue);
          detailsTable.appendChild(rowRow);
              var rowSeat = document.createElement("tr");
              var tSeat = document.createElement("td");
              tSeat.innerHTML = "Seat";
              var tSeatValue = document.createElement("td");
          tSeatValue.innerHTML = seat;
          rowSeat.appendChild(tSeat);
          rowSeat.appendChild(tSeatValue);
          detailsTable.appendChild(rowSeat);
      ticketInformation.appendChild(detailsTable);
      ticket.appendChild(ticketInformation);
  tickets.appendChild(ticket);
    //createQrCode(ticket, value);
    movieLogo(ticket);
}

async function movieLogo(element) {
  var movieContainer = element.appendChild(document.createElement("div"));
  movieContainer.classList.add("pic");
  var picContainer = movieContainer.appendChild(document.createElement("div"));
  picContainer.classList.add("image");
  var img = document.createElement("img");
  img.src = movieCoverReference;
  picContainer.appendChild(img);
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

function compareToSelectedSeats(blockedSeatId) {
  var selectedSeatInfo;
  var seatWasBlocked = false;
  for(var i = 0; i < selectedSeats.length; i++) {
    if(selectedSeats[i] !== null) {
      selectedSeatInfo = selectedSeats[i];
      if(selectedSeatInfo !== null) {
        if(parseInt(selectedSeatInfo.id) === parseInt(blockedSeatId)) {
          console.log("Blocked seat is " + blockedSeatId);
          seatWasBlocked = true;
          corruptedSeats.push(selectedSeatInfo);
        } //end of if
      } //end of if
    } //end of if
  } //end of for
  return seatWasBlocked;
} //end of compareToSelectedSeats

function checkSeatsAreNotAlreadyBooked(hallInfo) {
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

function loadTicketInfoIntoLocalStorage() {
    var saver = sessionStorage.getItem("LoggedIn");
    sessionStorage.clear();
    sessionStorage.setItem("LoggedIn", saver);
    var pSurname = document.getElementById("ausVorname").value;
    var pName = document.getElementById("ausNachname").value;
    var pPostalCode = document.getElementById("ausPLZ").value;
    var pAddress = document.getElementById("ausStraße").value;
    var pPaying = document.getElementById("ausKartennummer").value;
    var billInfo = {
      surname : pSurname,
      name : pName,
      postalCode : pPostalCode,
      address : pAddress,
      paying : pPaying
    };
    var billInfoAsString = JSON.stringify(billInfo);
    console.log(bookedTickets);
    var errorExists = bookedTickets[0].data.error;
    try {
      if(typeof errorExists === 'undefined') {
        sessionStorage.setItem("NumberOfTickets", bookedTickets.length);
        sessionStorage.setItem("BillInfo", billInfoAsString);
        var arrayAsString = JSON.stringify(bookedTickets);
        sessionStorage.setItem("Tickets", arrayAsString);
        return true;
      } else {
        if((errorExists.message !== null) && (errorExists.message.localeCompare("You are not logged in!") === 0)) {
          printError(1, "Not logged in");
        } else if((errorExists.message !== null) && (errorExists.message.localeCompare("Ticket was already booked!") === 0)) {
          printError(2, "Seat is blocked");
        } //end of if
        return false;
      }//end of if
    } catch(err) {
      console.log(err);
    } //end of try-catch
    return false;
} //end of loadTicketInfoIntoLocalStorage

async function book() {
  document.getElementById("loading").hidden = false;
  document.getElementById("main").hidden = true;
  var bookingConflict = false;
  var success = false;
  if(seatCounter > 0) {
    var paramBlockedSeats = {id: screeningReference};
    var blockedSeats = await functions.httpsCallable('database-getBookedSeatsByScreeningID')(paramBlockedSeats);
    var corruptedSeats = checkSeatsAreNotAlreadyBooked(blockedSeats);
    var bookingError = corruptedSeats;
    if(bookingError) {
      bookingConflict = true;
      console.log("Found error:");
      printError(2, "Seat is blocked");
    } else {
      await requestSeats();
      success = loadTicketInfoIntoLocalStorage();
    } //end of if-else
    console.log(bookedTickets);
    if(success && loggedIn) {
      window.location.href = "../confirmation/"; // forward to next page
    } else {
      console.log("Error user not logged in!");
      printError(1, "Not logged in");
    }//end of if
  } //end of if
} //end of book

async function requestSeats() {
  var saver = [];
  for(var i = 0; i < selectedSeats.length; i++) {
    var seatInfo = selectedSeats[i];
    if(seatInfo !== null) {
      var ticketParam = {
        screening : screeningReference,
        row : (parseInt(seatInfo.row) + 1),
        seat : (parseInt(seatInfo.seat) + 1)
      } //end of ticketParam
      saver.push(request(ticketParam));
    } //end of if
  } //end of for
  await Promise.all(saver);
} //end of requestSeats

async function request(ticketParam) {
  var ticket = await functions.httpsCallable('database-createTicket')(ticketParam);
  bookedTickets.push(ticket);
} //end of requests

function printError(type, errorMessage) {
  //var errorPlaceholder;
  //var errorParagraph;
  var errorText;
  switch(parseInt(type)) {
    case 1:
      document.getElementById("ZahlungDetails").open = true;
      document.getElementById("selectionDetails").open = false;
      document.getElementById("zusammenfassungDetails").open = false;
      document.getElementById("ZahlungDetails").hidden = false;
      location.href = '#Zahlung';
      //errorPlaceholder = document.getElementById("ErrorContainerZahlung");
      //errorParagraph = document.createElement("p");
      //errorText = document.createTextNode("FEHLER: " + errorMessage + " please log in!");
      //errorParagraph.appendChild(errorText);
      //errorPlaceholder.appendChild(errorParagraph);
      var tickets = document.getElementById("tickets");
      tickets.innerHTML = "";
      alert('You are not looged in, please log in or select guest loggin!');
      break;
    case 2:
      document.getElementById("ZahlungDetails").open = false;
      document.getElementById("selectionDetails").open = true;
      document.getElementById("ZahlungDetails").hidden = true;
      location.href = '#Platzauswahl';
      //errorPlaceholder = document.getElementById("ErrorContainerSeats");
      //errorParagraph = document.createElement("p");
      //errorText = document.createTextNode("FEHLER: " + errorMessage + " please log in!");
      //errorParagraph.appendChild(errorText);
      //errorPlaceholder.appendChild(errorParagraph);
      errorText = "";
      if(corruptedSeats.length !== 0) {
        for(var i = 0; i < parseInt(corruptedSeats.length); i++) {
          errorText = errorText + "Seat number " + (corruptedSeats[i].seat + 1) + " in row " + (corruptedSeats[i].row + 1) + " was already booked!\n";
        } //end of for
      } //end of if
      alert('One of your selected seats was booked by another costumer please select a new one!\n' + errorText)
      break;
    case 3:
      //errorPlaceholder = document.getElementById("ErrorContainerSeats");
      //errorParagraph = document.createElement("p");
      //errorText = document.createTextNode("FEHLER: " + errorMessage);
      //errorParagraph.appendChild(errorText);
      //errorPlaceholder.appendChild(errorParagraph);
      alert('You forgot to select a seat, please select a seat!')
      break;
    default:
      //Nothing todo
      break;
  } //end of switch-case
} //end of printError

async function loginWithGoogle() {
  document.getElementById("anmeldung").hidden = true;
  //document.getElementById("guestLogin").hidden = true;
  document.getElementById("loadWhile").hidden = false;
  const providerGoogle = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(providerGoogle).then(result => {
      var user = result.user;
      var credential = result.credential;
      console.log(user);
      console.log(credential);
      loadCurrentUserData();
      loggedIn = true;
      sessionStorage.setItem("LoggedIn", "in");
      return ;
  }).catch((error) => {
    console.error(error)
    if(error.code === "auth/popup-closed-by-user") {
      document.getElementById("anmeldung").hidden = false;
      //document.getElementById("guestLogin").hidden = true;
      document.getElementById("loadWhile").hidden = true;
    }
  });
} //end of loginWithGoogle

async function loginWithUserCredentials() {
  document.getElementById("anmeldung").hidden = true;
  //document.getElementById("guestLogin").hidden = true;
  document.getElementById("loadWhile").hidden = false;
  var email = document.getElementById("usernameInput").value;
  var password = document.getElementById("passwordInput").value;
  firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      console.log(user);
      loadCurrentUserData();
      loggedIn = true;
      sessionStorage.setItem("LoggedIn", "in");
      return;
  }).catch((error) => {
      console.log(error);
      if(error.code === "auth/email-already-in-use") {
          firebase.auth().signInWithEmailAndPassword(email, password).then((user) => { // eslint-disable-line promise/no-nesting
              loadCurrentUserData();
              return;
          }).catch((error) => {
              console.log(error);
              if(error.code !== "auth/email-already-in-use") {
                  alert(error.message);
              }
          })
      }
      if(error.code === "auth/invalid-email"){
        document.getElementById("anmeldung").hidden = false;
        //document.getElementById("guestLogin").hidden = true;
        document.getElementById("loadWhile").hidden = true;
      }
      
      return error;
  });   
}//end of loginWithUserCredentials

/*async function loginAsGuest() {
  document.getElementById("anmeldung").hidden = true;
  //document.getElementById("guestLogin").hidden = true;
  document.getElementById("hiddenInfo").hidden = false;
  loggedIn = true;
}*/

async function loadCurrentUserData() {
  if(firebase.auth().currentUser !== null){
    const param = {};
    const result = await functions.httpsCallable('database-getInformationOfCurrentUser')(param).then((snapshot) => {
      console.log(snapshot.data.data);
      const userData = snapshot.data.data;
      if(userData !== null) {
        document.getElementById("Vorname").value = "firstName" in  userData  ? userData.firstName : "";
        document.getElementById("Nachname").value = "lastName" in  userData  ? userData.lastName : "";
        document.getElementById("Email").value = "email" in  userData  ? userData.email : "";
        document.getElementById("Rufnummer").value = "phone" in  userData ? userData.phone : "";
        document.getElementById("Postleitzahl").value = "zipCode" in userData ? userData.zipCode : "";
        document.getElementById("Stadt").value = "city" in userData ? userData.city : "";
        document.getElementById("Straße").value = "primaryAddress" in userData ? userData.primaryAddress : "";
        document.getElementById("Zusatz").value = "secondaryAddress" in userData ? userData.secondaryAddress : "";
      }
      document.getElementById("anmeldung").hidden = true;
      //document.getElementById("guestLogin").hidden = true;
      document.getElementById("loadWhile").hidden = true;
      document.getElementById("hiddenInfo").hidden = false;
      document.getElementById("weiter").style.display = "flex";
      document.getElementById("buchen").style.display = "flex";
      loggedIn = true;
      return true;
    }).catch((error) => {
      console.log(error);
    });
  }else{
    document.getElementById("anmeldung").hidden = false;
    //document.getElementById("guestLogin").hidden = false;
  }
}