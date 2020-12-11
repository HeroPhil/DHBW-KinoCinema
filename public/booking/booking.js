
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.seat-row .seat:not(.occupied)');
const count = document.getElementById('count');
const price = document.getElementById('price');

let ticketPrice = +document.getElementById('movie').getAttribute('value');

const populateUI = () => {
  const selectedSeats = document.querySelectorAll('.seat-row .selected');

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

};

populateUI();


const updateSelectedSeatsCount = () => {
  const selectedSeats = document.querySelectorAll('.seat-row .selected');

  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  price.innerText = selectedSeatsCount * ticketPrice;
};

// Seat select event
container.addEventListener('click', e => {
  if (
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
  ) {
    e.target.classList.toggle('selected');

    updateSelectedSeatsCount();
  }
});


// dynamic seats
function seatGeneration() {
  var seatContainer = document.getElementById("seatContainer");
  var rowScreen = document.createElement("div");
    rowScreen.classList.add("seat-row");
    var screen = document.createElement("div");
      screen.classList.add("screen");
    rowScreen.appendChild(screen);
    seatContainer.appendChild(rowScreen);
  
  for(i = 1; i <= 14; i++) {
    var row = document.createElement("div");
      row.classList.add("seat-row")
      for(j = 1; j <= 14; j++) {
        var seat = document.createElement("div");
        seat.classList.add("seat");
        row.appendChild(seat);
      }
      seatContainer.appendChild(row);
    
  }
}



/*
 * --------------------------------------------------------------------------
 */

function jumpToZahlung() {
   document.getElementById("ZahlungDetails").open = true;
   document.getElementById("selectionDetails").open = false;
   document.getElementById("ZahlungDetails").hidden = false;
   location.href = '#Zahlung';
}

 

//weiter Button click event
function ausgabe() {
  var array = [];
  array.push(document.getElementById("Vorname").value);
  array.push(document.getElementById("Nachname").value);
  array.push(document.getElementById("Email").value);
  array.push(document.getElementById("Rufnummer").value);
  array.push(document.getElementById("Postleitzahl").value);
  array.push(document.getElementById("Stadt").value);
  array.push(document.getElementById("Straße").value);
  array.push(document.getElementById("Hausnummer").value);
  array.push(document.getElementById("Zusatz").value);
  array.push(document.getElementById("Kartennummer").value);
  array.push(document.getElementById("Karteninhaber").value);

  document.getElementById("ausVorname").innerHTML = array[0];
  document.getElementById("ausNachname").innerHTML = array[1];
  //document.getElementById("ausEmail")



  document.querySelector("output").textContent = "";
  for(i = 0; i < array.length; i++) {
    document.querySelector("output").textContent += array[i] + "\n";
  }

  document.getElementById("zusammenfassungDetails").open = true;
  document.getElementById("ZahlungDetails").open = false;
  document.getElementById("zusammenfassungDetails").hidden = false;
  location.href = '#Zusammenfassung';
}


//Checkbox Rechnungsadresse
function otherAdr() {
  var adresse = document.getElementById("check");
  if(adresse.checked == true) {
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

function book() {
    window.location.href = "../confirmation/confirmation.html";
}
