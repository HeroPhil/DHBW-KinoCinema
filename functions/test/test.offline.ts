import * as chai from 'chai';
const assert = chai.assert;

import * as sinon from 'sinon';

import * as firebaseFunctionsTest from 'firebase-functions-test';

import * as firebaseAdmin from 'firebase-admin';
 
import * as index from '../src/index';
import { FeaturesList } from 'firebase-functions-test/lib/features';


describe('Cloud Functions', () => {
  let adminInitStub: sinon.SinonStub<any[], any>;
  let myFunctions: { database: any; temp?: typeof import("../src/temp"); };
  let test: FeaturesList;

  before(() => {
      adminInitStub = sinon.stub(firebaseAdmin, 'initializeApp');
      myFunctions = index;
      test = firebaseFunctionsTest();
  });

  after(() => {
    adminInitStub.restore();
    test.cleanup();
  });

  describe('getMovieByID', () => {
    //let oldDatabase: { (): FirebaseFirestore.Firestore; (): FirebaseFirestore.Firestore; };
    before(() => {
      // Save the old database method so it can be restored after the test.
      //oldDatabase = firebaseAdmin.firestore;
    });

    after(() => {
      // Restoring admin.database() to the original method.
      //firebaseAdmin.firestore = oldDatabase;
    });

    it('get Movie Object by given ID', (done) => {

      const databaseStub = sinon.stub();
      const docStub = sinon.stub();
      const docParam = "/live/events/movies/1234567890";
      const getStub = sinon.stub();

      Object.defineProperty(firebaseAdmin, 'firestore', { get: () => databaseStub });
      databaseStub.returns({ doc: docStub });
      docStub.withArgs(docParam).returns({ get: getStub });
      getStub.returns(Promise.resolve({
        'cover': "gs://dhbw-kk-kino.appspot.com/live/events/movies/cover/2q0KTjjgsK2RNRg65OX6.jpg",
        'description': "Fernab ihrer Heimat lauert ein weiteres Abenteuer auf die ungleiche Gruppe aus kurz und lang.",
        'duration': 90,
        'name': "Die unglaubliche Reise 2",
        'priority': 20
        }
      ));

      const param = {
        "id": 1234567890
      };

      const wrappedFunction = test.wrap(myFunctions.database.getMovieByID);

      let actual;
      wrappedFunction(param).then((result: any) => {
        actual = result;
        done();
      });
      console.log(actual);
      const expected = {};

      const result = assert.equal(actual, expected);
      console.log(result);
      return result;


    });
  });






});