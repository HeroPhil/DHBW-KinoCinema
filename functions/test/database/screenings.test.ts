import * as chai from 'chai';
const assert = chai.assert;

import * as sinon from 'sinon';
import { stubDoc } from '../stub';

import * as firebaseFunctionsTest from 'firebase-functions-test';

import  * as admin from '../../src/database/admin';
 
import * as index from '../../src/index';
import { FeaturesList } from 'firebase-functions-test/lib/features';
import { getCollectionByRef, getCollectionRefByID, getDocumentRefByID } from '../../src/database/basics';


describe('Cloud Functions', () => {
    let adminInitStub: sinon.SinonStub<any[], any>;
    let myFunctions: { database: any; temp?: typeof import("../../src/temp"); };
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


    describe('getBookedSeatsByScreeningID', () => {

        it('finds out all booked seats of a screenig by going through all tickets', async () => {



            //prepare stub

            
            const refStub = sinon.stub();
            const screeningdocStub = sinon.stub();
            const ticketcolStub = sinon.stub();
            const ticketcolWhereStub = sinon.stub();
            const ticketDocsStub = sinon.stub();
            let ticketDocs: any[] = [];

            Object.defineProperty(admin.admin, 'firestore', { get: () => refStub });
            
            refStub.withArgs("screeningdoc").returns({screeningdocStub});
            refStub.withArgs("ticketcol").returns({ticketcolStub});
                ticketcolStub.returns({
                    where: ticketcolWhereStub,
                    get: ticketDocsStub
                });
                    ticketcolWhereStub.returns("ticket");
                    ticketDocsStub.returns(ticketDocs);




            const wrappedFunction = test.wrap(myFunctions.database.getBookedSeatsByScreeningID);



            //act
            const param = {
                id: 123465789
            };
            const actual = await wrappedFunction(param);


            //assert
            const expected = [
                [false, false],
                [true, true]
            ];

            assert.deepEqual(actual, expected);

            return;
        })




    })

});