const functions = require('firebase-functions');

exports.randomNumber = functions.region('europe-west1').https.onCall((data, context) => {
    const number = Math.round(Math.random() * 100);
    return number;
});
