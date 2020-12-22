import {admin} from './admin';

// Documents
export function getDocumentByID(documentPath: string) {
    return admin.firestore().doc(documentPath).get();
}

export function getDocumentByRef(documentReference: { get: () => any; }) {
    return documentReference.get();
}

export function setDocumentByID(documentPath: string, data: FirebaseFirestore.DocumentData) {
    return admin.firestore().doc(documentPath).set(data);
}

export function updateDocumentByID(documentPath: string, data: FirebaseFirestore.UpdateData) {
    return admin.firestore().doc(documentPath).update(data);
}

export function getDocumentRefByID(documentPath: string) {
    return admin.firestore().doc(documentPath);
}


//Collections
export function getCollectionByID(collectionPath: string) {
    return admin.firestore().collection(collectionPath).get();
}

export function getCollectionRefByID(collectionPath: string) {
    return admin.firestore().collection(collectionPath);
}

export function getCollectionByIDWhere(collectionPath: string, field: string | FirebaseFirestore.FieldPath, operator: FirebaseFirestore.WhereFilterOp, value: any) {
    return admin.firestore().collection(collectionPath).where(field, operator, value).get();
}

export function getCollectionByRef(collectionRef: { get: () => any; }) {
    return collectionRef.get();
}

export function getCollectionByIDLimitAmount(collectionPath: string, amount: number, orderedByAttribute: string | FirebaseFirestore.FieldPath, order: "desc" | "asc") {
    return admin.firestore().collection(collectionPath).orderBy(orderedByAttribute, order).limit(amount).get();
}

//Transactions
export function startTransaction(transaction: any) {
    return admin.firestore().runTransaction(transaction);
}