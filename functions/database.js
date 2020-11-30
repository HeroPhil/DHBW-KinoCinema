const functions = require('firebase-functions');

const databaseBasics = require('./database/basics');
const databaseMovies = require('./database/movies');
const databaseScreenings = require('./database/screenings');
const databaseUsers = require('./database/users');

exports.getDocumentByID = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseBasics.getDocumentByID(data.id);
});

exports.setDocumentByID = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseBasics.setDocumentByID(data.id, data.data);
});

exports.updateDocumentByID = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseBasics.updateDocumentByID(data.id, data.data);
});

exports.getAllMovies = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseMovies.getAllMovies();
});

exports.getMovieByID = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseMovies.getMovieByID(data.id);
});

exports.getTopMovies = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseMovies.getTopMovies(data.amount);
});

exports.getAllScreenings = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseScreenings.getAllScreenings(data.since || 0, data.sublevel || 0);
});

exports.getScreeningsOfMovieByID = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseScreenings.getScreeningsOfMovieByID(data.id, data.since || 0, data.sublevel || 0);
});

exports.getSecuredData = functions.region('europe-west1').https.onCall((data, context) => {
    return databaseMovies.getSecuredData(context.auth);
});

exports.createNewUserInDatabase = functions.region('europe-west1').auth.user().onCreate((user) => {
    return databaseUsers.createNewUserInDatabase(user);
});