import * as chai from 'chai';
const assert = chai.assert;

import * as sinon from 'sinon';
import { stubDoc } from './stub';

import * as firebaseFunctionsTest from 'firebase-functions-test';

import  * as admin from '../src/database/admin';
 
import * as index from '../src/index';
import { FeaturesList } from 'firebase-functions-test/lib/features';


describe('Cloud Functions', () => {
  let adminInitStub: sinon.SinonStub<any[], any>;
  let myFunctions: { database: any; temp?: typeof import("../src/temp"); };
  let test: FeaturesList;

  before(() => {
      adminInitStub = sinon.stub(admin.staticAdmin, 'initializeApp');
      myFunctions = index;
      test = firebaseFunctionsTest();
  });

  after(() => {
    adminInitStub.restore();
    test.cleanup();
  });

  describe('getMovieByID', () => {

    it('gets a Movie Object by a given ID', async () => {

      stubDoc(
        admin,
        "live/events/movies/1234567890",
        {
          'cover': "gs://dhbw-kk-kino.appspot.com/live/events/movies/cover/2q0KTjjgsK2RNRg65OX6.jpg",
          'description': "Fernab ihrer Heimat lauert ein weiteres Abenteuer auf die ungleiche Gruppe aus kurz und lang.",
          'duration': 90,
          'name': "Die unglaubliche Reise 2",
          'priority': 20
        }
      );

      const wrappedFunction = test.wrap(myFunctions.database.getMovieByID);

      const param = {
        id: "1234567890"
      };
      const actual = await wrappedFunction(param);

      const expected = {
        "id": param.id,
        "data" : {
          'cover': "gs://dhbw-kk-kino.appspot.com/live/events/movies/cover/2q0KTjjgsK2RNRg65OX6.jpg",
          'description': "Fernab ihrer Heimat lauert ein weiteres Abenteuer auf die ungleiche Gruppe aus kurz und lang.",
          'duration': 90,
          'name': "Die unglaubliche Reise 2",
          'priority': 20
        }
      };
      assert.equal(actual.id, expected.id);
      assert.deepEqual(actual.data, expected.data);

      return;

    });
  });

});