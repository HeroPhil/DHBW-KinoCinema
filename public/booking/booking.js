
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

