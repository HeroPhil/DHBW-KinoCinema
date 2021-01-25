import * as functions from 'firebase-functions';

export function func() {
    return functions.region('europe-west1');
}

export function auth() {
    return func().auth;
}

export function httpsOnCall(handler: (data: any, context: functions.https.CallableContext) => any) {
    return func().https.onCall(handler)
}
