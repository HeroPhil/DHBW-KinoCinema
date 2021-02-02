import * as basics from './basics';
import { Movie, moviesCollectionPath } from './movies';
import { Hall } from './hall';
import { createEmptyHallSeatArray, markSeatsAsOccupied } from '../logic/screenings';
import { countRowsOfScreening } from '../logic/row';
import { Ticket } from './tickets';
import { checkIfAdminLogin } from './users';
import { CallableContext } from 'firebase-functions/lib/providers/https';

export const screeningsCollectionPath = 'live/events/screenings'
const ticketsCollectionPath = 'live/events/tickets';
const hallCollectionPath = '/live/infastructure/halls';

export class Screening {
    id: string;
    data: any;
    constructor (id: string, data: any) {
        this.id = id;
        this.data = data;
    }
    
    async resolveRefs(sl = 0) {
        const sublevel = sl || 0;
        if (sublevel < 1) {
            return this;
        }

        const promises: Promise<any>[] = [];
    
        promises.push(
            basics.getDocumentByRef(this.data.movie)
            .then( (movieDoc: { id: string; data: () => any; }) => {
                this.data.movie = new Movie(movieDoc.id, movieDoc.data());
                return;
            })
        );
        
        promises.push(
            basics.getDocumentByRef(this.data.hall)
            .then(async (hallDoc: { id: any; data: () => any; }) => {
                this.data.hall = await new Hall(hallDoc.id, hallDoc.data()).resolveRefs(sublevel - 1);
                return;
            })
        );
    
        await Promise.all(promises);

        return this;
    }

}

interface validChangesInterface {
    [key: string]: any
}

export async function getScreeningByID(id: string, sublevel = 0) {
    const document = await basics.getDocumentByID(screeningsCollectionPath + '/' + id);
    return new Screening(document.id, document.data()).resolveRefs(sublevel);
}

export async function getAllScreenings(since = 0, sublevel = 0) {
    const screenings: Screening[] = [];

    const query = basics.getCollectionRefByID(screeningsCollectionPath)
        .where("startTime", ">=", since);
    const collection = await basics.getCollectionByRef(query);
    
    const promises = [];
    for (const screening of collection.docs) {
        promises.push(new Screening(screening.id, screening.data()).resolveRefs(sublevel)
            .then((screeningObj => {
                screenings.push(screeningObj);
                return;
            }))
        );
    }

    await Promise.all(promises);

    return screenings;
}

export async function getScreeningsOfMovieByID(id: string, since = 0, until=99999999999999, sublevel = 0) {
    const screenings: Screening[] = [];

    const movieDocRef = basics.getDocumentRefByID(moviesCollectionPath + '/' + id);

    const query = await basics.getCollectionRefByID(screeningsCollectionPath)
        .where("movie", "==", movieDocRef)
        .where("startTime", ">=", since)
        .where("startTime", "<=", until);
        
    const collection = await basics.getCollectionByRef(query);
    
    const promises: Promise<any>[] = [];
    for (const screening of collection.docs) {
        promises.push(new Screening(screening.id, screening.data()).resolveRefs(sublevel)
            .then((screeningObj => {
                screenings.push(screeningObj);
                return;
            }))
        );
    }

    await Promise.all(promises);

    return screenings;
}

export async function getBookedSeatsByScreeningID(id: string) {
    const screeningRef = basics.getDocumentRefByID(screeningsCollectionPath + "/" + id);

    const query = basics.getCollectionRefByID(ticketsCollectionPath)
        .where("screening", "==", screeningRef);
    const tickets = basics.getCollectionByRef(query).then((collection: { docs: any; }) => {
        const result = [];
        for (const doc of collection.docs) {
            result.push(new Ticket(doc.id, doc.data()));
        }
        return result;
    });

    const screening = await getScreeningByID(id, 1);

    const rows = countRowsOfScreening(screening);
    
    const width = screening.data.hall.data.width;
    let seats = createEmptyHallSeatArray(width, rows);

    seats = markSeatsAsOccupied(seats, await tickets);
    
    return seats; 
}

export async function addScreening(movie:  string, hall: string, price: number, startTime: number, repetitions: number, increments: number, context: CallableContext) {
    let error: {message: string} = { message: "" };
    const screenings: Screening[] = [];

    //check if user is logged in as admin
    const checkAdmin = await checkIfAdminLogin(context)
    if (checkAdmin.error) {
        error = checkAdmin.error;
        return {error};
    }
    
    const movieRef = await basics.getDocumentRefByID(moviesCollectionPath + "/" + movie);
    const movieDoc = await basics.getDocumentByRef(movieRef);

    if(!movieDoc.exists) {
        console.log("This movie does not exist!");
        error.message = "This movie does not exist!";
        return {error};
    }

    const hallRef = await basics.getDocumentRefByID(hallCollectionPath + "/" + hall);
    const hallDoc = await basics.getDocumentByRef(hallRef);

    if(!hallDoc.exists) {
        console.log("This hall does not exist!");
        error.message = "This hall does not exist!";
        return {error};
    }
    
    if(repetitions !== undefined && increments !== undefined) {
        for(let i = 0; i < repetitions; i++){
            const modifiedStartTime = startTime + (i * increments);
            const data = {
                movie:  movieRef,
                hall: hallRef,
                price: price,
                startTime: modifiedStartTime
            };

            const screeningRef = await basics.addDocToCollectionByID(screeningsCollectionPath, data);
            const screening = await basics.getDocumentByRef(screeningRef);

            screenings.push(await new Screening(screening.id, screening.data()).resolveRefs(3));
        } 
    } else {
        const dataOnce = {
            movie:  movieRef,
            hall: hallRef,
            price: price,
            startTime: startTime
        };

        const screeningRef = await basics.addDocToCollectionByID(screeningsCollectionPath, dataOnce);
        const screening = await basics.getDocumentByRef(screeningRef);

        screenings.push(await new Screening(screening.id, screening.data()).resolveRefs(3));
    }
    
  return screenings;
}

export async function updateScreening(id: string, newData: {movie: any, hall: any, price: any, startTime: any}, context: CallableContext) {
    let error: {message: string} = { message: "" };
    const validChanges: validChangesInterface = {};

    //check if user is logged in as admin
    const checkAdmin = await checkIfAdminLogin(context)
    if (checkAdmin.error) {
        error = checkAdmin.error;
        return {error};
    }

    //check if screening is passed as parameter (defaulted to undefined) and check if screening exists in database
    if(id !== undefined) {
        const screeningRef = await basics.getDocumentRefByID(screeningsCollectionPath + "/" + id);
        const screeningDoc = await basics.getDocumentByRef(screeningRef);
        if(!screeningDoc.exists) {
            console.log("This screening does not exist!");
            error.message = "This screening does not exist!";
            return {error};
        }
    } else {
        console.log("No screening was passed to the function!");
        error.message = "No screening was passed to the function!";
        return {error};
    }

    //check if movie exists in database
    if(newData.movie !== undefined) {
        const movieRef = await basics.getDocumentRefByID(moviesCollectionPath + "/" + newData.movie);
        const movieDoc = await basics.getDocumentByRef(movieRef);
        if(!movieDoc.exists) {
            console.log("This movie does not exist!");
            error.message = "This movie does not exist!";
            return {error};
        }
        validChanges.movie = movieRef;
    }
    
    //check if hall exists in database
    if(newData.hall !== undefined) {
        const hallRef = await basics.getDocumentRefByID(hallCollectionPath + "/" + newData.hall);
        const hallDoc = await basics.getDocumentByRef(hallRef);
    
        if(!hallDoc.exists) {
            console.log("This hall does not exist!");
            error.message = "This hall does not exist!";
            return {error};
        }
        validChanges.hall = hallRef;
    }

    //add other valid changes that don't need a database test
    if("startTime" in newData) {
        validChanges.startTime = newData.startTime;
    }

    if("price" in newData) {
        validChanges.price = newData.price;
    }

    //update database if every check passed
    const screening = await basics.updateDocumentByID(screeningsCollectionPath+ '/' + id, validChanges);
    console.log(screening);
    return new Screening(id, validChanges); 
}