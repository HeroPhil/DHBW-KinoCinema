const functions = require('firebase-functions');

const basics = require('./database/basics');


exports.getDocumentByID = functions.https.onCall((data, context) => {
    console.log(data);
    console.log(data());
    return basics.getDocumentByID(data.id);
});