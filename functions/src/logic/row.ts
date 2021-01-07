import { Screening } from "../database/screenings";

export const countRowsOfScreening = (screening: Screening) => {
    let rows = 0;
    screening.data.hall.data.rows.forEach((element: { count: number; }) => {
        rows += element.count;
    });
    return rows;
}
