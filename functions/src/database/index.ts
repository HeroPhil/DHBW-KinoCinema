import { httpsOnCall, auth} from '../functions';

// import * as basics from './basics';
import * as movies from './movies';
import * as screenings from './screenings';
import * as users from './users';
import * as tickets from './tickets';

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

export const getMoviesByCategory = httpsOnCall((data, context) => {
    return movies.getMoviesByCategory(data.category, data.amount || 5);
});

export const getTopMovies = httpsOnCall((data, context) => {
    return movies.getTopMovies(data.amount);
});

export const getAllScreenings = httpsOnCall((data, context) => {
    return screenings.getAllScreenings(data.since || 0, data.sublevel || 0);
});

export const getScreeningsOfMovieByID = httpsOnCall((data, context) => {
    return screenings.getScreeningsOfMovieByID(data.id, data.since || 0, data.until || 0, data.sublevel || 0);
});

export const createNewUserInDatabase = auth().user().onCreate((user) => {
    return users.createNewUserInDatabase(user);
});

export const getBookedSeatsByScreeningID = httpsOnCall((data, context) => {
    return screenings.getBookedSeatsByScreeningID(data.id);
});

export const createTicket = httpsOnCall((data, context) => {
    return tickets.createTicket(data.screening, data.row, data.seat, context);
});

export const getTicketByID = httpsOnCall((data, context) => {
    return tickets.getTicketByID(data.id, context, data.sublevel || 3);
});