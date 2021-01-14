import { auth } from 'firebase-admin';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as basics from './basics';

const userCollectionPath = "live/users";
const customersCollectionPath = userCollectionPath + "/customers";

export class User {
    id: string;
    data: FirebaseFirestore.DocumentData;

    constructor(id: string, data: FirebaseFirestore.DocumentData) {
        this.id = id;
        this.data = data;
    }
}

interface UserInformation {
    vorname?: string;
    nachname?: string;
    email?: string;
    phone?: number;
    zipCode?: number;
    city?: string;
    primaryAdress?: string;
    secondaryAdress?: string;
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
            message: "No user is sigend in"
        }
    };
}

async function updateInformationOfUserByID(uid: string, changes: UserInformation) {
    await basics.updateDocumentByID(uid, changes);
    return await basics.getDocumentByID(uid);    
}

export async function updateInformationOfCurrentUser(context: CallableContext, changes: UserInformation) {
    if (context.auth.uid) {
        return updateInformationOfUserByID(context.auth.uid, changes);
    }
    return {
        error: {
            message: "No user is sigend in"
        }
    };
}