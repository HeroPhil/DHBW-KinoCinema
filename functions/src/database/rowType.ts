export const RowType = class {
    id: string;
    data: {type: {get: () => typeof RowType}};
    constructor(id: string, data: {type: {get: () => typeof RowType}}) {
        this.id = id;
        this.data = data;
    }
}