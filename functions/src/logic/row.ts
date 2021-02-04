import { Screening } from "../database/screenings";

export const countRowsOfScreening = (screening: Screening) => {
    let rows = 0;
    screening.data.hall.data.rows.forEach((element: { count: number; }) => {
        rows += element.count;
    });
    return rows;
}

export function getRowTypeIndex(row: number, screening: Screening) {
    let sum = 0;
    let i = row >= 0 ? 0 : -1;
    for(var rowType in screening.data.hall.data.rows) {
        sum += screening.data.hall.data.rows[rowType].count;
        if(row <= sum) {
            return i;
        } else {
            i++;
        }
    }
   return -1;
}
