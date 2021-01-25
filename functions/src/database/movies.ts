import * as basics from './basics';

export const moviesCollectionPath = 'live/events/movies';
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

interface validChangesInterface {
    [key: string]: any
}

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

export async function getMoviesByCategory(category: string, amount: number) {
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

export async function addMovie(category: string, cover: string, description: string, duration: number, name: string, priority: number) {
    const data = {
        category: category,
        cover: cover,
        description: description,
        duration: duration,
        name: name,
        priority: priority
    };

    const movieRef = await basics.addDocToCollectionByID(moviesCollectionPath, data);
    const movie = await basics.getDocumentByRef(movieRef);

    return new Movie(movie.id, movie.data()); 
}

export async function updateMovie(id: string, newData: {category: string, cover: string, name: string, priority: number, duration: number, description: string}) {
    const error: {message: string} = { message: "" };
    const validChanges: validChangesInterface = {};
    
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
    if("category" in newData) {
        validChanges.category = newData.category;
    }

    if("cover" in newData) {
        validChanges.cover = newData.cover;
    }

    if("description" in newData) {
        validChanges.description = newData.description;
    }

    if("duration" in newData) {
        validChanges.duration = newData.duration;
    }

    if("name" in newData) {
        validChanges.name = newData.name;
    }

    if("priority" in newData) {
        validChanges.priority = newData.priority;
    }
    
    //write valid changes to database
    const movie = await basics.updateDocumentByID(moviesCollectionPath+ '/' + id, validChanges);
    console.log(movie);
    return new Movie(id, validChanges); 
}