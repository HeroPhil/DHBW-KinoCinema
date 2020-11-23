const admin = require('./admin').admin;

// Documents
exports.getDocumentByID = function(documentPath) {
    return admin.firestore().doc(documentPath).get();
}

exports.getDocumentByRef = function(documentReference) {
    return documentReference.get();
}

exports.setDocumentByID = function(documentPath, data) {
    return admin.firestore().doc(documentPath).set(data);
}

exports.updateDocumentByID = function(documentPath, data) {
    return admin.firestore().doc(documentPath).update(data);
}

exports.getDocumentRefByID = function(documentPath) {
    return admin.firestore().doc(documentPath);
}


//Collections
exports.getCollectionByID = function(collectionPath) {
    return admin.firestore().collection(collectionPath).get();
}

exports.getCollectionRefByID = function(collectionPath) {
    return admin.firestore().collection(collectionPath);
}

exports.getCollectionByIDWhere = function(collectionPath, field, operator, value) {
    if (typeof value === "undefined") {
        value = operator;
        operator = "==";
    }
    return admin.firestore().collection(collectionPath).where(field, operator, value).get();
}

exports.getCollectionByRef = function(collectionRef) {
    return collectionRef.get();
}

exports.getCollectionByIDLimitAmount = function(collectionPath, amount, orderedByAttribute, order) {
    return admin.firestore().collection(collectionPath).orderBy(orderedByAttribute, order).limit(amount).get();
}

exports.getCollectionRefByID = function(collectionPath) {
    return admin.firestore().collection(collectionPath);
}
