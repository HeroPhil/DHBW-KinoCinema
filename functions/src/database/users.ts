import { auth } from 'firebase-admin';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as basics from './basics';

const userCollectionPath = "live/users";
const customersCollectionPath = userCollectionPath + "/customers";

const allowedKeys = [
    "city",
    "displayName",
    "email",
    "firstName",
    "lastName",
    "phone",
    "primaryAddress",
    "secondaryAddress"
];

export class User {
    id: string;
    data: FirebaseFirestore.DocumentData;

    constructor(id: string, data: FirebaseFirestore.DocumentData) {
        this.id = id;
        this.data = data;
    }
}

export async function createNewUserInDatabase(user: auth.UserRecord){
    const data = {
        email: user.email,
        displayName: user.displayName,
    };

    await basics.setDocumentByID(customersCollectionPath +"/"+ user.uid, data);
    return user.uid;
}

async function getInformationOfUserByID(uid: string) {
    const doc = await basics.getDocumentByID(customersCollectionPath + "/" + uid);
    return new User(doc.id, doc.data());   
}


export async function getInformationOfCurrentUser(context: CallableContext) {
    if (context.auth.uid) {
        return getInformationOfUserByID(context.auth.uid);
    }
    return {
        error: {
            message: "No user is signed in"
        }
    };
}

async function updateInformationOfUserByID(uid: string, changes: { [x: string]: any; firstName?: any; lastName?: any; phone?: any; zipCode?: any; city?: any; primaryAddress?: any; secondaryAddress?: any; email?: any; hasOwnProperty?: any; }) {

    let newData: any = {};
    allowedKeys.forEach((key) => {
        if (key in changes) {
            newData[key] = changes[key];
        }
    });

    await basics.updateDocumentByID(customersCollectionPath + "/" + uid, newData);
    return await getInformationOfUserByID(uid);
}

export async function updateInformationOfCurrentUser(context: CallableContext, changes: { [x: string]: any; firstName?: any; lastName?: any; phone?: any; zipCode?: any; city?: any; primaryAddress?: any; secondaryAddress?: any; email?: any; }) {
    if (context.auth.uid) {
        return updateInformationOfUserByID(context.auth.uid, changes);
    }
    return {
        error: {
            message: "No user is signed in"
        }
    };
}