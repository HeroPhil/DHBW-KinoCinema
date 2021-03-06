import { httpsOnCall, auth, func} from '../functions';

// import * as basics from './basics';
import * as movies from './movies';
import * as screenings from './screenings';
import * as users from './users';
import * as tickets from './tickets';
import * as halls from './hall';
import * as rowType from './rowType';

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
    return movies.getMoviesByCategory(data.category, parseInt(data.amount) || 5);
});

export const getTopMovies = httpsOnCall((data, context) => {
    return movies.getTopMovies(parseInt(data.amount));
});

export const getAllScreenings = httpsOnCall((data, context) => {
    return screenings.getAllScreenings(parseInt(data.since) || 0, parseInt(data.sublevel) || 0);
});

export const getScreeningsOfMovieByID = httpsOnCall((data, context) => {
    return screenings.getScreeningsOfMovieByID(data.id, parseInt(data.since) || 0, parseInt(data.until) || 99999999999999, parseInt(data.sublevel) || 0);
});

export const createNewUserInDatabase = auth().user().onCreate((user) => {
    return users.createNewUserInDatabase(user);
});

export const getBookedSeatsByScreeningID = httpsOnCall((data, context) => {
    return screenings.getBookedSeatsByScreeningID(data.id);
});

export const createTicket = httpsOnCall((data, context) => {
    return tickets.createTicket(data.screening, parseInt(data.row), parseInt(data.seat), context);
});

export const getTicketByID = httpsOnCall((data, context) => {
    return tickets.getTicketByID(data.id, context, parseInt(data.sublevel) || 3);
});

export const getTicketsOfCurrentUser = httpsOnCall((data, context) => {
    return tickets.getTicketsOfCurrentUser(context, data.orderByAttribute || "buyTime", data.order || "desc", parseInt(data.amount) || 99999, parseInt(data.sublevel) || 3);
});

export const addMovie = httpsOnCall((data, context) => {
    return movies.addMovie(data.categories, data.description, parseInt(data.duration), data.name, parseInt(data.priority), context);
});

export const updateMovie = httpsOnCall((data, context) => {
    return movies.updateMovie(data.id || undefined, data.newData, context);
});

export const addScreening = httpsOnCall((data, context) => {
    return screenings.addScreening(data.movie, data.hall, parseInt(data.price), parseInt(data.startTime), parseInt(data.repetitions) || undefined, parseInt(data.increments) || undefined, context);
});

export const updateScreening = httpsOnCall((data, context) => {
    return screenings.updateScreening(data.id || undefined, data.newData, context);
});

export const getInformationOfCurrentUser = httpsOnCall((data, context) => {
    return users.getInformationOfCurrentUser(context);
});

export const updateInformationOfCurrentUser = httpsOnCall((data, context) => {
    return users.updateInformationOfCurrentUser(context, data.newData);
});

export const promoteUserToAdminByID = httpsOnCall((data, context) => {
    return users.promoteUserToAdminByID(context, data.id || undefined);
});

export const degradeAdminToUserByID = httpsOnCall((data, context) => {
    return users.degradeAdminToUserByID(context, data.id || undefined);
});

export const checkIfCurrentUserIsAdmin = httpsOnCall((data, context) => {
    return users.checkIfCurrentUserIsAdmin(context);
});

export const updateLabelToAdminOnAdminAddedOverDatabase = func().firestore.document('live/users/admins/{docId}').onCreate((snap, context) => {
    return users.updateLabelToAdminOnAdminAddedOverDatabase(snap, context);
});

export const updateLabelToUserOnAdminRemovedOverDatabase = func().firestore.document('live/users/admins/{docId}').onDelete((snap, context) => {
    return users.updateLabelToUserOnAdminRemovedOverDatabase(snap, context);
});

export const getAllHalls = httpsOnCall((data, context) => {
    return halls.getAllHalls(parseInt(data.sublevel) ??  0);
});

export const addHall = httpsOnCall((data, context) => {
    return halls.addHall(data.name ?? "new Hall", data.rows, data.width ?? 1, context);
})

export const getAllRowTypes = httpsOnCall((data, context) => {
    return rowType.getAllRowTypes();
});

export const getAllCategories = httpsOnCall((data, context) => {
    return movies.getAllCategories();
});

export const updateCategoriesOnAddMovie = func().firestore.document('live/events/movies/{docId}').onWrite((change, context) => {
    return movies.updateCategoriesOnAddMovie();
});