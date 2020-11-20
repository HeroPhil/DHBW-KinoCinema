const admin = require('./admin').admin;

exports.getDocumentByID = function(documentPath) {
    return admin.firestore().doc(documentPath).get();
}

exports.setDocumentByID = function(documentPath, data) {
    return admin.firestore().doc(documentPath).set(data);
}

exports.updateDocumentByID = function(documentPath, data) {
    return admin.firestore().doc(documentPath).update(data);
}

exports.getCollectionByID = function(collectionPath) {
    return admin.firestore().collection(collectionPath).get();
}

exports.getCollectionByIDLimitAmount = function(collectionPath, amount, orderedByChildName) {
    return admin.firestore().collection(collectionPath).orderByChild(orderedByChildName).limit(amount).get();
}