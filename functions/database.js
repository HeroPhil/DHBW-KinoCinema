const functions = require('firebase-functions');

const databaseBasics = require('./database/basics');

exports.getDocumentByID = functions.https.onCall((data, context) => {
    return databaseBasics.getDocumentByID(data.id);
});

exports.setDocumentByID = functions.https.onCall((data, context) => {
    return databaseBasics.getDocumentByID(data.id, data.data);
});

exports.updateDocumentByID = functions.https.onCall((data, context) => {
    return databaseBasics.updateDocumentByID(data.id, data.data);
});