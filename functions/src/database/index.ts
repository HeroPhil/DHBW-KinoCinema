import {func, httpsOnCall} from '../functions';

// import * as basics from './basics';
import * as movies from './movies';
import * as screenings from './screenings';
import * as users from './users';

// export const getDocumentByID = httpsOnCall((data, context) => {
//     return databaseBasics.getDocumentByID(data.id);
// });

// export const setDocumentByID = httpsOnCall((data, context) => {
//     return databaseBasics.setDocumentByID(data.id, data.data);
// });

// export const updateDocumentByID = httpsOnCall((data, context) => {
//     return databaseBasics.updateDocumentByID(data.id, data.data);
// });

export const getAllMovies = httpsOnCall((data, context) => {
    return movies.getAllMovies();
});

export const getMovieByID = httpsOnCall((data, context) => {
    return movies.getMovieByID(data.id);
});

export const getTopMovies = httpsOnCall((data, context) => {
    return movies.getTopMovies(data.amount);
});

export const getAllScreenings = httpsOnCall((data, context) => {
    return screenings.getAllScreenings(data.since || 0, data.sublevel || 0);
});

export const getScreeningsOfMovieByID = httpsOnCall((data, context) => {
    return screenings.getScreeningsOfMovieByID(data.id, data.since || 0, data.sublevel || 0);
});

export const createNewUserInDatabase = func().auth.user().onCreate((user) => {
    return users.createNewUserInDatabase(user);
});