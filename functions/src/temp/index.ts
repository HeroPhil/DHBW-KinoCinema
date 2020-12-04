
import {httpsOnCall} from '../functions';

import * as debug from './debug';

export const randomNumber = httpsOnCall((data, context) => {
    return debug.getRandomNumber();
});

export const getSecuredData = httpsOnCall((data, context) => {
    return debug.getSecuredData(context);
});