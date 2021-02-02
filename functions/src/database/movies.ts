import * as basics from './basics';
import { checkIfAdminLogin } from './users';
import { CallableContext } from 'firebase-functions/lib/providers/https';

export const moviesCollectionPath = 'live/events/movies';
export const eventDocumentPath = 'live/events';
const topPriority = 'priority';
const order: "desc" | "asc" = 'desc';

export class Movie {
    id: string;
    data: any;
    constructor(id: string, data: any) {
        this.id = id;
        this.data = data;
    }
}

const allowedKeys = [
    "categories",
    "description",
    "duration",
    "name",
    "priority",
    "cover"
];


export async function getAllMovies() {
    const movies: Movie[] = [];

    const collection = await basics.getCollectionByID(moviesCollectionPath);
    collection.forEach(movie => {
        movies.push(new Movie(movie.id, movie.data()));
        return;
    });

    return movies;
}

export async function getMovieByID(id: string) {
    const document = await basics.getDocumentByID(moviesCollectionPath + '/' + id)
    return new Movie(document.id, document.data());
}

export async function getTopMovies(amount: number) {
    const movies: Movie[] = [];

    const collection = await basics.getCollectionByIDLimitAmount(moviesCollectionPath, amount, topPriority, order);
    collection.forEach(movie => {
        movies.push(new Movie(movie.id, movie.data()));
    });

    return movies;
}

export async function getMoviesByCategory(category: string, amount: number) { //NEEDS CHANGES
    const movies: Movie[] = [];

    const query = await basics.getCollectionRefByID(moviesCollectionPath)
        .where("category", "==", category)
        .orderBy(topPriority, order)
        .limit(amount);
    console.log(amount);
    const collection = await basics.getCollectionByRef(query);

    collection.forEach((movie: { id: string; data: () => any; }) => {
        movies.push(new Movie(movie.id, movie.data()));
    });

    return movies;
}

export async function addMovie(categories: string[], description: string, duration: number, name: string, priority: number, context: CallableContext) {
    let error: {message: string} = { message: "" };
    //check if user is logged in as admin
    const checkAdmin = await checkIfAdminLogin(context)
    if (checkAdmin.error) {
        error = checkAdmin.error;
        return {error};
    }

    const data = {
        categories: categories,
        description: description,
        duration: duration,
        name: name,
        priority: priority
    };

    const movieRef = await basics.addDocToCollectionByID(moviesCollectionPath, data);

    const gsCoverLink = "gs://dhbw-kk-kino.appspot.com/live/events/movies/cover/" + movieRef.id;

    return await updateMovie(movieRef.id, {cover: gsCoverLink}, context);
}

export async function updateMovie(id: string, changes: { [x: string]: any}, context: CallableContext) {
    let error: {message: string} = { message: "" };
    //check if user is logged in as admin
    const checkAdmin = await checkIfAdminLogin(context)
    if (checkAdmin.error) {
        error = checkAdmin.error;
        return {error};
    }

    //check if movie is passed as parameter (defaulted to undefined) and check if movie exists in database
    if(id !== undefined) {
        const movieRef = await basics.getDocumentRefByID(moviesCollectionPath + "/" + id);
        const movieDoc = await basics.getDocumentByRef(movieRef);
        if(!movieDoc.exists) {
            console.log("This movie does not exist!");
            error.message = "This movie does not exist!";
            return {error};
        }
    } else {
        console.log("No movie was passed to the function!");
        error.message = "No movie was passed to the function!";
        return {error};
    }

    //add only valid changes to the object
    const newData: any = {};
    allowedKeys.forEach((key) => {
        if (key in changes) {
            newData[key] = changes[key];
        }
    });
    
    //write valid changes to database
    const movie = await basics.updateDocumentByID(moviesCollectionPath+ '/' + id, newData);
    console.log(movie);
    return await getMovieByID(id);
}

export async function getAllCategories() {
    const document = await basics.getDocumentByID(eventDocumentPath)
    return document.data();
}