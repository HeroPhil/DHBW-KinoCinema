import { Screening } from "../database/screenings";
import { countRowsOfScreening } from "./row";

export const checkIfSeatIsValidInScreening = (cord: {row: number, seat: number}, screening: Screening) => {
    const rowCount = countRowsOfScreening(screening);
    const width = screening.data.hall.data.width;

    if(!(1 <= cord.seat && cord.seat <= width) || !(1 <= cord.row && cord.row <= rowCount)) {
        console.log("This seat does not exist!");
        const error = {message: "This seat does not exist!"};
        return {error};
      }

      return {};
}