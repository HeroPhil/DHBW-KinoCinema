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
let qrcodesAsImg = [];
let billInfo;
let writtenPixels;
const spaceBetweenText = 15;

function loadContent() {
  try {
    numberOfTickets = parseInt(sessionStorage.getItem("NumberOfTickets"));
    billInfo = JSON.parse(sessionStorage.getItem("BillInfo"));
    ticketsInfo = JSON.parse(sessionStorage.getItem("Tickets"));
    if (ticketsInfo === null) {
      throw new Error("no tickets");
    }
    console.log(billInfo);
    console.log(ticketsInfo);
  } catch(err) {
    console.log(err);
    window.location = "../index/";
  } //end of try-catch
  loadTicketsWithQRCode();
  endLoading();
} //end of loadContent

function checkForCorrectMinuteWriting(timeStamp) {
  if(timeStamp < 10) {
      return "0" + timeStamp;
  } else {
      return timeStamp;
  } //end of if-else
} //end of checkForCorrectMinuteWriting

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
      var date = (dateOfScreening.getDay() + 1) + "." + (dateOfScreening.getMonth() + 1) + "." + dateOfScreening.getFullYear() + ", " + dateOfScreening.getHours() + ":" + checkForCorrectMinuteWriting(dateOfScreening.getMinutes());
      createTicket(movieTitle, hallId, actualTicket.data.row, actualTicket.data.seat, date, actualTicket.data.price, ticketId);
    } //end of if
  } //end of for
} //end of loadTicketsWithQRCode

function createTicket(title, hall, row, seat, date, price, value) {
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
    createQrCode(ticket, value);
    html2canvas(ticket).then(canvas => {
      var imgBase64Coded = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      var imgPNG = canvas.toDataURL("image/png");
      var imgJPG = canvas.toDataURL("image/jpeg");
      qrcodesAsImg.push(imgPNG);
      console.log(imgBase64Coded);
      console.log(imgPNG);
      console.log(imgJPG);
      return;
    }).catch((error) => {
      console.log(error);
    });
} //end of createTicket

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
} //end of createQrCode

async function printAndSaveTickets() {
  var downloadablePDF = createPDF();
  downloadablePDF.save("kinocinema_order_list");
} //end of printAndSaveTickets

function initializePDF(pdfDocument) {
  pdfDocument-setFont("arial");
  writtenPixels = 0;
  pdfDocument.setFontSize(12);
  pdfDocument.setDrawColor(120, 120, 82);
  pdfDocument.setLineWidth(2);
} //end of initializePDF

function createPDF() {
  var pdf = new jsPDF("p", "mm", "a4");
  addLine(pdf, 9.5, 9.5);
  addTicketsHeadline(pdf, "Tickets");
  addLine(pdf, 26, 26);
  addTicketsToPDF(pdf);
  return pdf;
} //end of createPDF

function addMayorHeadline(pdfDocument, contentOfHeadline) {
  pdfDocument.setFontSize(20);
  pdfDocument.text(contentOfHeadline, 90, 20);
  writtenPixels = writtenPixels + 50 + spaceBetweenText;
  pdfDocument.setFontSize(12);
} //end of addHeadline

function addTicketsHeadline(pdfDocument, contentOfHeadline) {
  pdfDocument.setFontSize(20);
  pdfDocument.text(contentOfHeadline, 95, 20);
  writtenPixels = writtenPixels + 50 + spaceBetweenText;
  pdfDocument.setFontSize(12);
} //end of addHeadline

function addLine(pdfDocument, positionX, positionY) {
  pdfDocument.line(10, positionX, 200, positionY);
} //end of addLine

function addTicketsToPDF(pdfDocument) {
  var x = 25;
  var y = 40;
  var width = 160;
  var height = 55;
  var firstPageFinished = false;
  var pictureAddedCounter = 0;
  var pictureAddedBySideCounter = 0;
  for(var i = 0; i < qrcodesAsImg.length; i++) {
    if(!firstPageFinished && pictureAddedBySideCounter === 3) {
      firstPageFinished = true;
      pictureAddedBySideCounter = 0;
      pdfDocument.addPage();
      y = 10;
    } //end of if
    if(firstPageFinished && pictureAddedBySideCounter === 4) {
      pdfDocument.addPage();
      pictureAddedBySideCounter = 0;
      y = 10;
    } //end of if
    var img = qrcodesAsImg[i];
    pdfDocument.addImage(img, "png", x, y, width, height);
    y = y + height + 10;
    pictureAddedBySideCounter++;
    pictureAddedCounter++;
  } //end of for
} //end of addImageToPDF


function formatAsCurrency(number) {
  const sp = number.toString().split(".");
  if (sp.length > 1) {
    sp[sp.length-1] = sp[sp.length-1].concat("0".repeat(2 - sp[sp.length-1].length));
    return sp.join(".");
  }
  return sp[0].concat(".00");
}