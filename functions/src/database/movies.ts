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

export async function getAllMovies() {
    var movies: Movie[] = [];

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

export async function getTopMovies(amount: string) {
    let movies: Movie[] = [];

    const collection = await basics.getCollectionByIDLimitAmount(moviesCollectionPath, parseInt(amount), topPriority, order);
    collection.forEach(movie => {
        movies.push(new Movie(movie.id, movie.data()));
    });

    return movies;
}

