const functions = require('firebase-functions');

const databaseBasics = require('./database/basics');
const databaseMovies = require('./database/movies');

exports.getDocumentByID = functions.https.onCall((data, context) => {
    return databaseBasics.getDocumentByID(data.id);
});

exports.setDocumentByID = functions.https.onCall((data, context) => {
    return databaseBasics.setDocumentByID(data.id, data.data);
});

exports.updateDocumentByID = functions.https.onCall((data, context) => {
    return databaseBasics.updateDocumentByID(data.id, data.data);
});

exports.getAllMovies = functions.https.onCall((data, context) => {
    return databaseMovies.getAllMovies();
});

exports.getMovieByID = functions.https.onCall((data, context) => {
    return databaseMovies.getMovieByID(data.id);
});