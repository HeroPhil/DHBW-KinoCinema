const basics = require('./basics');
const admin = require('./admin').admin;
const db = admin.firestore();

const userCollectionPath = "live/users";
const customersCollectionPath = userCollectionPath + "/customers";

exports.createNewUserInDatabase = async function (user){
    var data = {
        email: user.email,
        displayName: user.displayName
    };
    
    basics.setDocumentByID(customersCollectionPath +"/"+ user.uid, data);
    return user.uid;
}