import { auth } from 'firebase-admin';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as basics from './basics';
import { checkIfAnyLogin } from '../logic/auth';

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
    "secondaryAddress",
    "zipCode"
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
    let error: {message: string} = { message: "" };
    const checkLogin = checkIfAnyLogin(context);
    if (checkLogin.error) {
        error = checkLogin.error;
        return {error};
    }
    return getInformationOfUserByID(context.auth.uid);
}

async function updateInformationOfUserByID(uid: string, changes: { [x: string]: any; }) {

    const newData: any = {};
    allowedKeys.forEach((key) => {
        if (key in changes) {
            newData[key] = changes[key];
        }
    });

    await basics.updateDocumentByID(customersCollectionPath + "/" + uid, newData);
    return await getInformationOfUserByID(uid);
}

export async function updateInformationOfCurrentUser(context: CallableContext, changes: { [x: string]: any; }) {
    let error: {message: string} = { message: "" };
    const checkLogin = checkIfAnyLogin(context);
    if (checkLogin.error) {
        error = checkLogin.error;
        return {error};
    }
    return updateInformationOfUserByID(context.auth.uid, changes);
}