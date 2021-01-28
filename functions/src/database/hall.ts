import * as basics from './basics';
import {RowType} from './rowType';

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