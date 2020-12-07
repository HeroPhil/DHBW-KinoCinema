
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

  document.querySelector("output").textContent = "";
  for(i = 0; i < array.length; i++) {
    document.querySelector("output").textContent += array[i] + "\n";
  }

  document.getElementById("zusammenfassungDetails").open = true;
  document.getElementById("ZahlungDetails").open = false;
  document.getElementById("zusammenfassungDetails").hidden = false;
  location.href = '#Zusammenfassung';
}


function book() {
    window.location.href = "../confirmation/confirmation.html";
}
