const basics = require('./basics');

const moviesCollectionPath = 'live/events/movies';

function Movie (id, data){
    this.id = id;
    this.data = data;
}

exports.getAllMovies = async function () {

    let movies = [];

    const collection = await basics.getCollectionByID(moviesCollectionPath);
    collection.forEach(movie => {
        movies.push(new Movie(movie.id, movie.data()));
    });

    return movies;
}

exports.getMovieByID = async function (id) {
    const document = await basics.getDocumentByID(moviesCollectionPath + '/' + id)
    return new Movie(document.id, document.data());
}