import { auth } from 'firebase-admin';
import * as basics from './basics';

const userCollectionPath = "live/users";
const customersCollectionPath = userCollectionPath + "/customers";

export async function createNewUserInDatabase(user: auth.UserRecord){
    const data = {
        email: user.email,
        displayName: user.displayName,
    };

    await basics.setDocumentByID(customersCollectionPath +"/"+ user.uid, data);
    return user.uid;
}