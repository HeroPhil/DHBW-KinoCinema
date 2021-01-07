import { assert } from 'chai';
import { CallableContext } from 'firebase-functions/lib/providers/https';

import * as nanoid from 'nanoid';
import { checkIfAnyLogin } from '../../src/logic/auth';


describe("checkIfAnyLogin", () => {

    it("should return an error if no user is loged in (checked via context)", () => {

        const positiveContext: CallableContext = {
            auth: {
                uid: nanoid.nanoid().toString(),
                token: null
            },
            rawRequest: null
        }

        const negativContext: CallableContext = {
            auth: null,
            rawRequest: null
        }

        const positiveActual = checkIfAnyLogin(positiveContext);
        const negativeActual = checkIfAnyLogin(negativContext);

        const positiveExpected = { };
        const negativeExpected = {
            error: {
                message: "You are not logged in!"
            }
        };

        assert.deepEqual(positiveActual, positiveExpected);
        assert.deepEqual(negativeActual, negativeExpected);

    })

});