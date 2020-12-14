import 'jest';
import * as functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

import * as myFunctions from '../src';
import { firestore } from 'firebase-admin';

const testEnv = functions(
    {
        databaseURL: 'https://dhbw-kk-kino.firebaseio.com',
        projectId: 'dhbw-kk-kino'
    },
    './service-account.json'
)



describe('getMovieByID', () => {
    let wrapper: any;
     beforeAll(() => {
         wrapper = testEnv.wrap(myFunctions.database.getAllMovies)

         admin.firestore.

     })

     test('Check if movie is returning', async () => {
        
        const expectV = await admin.firestore().collection("live/events/movies").get();

        wrapped({});

                
        expect().toBe

    

     })
});