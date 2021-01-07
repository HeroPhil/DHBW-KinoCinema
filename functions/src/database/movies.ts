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

export async function getTopMovies(amount: string) {
    const movies: Movie[] = [];

    const collection = await basics.getCollectionByIDLimitAmount(moviesCollectionPath, parseInt(amount), topPriority, order);
    collection.forEach(movie => {
        movies.push(new Movie(movie.id, movie.data()));
    });

    return movies;
}

export async function getMoviesByCategory(category: string, amount: string) {
    const movies: Movie[] = [];

    const query = await basics.getCollectionRefByID(moviesCollectionPath)
        .where("category", "==", category)
        .orderBy(topPriority, order)
        .limit(parseInt(amount));
    console.log(amount);
    const collection = await basics.getCollectionByRef(query);

    collection.forEach((movie: { id: string; data: () => any; }) => {
        movies.push(new Movie(movie.id, movie.data()));
    });

    return movies;
}