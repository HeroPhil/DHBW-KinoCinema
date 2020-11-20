const basics = require('./basics');

const moviesCollectionPath = 'live/events/movies';


exports.getAllMovies = async function () {

    let movies = [];

    const collection = await basics.getCollectionByID(moviesCollectionPath);
    collection.forEach(movie => {
        movies.push({
            id: movie.id,
            data: movie.data()
        });
    });

    return movies;
}