const functions = require('firebase-functions');

exports.randomNumber = functions.https.onCall((data, context) => {
    const number = Math.round(Math.random() * 100);
    return number;
});
