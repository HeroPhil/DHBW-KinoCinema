import { auth } from 'firebase-admin';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as basics from './basics';
import { checkIfAnyLogin } from '../logic/auth';
import { admin } from './admin';
import { EventContext } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

const userCollectionPath = "live/users";
const customersCollectionPath = userCollectionPath + "/customers";
const adminsCollectionPath  = userCollectionPath + "/admins";

const allowedKeys = [
    "city",
    "displayName",
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

export async function promoteUserToAdminByID(context: CallableContext, id: string) {
    let error: {message: string} = { message: "" };
    if (id === undefined) {
        console.log("No user was passed to the function!");
        error = {message : "No user was passed to the function!"};
        return {error};
    }

    const checkLogin = checkIfAnyLogin(context);
    if (checkLogin.error) {
        error = checkLogin.error;
        return {error};
    }

    const checkAdmin = await checkIfAdminLogin(context)
    if (checkAdmin.error) {
        error = checkAdmin.error;
        return {error};
    }

    const user = await basics.getDocumentByID(customersCollectionPath + '/' + id);
    console.log(customersCollectionPath + '/' + id);
    if(!user.exists) {
        console.log("This user does not exist!");
        error = {message : "This user does not exist!"};
        return {error};
    }

    const updateToAdmin = await basics.setDocumentByID(adminsCollectionPath + '/' + id, {});
    console.log(updateToAdmin);
    return await getInformationOfUserByID(id);
}

export async function degradeAdminToUserByID(context: CallableContext, id: string) {
    let error: {message: string} = { message: "" };
    if (id === undefined) {
        console.log("No user was passed to the function!");
        error = {message : "No user was passed to the function!"};
        return {error};
    }

    const checkLogin = checkIfAnyLogin(context);
    if (checkLogin.error) {
        error = checkLogin.error;
        return {error};
    }

    const checkAdmin = await checkIfAdminLogin(context)
    if (checkAdmin.error) {
        error = checkAdmin.error;
        return {error};
    }

    const user = await basics.getDocumentByID(customersCollectionPath + '/' + id);
    console.log(customersCollectionPath + '/' + id);
    if(!user.exists) {
        console.log("This user does not exist!");
        error = {message : "This user does not exist!"};
        return {error};
    }

    const degradeToUser = await basics.deleteDocumentByID(adminsCollectionPath + '/' + id);
    console.log(degradeToUser);
    return await getInformationOfUserByID(id);
}

export async function checkIfCurrentUserIsAdmin(context: CallableContext) {
    let error: {message: string} = { message: "" };
    const checkCurrentUser = await checkIfAdminLogin(context);
    if (checkCurrentUser.error) {
        error = checkCurrentUser.error;
        return {error};
    }
    return await getInformationOfUserByID(context.auth.uid);
}

export const checkIfAdminLogin = async (context: CallableContext) => {
    if(!context.auth) {
      console.log("You are not logged in!");
      const error = {message: "You are not logged in!"};
      return {error};
    }
    
    const adminCheck = await basics.getDocumentByID(adminsCollectionPath + '/' + context.auth.uid);
    if(!adminCheck.exists) {
        console.log("You don't have the permission to do this!");
        const error = { message : "You don't have the permission to do this!"};
        return {error};
    }

    return {};
}

export const updateLabelToAdminOnAdminAddedOverDatabase = async (snap: QueryDocumentSnapshot, context: EventContext) => {
    return await admin.auth()
        .setCustomUserClaims(snap.id, { admin: true }).then(() => {
            console.log("Promote to admin: "+ snap.id);
        })
        .catch((err) => console.log(err));
}

export const updateLabelToUserOnAdminRemovedOverDatabase = async (snap: QueryDocumentSnapshot, context: EventContext) => {
    return await admin.auth()
        .setCustomUserClaims(snap.id, { admin: false }).then(() => {
            console.log("Degrade to admin: "+ snap.id);
        })
        .catch((err) => console.log(err));
}