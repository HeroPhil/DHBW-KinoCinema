const basics = require('./basics');

const screeningsCollectionPath = 'live/events/screening'

function Screening(id, data) {
    this.id = id;
    this.data = data;
    
}

exports.getScreeningByID = function(id) {
    const document = await basics.getDocumentByID(screeningsCollectionPath + '/' + id)
    return new Screening(document.id, document.data());
}

exports.getAllScreenings = function() {
    let screenings = [];

    const collection = await basics.getCollectionByID(screeningsCollectionPath);
    collection.forEach(screening => {
        movies.push(new Screening(screening.id, screening.data()));
    });

    return screenings;
}

exports.getAllScreeningsOfMovieByID = function(id) {
    let screenings = [];

    const collection = await basics.getCollectionByID(screeningsCollectionPath);
    collection.forEach(screening => {
        movies.push(new Screening(screening.id, screening.data()));
    });

    return screenings;
}