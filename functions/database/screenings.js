const basics = require('./basics');
const Movie = require('./movies').Movie;
const Hall = require('./hall').Hall;

const screeningsCollectionPath = 'live/events/screening'

class Screening {
    constructor (id, data) {
        this.id = id;
        this.data = data;
    }
    
    async resolveRefs(sublevel = 0) {
        var sublevel = sublevel || 0;
        if (sublevel < 1) {
            return this;
        }

        let promises = [];
    
        promises.push(
            basics.getDocumentByRef(this.data.movie)
            .then( movieDoc => {
                this.data.movie = new Movie(movieDoc.id, movieDoc.data());
                return;
            })
        );
        
        promises.push(
            basics.getDocumentByRef(this.data.hall)
            .then(async hallDoc => {
                this.data.hall = await new Hall(hallDoc.id, hallDoc.data()).resolveRefs(sublevel - 1);
                return;
            })
        );
    
        await Promise.all(promises);

        return this;
    }

}

exports.getScreeningByID = async function(id) {
    const document = await basics.getDocumentByID(screeningsCollectionPath + '/' + id);
    return await new Screening(document.id, document.data().resolveRefs());
}

exports.getAllScreenings = async function(sublevel = 0) {
    let screenings = [];

    const collection = await basics.getCollectionByID(screeningsCollectionPath);
    
    for (const screening of collection.docs) {
        screenings.push(await new Screening(screening.id, screening.data()).resolveRefs(sublevel));
    }

    return screenings;
}

// exports.getAllScreeningsOfMovieByID = function(id) {
//     let screenings = [];

//     const collection = await basics.getCollectionByID(screeningsCollectionPath);
//     collection.forEach(screening => {
//         movies.push(new Screening(screening.id, screening.data()));
//     });

//     return screenings;
// }