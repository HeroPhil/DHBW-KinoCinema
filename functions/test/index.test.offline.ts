import * as chai from 'chai';
const assert = chai.assert;

import * as sinon from 'sinon';

import * as test from 'firebase-functions-test';
import { admin } from '../src/database/admin';
 
import * as index from '../src/index';


describe('Cloud Functions', () => {
  let adminInitStub: sinon.SinonStub<any[], any>;
  let myFunctions: { getMovieByID?: any; temp?: typeof import("../src/temp"); database?: typeof import("../src/database"); };

  before(() => {
      adminInitStub = sinon.stub(admin, 'initializeApp');
      myFunctions = index;
  });

  after(() => {
    adminInitStub.restore();
    //test.cleanup();
  });

  describe('getMovieByID', () => {
    it('get Movie Object by given ID', () => {

      const data = {
        "id": 123
      };

      const context = {};

    });
  });






});