import * as basics from './basics';
import {RowType} from './rowType';

export class Hall {
    id: string;
    data: {rows: {type: any}[]};
    constructor (id: string, data: {rows: {type: any}[]}) {
        this.id = id;
        this.data = data;
    }

    async resolveRefs(sl: number): Promise<this>{
        var sublevel = sl || 0;
        if (sublevel < 1) {
            return this;
        }

        var promises: Promise<any>[] = [];
    
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