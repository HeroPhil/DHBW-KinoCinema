const basics = require('./basics');
const RowType = require('./rowType').RowType;

exports.Hall = class {

    constructor (id, data) {
        this.id = id;
        this.data = data;
    }

    async resolveRefs(sublevel) {
        var sublevel = sublevel || 0;
        if (sublevel < 1) {
            return this;
        }

        let promises = [];
    
        this.data.rows.forEach(row => {
            promises.push(
                basics.getDocumentByRef(row.type)
                .then(rowTypeDoc => {
                    row.type = new RowType(rowTypeDoc.id, rowTypeDoc.data());
                    return;
                })
            );
        });
        
        await Promise.all(promises);

        return this;
    }

}