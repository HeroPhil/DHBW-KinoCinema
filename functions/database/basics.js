const admin = require('firebase-admin');
admin.initializeApp();

exports.getDocumentByID = function(documentPath) {
    return admin.firestore().doc(documentPath).get()
    .then( snapshot => {
        return snapshot.data();
    });
}