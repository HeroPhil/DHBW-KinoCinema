const admin = require('./admin').admin;

exports.getDocumentByID = function(documentPath) {
    return admin.firestore().doc(documentPath).get()
    .then( snapshot => {
        return snapshot.data();
    });
}

exports.setDocumentByID = function(documentPath, data) {
    return admin.firestore().doc(documentPath).set(data)
    .then( writeResult => {
        return writeResult;
    });
}

exports.updateDocumentByID = function(documentPath, data) {
    return admin.firestore().doc(documentPath).update(data)
    .then( writeResult => {
        return writeResult;
    });
}

exports.getCollectionByID = function(collectionPath) {
    return admin.firestore().collection(collectionPath).get();
}