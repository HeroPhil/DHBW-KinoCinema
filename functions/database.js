const functions = require('firebase-functions');

const basics = require('./database/basics');


exports.getDocumentByID = functions.https.onCall((data, context) => {
    return basics.getDocumentByID(data.id);
});