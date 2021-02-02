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
    if (location.hostname === "127.0.0.1" || location.hostname === "localhost") {
        console.log('This is local emulator environment');
        functions = firebase.functions();
        functions.useFunctionsEmulator("http://localhost:5001");
    } else {
        functions = app.functions("europe-west1");
    }
});
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥



async function testForCurrentUser() {
    document.getElementById("loading").hidden = false;
    document.getElementById("main").hidden = true;

    await new Promise(resolve => setTimeout(resolve, 2500));
    if(firebase.auth().currentUser !== null){
        window.location = "../user";
        return ;
    }
    endLoading();
}


async function loginWithGoogle() {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(providerGoogle).then(result => {
        var user = result.user;
        var credential = result.credential;
        console.log(user);
        console.log(credential);
        testForCurrentUser();
        sessionStorage.setItem("LoggedIn", "in");
        return;
    }).catch((error) => {console.error(error)});
    firebase.auth().currentUser.get
} //end of loginWithGoogle

async function loginWithUserCredentials() {
    var email = document.getElementById("usernameInput").value;
    var password = document.getElementById("passwordInput").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
        console.log(user);
        testForCurrentUser();
        sessionStorage.setItem("LoggedIn", "in");
        return;
    }).catch((error) => {
        console.log(error);
        if(error.code === "auth/email-already-in-use") {
            firebase.auth().signInWithEmailAndPassword(email, password).then((user) => { // eslint-disable-line promise/no-nesting
                testForCurrentUser();
                return;
            }).catch((error) => {
                console.log(error);
                if(error.code !== "auth/email-already-in-use") {
                    alert(error.message);
                }
            })
        }
        
        return error;
    });   
} //end of loginWithUserCredentials

async function loginWithMicrosoft() {
    const providerMicrosoft = new firebase.auth.OAuthProvider('microsoft.com');
    firebase.auth().signInWithPopup(providerMicrosoft).then(result => {
        var user = result.user;
        var credential = result.credential;
        console.log(user);
        console.log(credential);
        testForCurrentUser();
        sessionStorage.setItem("LoggedIn", "in");
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
        testForCurrentUser();
        sessionStorage.setItem("LoggedIn", "in");
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
        testForCurrentUser();
        sessionStorage.setItem("LoggedIn", "in");
        return;
    }).catch((error) => {console.error(error)});
} //end of loginWithFacebook


