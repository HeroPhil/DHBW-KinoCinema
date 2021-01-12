// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// // The Firebase SDK is initialized and available here!
//
// firebase.auth().onAuthStateChanged(user => { });
// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
// firebase.firestore().doc('/foo/bar').get().then(() => { });
// firebase.functions().httpsCallable('yourFunction')().then(() => { });
// firebase.messaging().requestPermission().then(() => { });
// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
// firebase.analytics(); // call to activate
// firebase.analytics().logEvent('tutorial_completed');
// firebase.performance(); // call to activate
let app;
let functions;
document.addEventListener("DOMContentLoaded", event => {
    app = firebase.app();
    functions = app.functions("europe-west1");
});
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

async function loginWithGoogle() {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(providerGoogle).then(result => {
        var user = result.user;
        var credential = result.credential;
        console.log(user);
        console.log(credential);
        return;
    }).catch((error) => {console.error(error)});
} //end of loginWithGoogle

async function loginWithUserCredentials() {
    var email = document.querySelector("#username").value;
    var password = document.querySelector("#password").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });   
} //end of loginWithUserCredentials

async function loginWithMicrosoft() {
    const providerMicrosoft = new firebase.auth.OAuthProvider('microsoft.com');
    firebase.auth().signInWithPopup(providerMicrosoft).then(result => {
        var user = result.user;
        var credential = result.credential;
        console.log(user);
        console.log(credential);
        return;
    }).catch((error) => {console.error(error)});
} //end of loginWithMicrosoft

async function loginWithFacebook() {
    const providerFacebook = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(providerFacebook).then(result => {
        var user = result.user;
        var credential = result.credential;
        console.log(user);
        console.log(credential);
        return;
    }).catch((error) => {console.error(error)});
} //end of loginWithFacebook

async function loginWithApple() {
    const providerApple = new firebase.auth.OAuthProvider('apple.com');
    firebase.auth().signInWithPopup(providerApple).then(result => {
        var user = result.user;
        var credential = result.credential;
        console.log(user);
        console.log(credential);
        return;
    }).catch((error) => {console.error(error)});
} //end of loginWithFacebook