// List of all functions to be considerd while deploying to Firebase

// temp.ts contains testing functions
import * as tempFunctions from './temp/index';
export const temp = tempFunctions;

//database.js contains Firestore connection functions
import * as databaseFunctions from './database/index';
export const database = databaseFunctions;