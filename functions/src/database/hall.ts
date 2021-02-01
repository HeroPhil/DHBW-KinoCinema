import * as basics from './basics';
import {RowType, rowTypeCollectionPath} from './rowType';

const hallCollectionPath = "/live/infastructure/halls";

export class Hall {
    id: string;
    data: { [x: string]: any; rows?: { type: any; }[]; };
    constructor (id: string, data: { [x: string]: any; rows?: { type: any; }[]; }) {
        this.id = id;
        this.data = data;
    }

    async resolveRefs(sl: number): Promise<this>{
        const sublevel = sl || 0;
        if (sublevel < 1) {
            return this;
        }

        const promises: Promise<any>[] = [];
    
        this.data.rows.forEach((row) => {
            promises.push(
                basics.getDocumentByRef(row.type)
                .then((rowTypeDoc: { id: any; data: () => any; }) => {
                    row.type = new RowType(rowTypeDoc.id, rowTypeDoc.data());
                    return;
                })
            );
        });
        
        await Promise.all(promises);

        return this;
    }
}

export async function getAllHalls(sublevel = 0) {
    const promises: Promise<any>[] = [];
    const halls: Hall[] = [];

    const collection = await basics.getCollectionByID(hallCollectionPath);
    for (const hall of collection.docs) {
        promises.push(new Hall(hall.id, hall.data()).resolveRefs(sublevel)
            .then((hallObj => {
                halls.push(hallObj);
                return;
            }))
        );
    }

    await Promise.all(promises);

    return halls;
}

export async function addHall(name: string, rows: { count: number; id: string; }[], width: number) {
    const data: {name: string, rows: { count: number; type: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>; }[], width: number} = {
        "name": name,
        "width": width,
        "rows": []
    };
    const rowsWithRef: { count: number; type: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>; }[] = [];

    rows.forEach((row: { count: number; id: string; }) => {
        rowsWithRef.push(
            {
                "count": row.count,
                "type": basics.getDocumentRefByID(rowTypeCollectionPath + "/" + row.id)
            }
        );
    });

    data.rows = rowsWithRef;

    const hallRef = await basics.addDocToCollectionByID(hallCollectionPath, data);
    const hallDoc = await basics.getDocumentByRef(hallRef);

    return new Hall(hallDoc.id, hallDoc.data()); 
}