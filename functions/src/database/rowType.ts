import * as basics from './basics';
export const rowTypeCollectionPath = "/live/infastructure/rowtypes";

export class RowType {
    id: string;
    data: FirebaseFirestore.DocumentData;
    constructor(id: string, data: FirebaseFirestore.DocumentData) {
        this.id = id;
        this.data = data;
    }
}

export async function getAllRowTypes() {
    const movies: RowType[] = [];

    const collection = await basics.getCollectionByID(rowTypeCollectionPath);
    collection.forEach(rowType => {
        movies.push(new RowType(rowType.id, rowType.data()));
        return;
    });

    return movies;
}