import * as basics from './basics';
import { Movie, moviesCollectionPath } from './movies';
import { Hall } from './hall';

const screeningsCollectionPath = 'live/events/screenings'
const ticketsCollectionPath = 'live/events/tickets';

class Screening {
    id: string;
    data: any;
    constructor (id: string, data: any) {
        this.id = id;
        this.data = data;
    }
    
    async resolveRefs(sl = 0) {
        var sublevel = sl || 0;
        if (sublevel < 1) {
            return this;
        }

        var promises: Promise<any>[] = [];
    
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

export async function getScreeningByID(id: string, sublevel = 0) {
    const document = await basics.getDocumentByID(screeningsCollectionPath + '/' + id);
    return new Screening(document.id, document.data()).resolveRefs(sublevel);
}

export async function getAllScreenings(since = 0, sublevel = 0) {
    var screenings: Screening[] = [];

    const query = basics.getCollectionRefByID(screeningsCollectionPath)
        .where("startTime", ">=", since);
    const collection = await basics.getCollectionByRef(query);
    
    var promises = [];
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

export async function getScreeningsOfMovieByID(id: string, since = 0, sublevel = 0) {
    var screenings: Screening[] = [];

    var movieDocRef = basics.getDocumentRefByID(moviesCollectionPath + '/' + id);
    console.log(movieDocRef);

    const query = basics.getCollectionRefByID(screeningsCollectionPath)
        .where("startTime", ">=", since)
        .where("movie", "==", movieDocRef);
    const collection = await basics.getCollectionByRef(query);
    
    var promises: Promise<any>[] = [];
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
    const sreeningRef = basics.getDocumentRefByID(screeningsCollectionPath + "/" + id);
    const query = basics.getCollectionRefByID(ticketsCollectionPath)
        .where("screening", "==", sreeningRef);
    const collection = await basics.getCollectionByRef(query);
    
    const screening = await getScreeningByID(id, 1);
    const width = screening.data.hall.data.width;
    let rows = 0;

    screening.data.hall.data.rows.forEach((element: { count: number; }) => {
        rows += element.count;
    });
        
    let seats: (boolean[])[] = [];
    for(var r = 0; r < rows; r++) {
        var row: boolean[] = [];
        for(var s = 0; s < width; s++) {
            row.push(false);
        }
        seats.push(row);
    }

    collection.docs.forEach((ticket: { data: () => any; }) => {
        seats[ticket.data().row - 1][ticket.data().seat - 1] = true;
    });
    
    return seats; 
}