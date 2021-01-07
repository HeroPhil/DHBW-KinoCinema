import { Screening } from "../database/screenings";


export const countRows = (screening: Screening) => {
    let rows = 0;
    screening.data.hall.data.rows.forEach((element: { count: number; }) => {
        rows += element.count;
    });
    return rows;
}


export const createEmptyHallSeatArray = (seatCount: number, rowCount: number) => {
    const seats: (boolean[])[] = [];
    for(let r = 0; r < rowCount; r++) {
        const row: boolean[] = [];
        for(let s = 0; s < seatCount; s++) {
            row.push(false);
        }
        seats.push(row);
    }

    return seats;

}


export const markSeatsAsOccupied = (seats: boolean[][], tickets: { docs: { data: () => any; }[]; } ) => {
    tickets.docs.forEach((ticket: { data: () => any; }) => {
        seats[ticket.data().row - 1][ticket.data().seat - 1] = true;
    });
    
    return seats;

}



