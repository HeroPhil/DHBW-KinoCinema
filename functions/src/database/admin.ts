import * as firebaseAdmin from 'firebase-admin';

export const staticAdmin = firebaseAdmin;
export const admin = staticAdmin.initilaizeApp();